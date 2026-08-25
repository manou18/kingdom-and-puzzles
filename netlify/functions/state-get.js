// netlify/functions/state-get.js
//
// Ported from GET /api/state/:playerId in the original server.js. Netlify
// Functions don't get a path-param router the way Express does, so the
// playerId/accessToken travel as query string params instead — see
// loadRemote() in script.js.
//
// SECURITY: identity is now resolved via identity.js — a signed-in Pi
// player's canonical playerId (`pi_<uid>`) is derived from a verified
// access token, never taken as-is from the `playerId` query param. That
// param is only trusted for a guest_-prefixed id (see identity.js for why
// that's a lower-stakes case). Requesting another Pi account's save
// without their access token is no longer possible.
//
// No isTrustedOrigin check here: unlike the payment endpoints, a save load
// is a plain read with no side effects, so a stricter origin check isn't
// worth the risk of a false-positive blocking a real player (mirrors
// get-leaderboard.js's public-read stance in the chesspi-board reference
// app). It's still rate-limited both by IP (catches anonymous bot bursts)
// and by playerId (catches one account being hammered regardless of which
// shared IP/network it's coming from).
const { jsonResponse } = require('./_lib/jsonResponse');
const { checkRateLimit, checkUidRateLimit } = require('./_lib/security');
const { resolveIdentity } = require('./_lib/identity');
const { playerStateStore } = require('./_lib/grantEntitlement');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }

    const rate = await checkRateLimit('state-get', event, { limit: 60, windowMs: 5 * 60 * 1000 });
    if (rate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    const params = event.queryStringParameters || {};
    const identity = await resolveIdentity({ accessToken: params.accessToken, claimedPlayerId: params.playerId });
    if (!identity) {
        return jsonResponse(401, { error: 'Could not verify player identity' });
    }
    const playerId = identity.playerId;

    const uidRate = await checkUidRateLimit('state-get', playerId, { limit: 60, windowMs: 5 * 60 * 1000 });
    if (uidRate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    try {
        const store = playerStateStore();
        const state = await store.get(playerId, { type: 'json' });
        if (!state) {
            return jsonResponse(404, { error: 'no save found' });
        }
        return jsonResponse(200, state);
    } catch (err) {
        console.error('state-get error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
