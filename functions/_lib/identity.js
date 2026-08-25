// netlify/functions/_lib/identity.js
//
// SECURITY: resolves the one canonical, trustworthy playerId for a
// request — closing the gap the original design had, where every endpoint
// simply trusted whatever `playerId` string the client included with no
// proof at all (a request could claim `pi_anyone_elses_username` and the
// server would act on it as if it were really them).
//
// Mirrors chesspi-board's pattern (verify the access token against Pi's
// own GET /v2/me, then use the uid Pi itself returns — never the uid/name
// the client claims) exactly, adapted for this game's two identity kinds:
//
//   - Pi-signed-in player: accessToken is verified via piAuth.js. The
//     canonical playerId is derived as `pi_<uid>` from Pi's CONFIRMED uid
//     — never from any playerId the request also happens to include.
//     `username` comes from that same verified response, for storing as a
//     trustworthy display name (see grantEntitlement.js's state.piUsername
//     handling and leaderboard.js's displayName field) — again, never
//     taken from the client directly.
//   - Guest (no Pi account): accepted only when the claimed playerId is
//     shaped like `guest_<random>` — there's no Pi identity to verify, and
//     no real money or cross-account impersonation value in a self-chosen
//     random guest id, so this stays exactly as trusting as the original
//     design was for guests specifically.
//
// A request claiming a `pi_`-prefixed identity WITHOUT a valid accessToken
// is rejected outright (returns null) — this is precisely the gap being
// closed.
const { verifyPiAccessToken } = require('./piAuth');
const { isValidPlayerId } = require('./validate');

async function resolveIdentity({ accessToken, claimedPlayerId }) {
    if (accessToken) {
        const identity = await verifyPiAccessToken(accessToken);
        if (!identity) return null;
        const playerId = `pi_${identity.uid}`;
        // SECURITY FIX (defense-in-depth): every OTHER playerId in this
        // backend is checked against isValidPlayerId's shape before it's
        // trusted as a Blob store key (see validate.js) — this
        // Pi-derived one was the one exception, built from Pi's own API
        // response and used as-is with no shape check at all. Pi's API is
        // a much stronger trust boundary than anything client-supplied,
        // but it's still a third party — an unexpected uid shape (a bug
        // on Pi's end, an unexpected response format, a mispointed
        // PI_API_KEY hitting the wrong environment) shouldn't get to skip
        // the one check every other identity in this system has to pass.
        if (!isValidPlayerId(playerId)) {
            console.error('identity: Pi returned an unexpected uid shape, refusing to trust it:', identity.uid);
            return null;
        }
        return { playerId, username: identity.username, verified: true };
    }
    if (isValidPlayerId(claimedPlayerId) && claimedPlayerId.startsWith('guest_')) {
        return { playerId: claimedPlayerId, username: null, verified: false };
    }
    return null;
}

module.exports = { resolveIdentity };
