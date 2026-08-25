// netlify/functions/market-listings.js
//
// Ported from GET /api/market/listings. Each listing is its own blob in the
// 'market-listings' store (keyed by listing id), instead of the original's
// single JSON array file — plays nicer with Blobs' list()/get()/delete()
// per-key model and avoids one big file being the single point of
// contention for every list/buy/cancel.
//
// Deliberately open public read (no isTrustedOrigin check) — same stance
// as leaderboard.js — but still rate-limited by IP.
const { getBlobStore } = require('./_lib/blobStore');
const { jsonResponse } = require('./_lib/jsonResponse');
const { checkRateLimit } = require('./_lib/security');

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }

    const rate = await checkRateLimit('market-listings', event, { limit: 60, windowMs: 5 * 60 * 1000 });
    if (rate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    try {
        const store = getBlobStore('market-listings');
        const listings = [];
        let cursor;
        do {
            const page = await store.list({ cursor });
            cursor = page.cursor;
            for (const { key } of page.blobs) {
                const listing = await store.get(key, { type: 'json' }).catch(() => null);
                if (listing) listings.push(listing);
            }
        } while (cursor);
        return jsonResponse(200, listings);
    } catch (err) {
        console.error('market-listings error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
