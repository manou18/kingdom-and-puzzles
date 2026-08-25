// netlify/functions/market-list.js
//
// Ported from POST /api/market/list. Pulls the skin out of the seller's
// inventory immediately (so it can't be equipped/used/listed twice while
// the listing is live), then writes the listing as its own blob.
//
// SECURITY: sellerId is resolved via identity.js — a signed-in Pi player's
// canonical id (`pi_<uid>`) is derived from a verified access token, never
// taken as-is from the `sellerId` field the request happens to include.
// Listing a skin "as" another Pi account without their access token is no
// longer possible.
const { getBlobStore } = require('./_lib/blobStore');
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit, checkUidRateLimit } = require('./_lib/security');
const { resolveIdentity } = require('./_lib/identity');
const { playerStateStore } = require('./_lib/grantEntitlement');
const { mutateJson, ABORT } = require('./_lib/blobWrite');
const { BUILDING_KEYS } = require('./_lib/cosmetics');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }
    if (!isTrustedOrigin(event)) {
        return jsonResponse(403, { error: 'Forbidden' });
    }
    const rate = await checkRateLimit('market-list', event, { limit: 20, windowMs: 5 * 60 * 1000 });
    if (rate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }
    if (!event.body) {
        return jsonResponse(400, { error: 'No body provided' });
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return jsonResponse(400, { error: 'invalid JSON' });
    }
    const { sellerId: claimedSellerId, accessToken, buildingKey, skinIdx, price } = body || {};
    // SECURITY FIX: buildingKey used to be accepted as "any string", then
    // used directly as an object key into state.skins[buildingKey] and
    // state.equippedSkin[buildingKey]. A value like "__proto__" reads/
    // writes that object's actual prototype instead of a normal property
    // (a prototype-pollution-adjacent bug — see _lib/cosmetics.js's
    // BUILDING_KEYS comment) rather than a real building's skin array. In
    // practice the mismatched shape (Object.prototype has no .includes())
    // just threw and got caught as a generic 500 here, but relying on that
    // accidental crash instead of an explicit whitelist is fragile. Now
    // validated against the same BUILDING_KEYS list cosmetic-buy.js uses.
    if (
        typeof buildingKey !== 'string' || !BUILDING_KEYS.includes(buildingKey) ||
        !Number.isInteger(skinIdx) || skinIdx <= 0 ||
        !Number.isInteger(price) || price <= 0 || price > 1000000
    ) {
        return jsonResponse(400, { error: 'invalid listing' });
    }

    const identity = await resolveIdentity({ accessToken, claimedPlayerId: claimedSellerId });
    if (!identity) {
        return jsonResponse(401, { error: 'Could not verify player identity' });
    }
    const sellerId = identity.playerId;

    const uidRate = await checkUidRateLimit('market-list', sellerId, { limit: 20, windowMs: 5 * 60 * 1000 });
    if (uidRate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    try {
        const stateStore = playerStateStore();
        // SECURITY FIX: was a bare get-then-set — a seller listing two
        // skins in quick succession (or listing while a state-save lands)
        // could race and either double-pull the same skinIdx or lose the
        // other write. Now guarded by mutateJson (see _lib/blobWrite.js).
        let notOwned = false;
        const result = await mutateJson(stateStore, sellerId, (current) => {
            const state = current || {};
            const owned = state.skins && state.skins[buildingKey];
            if (!owned || !owned.includes(skinIdx)) {
                notOwned = true;
                return ABORT;
            }
            state.skins[buildingKey] = owned.filter((i) => i !== skinIdx);
            if (state.equippedSkin && state.equippedSkin[buildingKey] === skinIdx) {
                state.equippedSkin[buildingKey] = 0;
            }
            return state;
        });
        if (result.aborted) {
            return jsonResponse(400, { error: notOwned ? "you don't own that skin" : 'listing failed' });
        }

        const listing = {
            id: `lst_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
            sellerId, buildingKey, skinIdx, price, createdAt: Date.now(),
        };
        const marketStore = getBlobStore('market-listings');
        await marketStore.setJSON(listing.id, listing);

        return jsonResponse(200, { ok: true, listing });
    } catch (err) {
        console.error('market-list error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
