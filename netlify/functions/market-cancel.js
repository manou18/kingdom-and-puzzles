// netlify/functions/market-cancel.js
//
// Ported from POST /api/market/cancel. SECURITY: sellerId is resolved via
// identity.js the same way as market-list.js — see that file's comment.
const { getBlobStore } = require('./_lib/blobStore');
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit, checkUidRateLimit } = require('./_lib/security');
const { resolveIdentity } = require('./_lib/identity');
const { isValidListingId } = require('./_lib/validate');
const { playerStateStore } = require('./_lib/grantEntitlement');
const { mutateJson } = require('./_lib/blobWrite');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }
    if (!isTrustedOrigin(event)) {
        return jsonResponse(403, { error: 'Forbidden' });
    }
    const rate = await checkRateLimit('market-cancel', event, { limit: 20, windowMs: 5 * 60 * 1000 });
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
    const { listingId, sellerId: claimedSellerId, accessToken } = body || {};
    if (!isValidListingId(listingId)) {
        return jsonResponse(400, { error: 'invalid request' });
    }

    const identity = await resolveIdentity({ accessToken, claimedPlayerId: claimedSellerId });
    if (!identity) {
        return jsonResponse(401, { error: 'Could not verify player identity' });
    }
    const sellerId = identity.playerId;

    const uidRate = await checkUidRateLimit('market-cancel', sellerId, { limit: 20, windowMs: 5 * 60 * 1000 });
    if (uidRate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    try {
        const marketStore = getBlobStore('market-listings');
        const listing = await marketStore.get(listingId, { type: 'json' }).catch(() => null);
        if (!listing || listing.sellerId !== sellerId) {
            return jsonResponse(404, { error: 'listing not found' });
        }
        await marketStore.delete(listingId);

        // SECURITY FIX: bare get-then-set replaced with mutateJson (see
        // _lib/blobWrite.js) so a cancel racing another write to this same
        // seller's state (another listing, a state-save) can't silently
        // lose the returned skin.
        const stateStore = playerStateStore();
        await mutateJson(stateStore, sellerId, (current) => {
            const state = current || {};
            if (!state.skins) state.skins = {};
            if (!state.skins[listing.buildingKey]) state.skins[listing.buildingKey] = [0];
            if (!state.skins[listing.buildingKey].includes(listing.skinIdx)) {
                state.skins[listing.buildingKey].push(listing.skinIdx);
            }
            return state;
        });

        return jsonResponse(200, { ok: true });
    } catch (err) {
        console.error('market-cancel error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
