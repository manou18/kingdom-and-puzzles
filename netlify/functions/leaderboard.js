// netlify/functions/leaderboard.js
//
// Ported from GET /api/leaderboard in the original server.js. Lists every
// key in the 'player-state' Blobs store and returns the public stats — the
// client sorts by whichever metric the player picks, so this stays one
// endpoint instead of several.
//
// displayName: for a Pi-signed-in player this is `s.piUsername` — set
// server-side in state-save.js from a verified Pi access token, never from
// anything the client could claim directly. playerId itself is now an
// opaque `pi_<uid>` (see identity.js) with no readable name embedded in
// it, so this field is what the client actually shows/searches by (see
// renderLeaderboardList()/displayNameForPlayerId() in script.js). Falls
// back to a stripped guest_ id for guest players, who have no Pi username
// at all.
//
// Deliberately open public read (no isTrustedOrigin check), matching
// get-leaderboard.js's stance in the chesspi-board reference app — still
// rate-limited by IP so a bot can't hammer a full-store scan on repeat.
//
// PERFORMANCE NOTE: this reads every player's state blob on every request,
// same trade-off the original file-scan version made — fine at small scale,
// revisit (e.g. a maintained, periodically-updated leaderboard blob) once
// you have real traffic.
const { jsonResponse } = require('./_lib/jsonResponse');
const { checkRateLimit } = require('./_lib/security');
const { playerStateStore } = require('./_lib/grantEntitlement');
const { isValidPlayerId } = require('./_lib/validate');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }

    const rate = await checkRateLimit('leaderboard', event, { limit: 30, windowMs: 5 * 60 * 1000 });
    if (rate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    try {
        const store = playerStateStore();
        const players = [];
        let cursor;
        do {
            const page = await store.list({ cursor });
            cursor = page.cursor;
            for (const { key: playerId } of page.blobs) {
                if (!isValidPlayerId(playerId)) continue;
                try {
                    const s = await store.get(playerId, { type: 'json' });
                    if (!s) continue;
                    const displayName = s.piUsername
                        || (playerId.startsWith('guest_') ? playerId.replace(/^guest_/, '') + ' (guest)' : null);
                    players.push({
                        playerId,
                        displayName,
                        gold: s.gold || 0,
                        prestigeCount: s.prestigeCount || 0,
                        totalDonated: s.totalDonated || 0,
                        streak: s.streak || 0,
                        equippedBadge: s.equippedBadge || null, // cosmetic only — safe to expose publicly
                        equippedFrame: s.equippedFrame || null, // cosmetic only — safe to expose publicly
                    });
                } catch {
                    /* skip an unreadable/corrupt save rather than failing the whole list */
                }
            }
        } while (cursor);

        return jsonResponse(200, players);
    } catch (err) {
        console.error('leaderboard error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
