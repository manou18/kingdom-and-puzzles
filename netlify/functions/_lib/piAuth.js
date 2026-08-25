// netlify/functions/_lib/piAuth.js
//
// Verifies a Pi access token against Pi's own API and returns the
// CONFIRMED { uid, username } for it — mirrors the pattern used inline in
// chesspi-board's get-progress.js/save-progress.js/submit-score.js (each
// repeats this same GET /v2/me call), pulled into one shared helper here
// since more endpoints in this app need it. The uid/username returned are
// never taken from the client — only from what Pi's own servers say about
// this specific token.
//
// Returns null if the token is missing, invalid, or expired. Every caller
// must treat null as "reject the request" for anything that requires a
// real, verified Pi identity — see identity.js.
const axios = require('axios');

async function verifyPiAccessToken(accessToken) {
    if (!accessToken || typeof accessToken !== 'string') return null;
    try {
        const res = await axios.get('https://api.minepi.com/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 10000,
        });
        const uid = res.data && res.data.uid;
        const username = res.data && res.data.username;
        if (!uid) return null;
        return { uid, username: username || null };
    } catch (err) {
        console.error('piAuth: token verification failed:', err.response ? err.response.data : err.message);
        return null;
    }
}

module.exports = { verifyPiAccessToken };
