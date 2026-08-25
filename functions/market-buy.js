// netlify/functions/market-buy.js
//
// Ported from POST /api/market/buy. A 10% commission is taken on sale
// (rounded down). No path back to real money: gold moves here, gold never
// converts to Pi anywhere in this app — see README.md for why that
// boundary is deliberate and should stay that way.
//
// SECURITY: buyerId is resolved via identity.js the same way as
// market-list.js — see that file's comment. Spending another Pi account's
// gold without their access token is no longer possible.
const { getBlobStore } = require('./_lib/blobStore');
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit, checkUidRateLimit } = require('./_lib/security');
const { resolveIdentity } = require('./_lib/identity');
const { isValidListingId } = require('./_lib/validate');
const { playerStateStore } = require('./_lib/grantEntitlement');
const { mutateJson, ABORT } = require('./_lib/blobWrite');

const MARKET_COMMISSION = 0.10;

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }
    if (!isTrustedOrigin(event)) {
        return jsonResponse(403, { error: 'Forbidden' });
    }
    const rate = await checkRateLimit('market-buy', event, { limit: 20, windowMs: 5 * 60 * 1000 });
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
    const { listingId, buyerId: claimedBuyerId, accessToken } = body || {};
    if (!isValidListingId(listingId)) {
        return jsonResponse(400, { error: 'invalid request' });
    }

    const identity = await resolveIdentity({ accessToken, claimedPlayerId: claimedBuyerId });
    if (!identity) {
        return jsonResponse(401, { error: 'Could not verify player identity' });
    }
    const buyerId = identity.playerId;

    const uidRate = await checkUidRateLimit('market-buy', buyerId, { limit: 20, windowMs: 5 * 60 * 1000 });
    if (uidRate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    const marketStore = getBlobStore('market-listings');
    const stateStore = playerStateStore();

    try {
        // Remove the listing first so a second, near-simultaneous buy
        // request for the same listing sees it already gone.
        const listing = await marketStore.get(listingId, { type: 'json' }).catch(() => null);
        if (!listing) {
            return jsonResponse(404, { error: 'listing no longer available' });
        }
        await marketStore.delete(listingId);

        if (listing.sellerId === buyerId) {
            await marketStore.setJSON(listingId, listing); // put it back
            return jsonResponse(400, { error: "you can't buy your own listing" });
        }

        // SECURITY FIX: both of these were a bare get-then-set on the
        // player-state blob, with no concurrency guard — e.g. a buyer
        // completing two purchases back to back, or a seller getting paid
        // out from a sale at the same moment they receive a gift or an
        // IAP grant, could race and lose one of the two updates entirely
        // (a real gold change silently vanishing). Now goes through
        // mutateJson (see _lib/blobWrite.js), which re-applies the same
        // check-then-mutate logic against the freshest read on each retry.
        let notEnoughGold = false;
        const buyerResult = await mutateJson(stateStore, buyerId, (current) => {
            const buyerState = current || {};
            if ((buyerState.gold || 0) < listing.price) {
                notEnoughGold = true;
                return ABORT;
            }
            buyerState.gold -= listing.price;
            if (!buyerState.skins) buyerState.skins = {};
            if (!buyerState.skins[listing.buildingKey]) buyerState.skins[listing.buildingKey] = [0];
            buyerState.skins[listing.buildingKey].push(listing.skinIdx);
            return buyerState;
        });
        if (buyerResult.aborted) {
            await marketStore.setJSON(listingId, listing); // refund the listing
            return jsonResponse(400, { error: notEnoughGold ? 'not enough gold' : 'purchase failed' });
        }

        const payout = Math.floor(listing.price * (1 - MARKET_COMMISSION));
        await mutateJson(stateStore, listing.sellerId, (current) => {
            const sellerState = current || {};
            sellerState.gold = (sellerState.gold || 0) + payout;
            return sellerState;
        });

        return jsonResponse(200, { ok: true, paid: listing.price, sellerReceived: payout });
    } catch (err) {
        console.error('market-buy error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
