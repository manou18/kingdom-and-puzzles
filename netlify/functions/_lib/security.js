// netlify/functions/_lib/security.js
//
// Two lightweight, dependency-free defenses against automated/bot traffic
// hitting the app's sensitive, user-triggered endpoints (payment
// approve/cancel/complete, starting a game, submitting a score). Neither
// is bulletproof alone — headers can be spoofed, and the rate limiter
// below is best-effort under heavy concurrency — but together they filter
// out the overwhelming majority of scripted/scraper traffic cheaply,
// without any new paid infrastructure.

const { getBlobStore } = require('./blobStore');

// --- Origin check ---------------------------------------------------------
//
// These endpoints are only ever meant to be called by this app's own
// client-side JS, running in the Pi Browser webview, via a same-origin
// POST fetch() to a relative /.netlify/functions/... URL. Browsers always
// attach an Origin header to same-origin POST requests, so a request
// missing it entirely, or whose Origin/Referer host doesn't match the
// Host it actually arrived on, did not come from the app's own page —
// almost certainly a script, curl, or bot calling the endpoint directly.
// This needs zero configuration (no domain to hardcode or keep in sync)
// since it just compares the request against itself.
function isTrustedOrigin(event) {
    const originHeader = event.headers.origin || event.headers.referer;
    if (!originHeader) return false;

    let originHost;
    try {
        originHost = new URL(originHeader).host;
    } catch {
        return false;
    }

    const requestHost = event.headers.host || event.headers['x-forwarded-host'];
    return !!requestHost && originHost === requestHost;
}

// --- Rate limiting ---------------------------------------------------------
//
// Fixed-window counter per (endpoint, client IP), backed by the same
// Netlify Blobs store every other function here already uses. Not exact
// under heavy concurrent load, but that's fine — this only needs to catch
// obvious bot bursts (many calls from one IP in a short window), not
// enforce a precise quota.
function getClientIp(event) {
    return (
        event.headers['x-nf-client-connection-ip'] ||
        (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
        'unknown'
    );
}

// IMPROVEMENT: this used to be a plain get-then-set with no concurrency
// guard at all, so two requests arriving in the same instant could both
// read the same `count`, both decide "still under the limit", and both
// write back count+1 — silently letting a burst through one request over
// the configured limit for every truly-concurrent pair. That's the
// documented "best-effort, can slightly over-count" behavior.
//
// This now uses Netlify Blobs' optimistic-concurrency write
// (getWithMetadata()'s etag + set({ onlyIfMatch })) when the installed
// SDK version supports it: the write only lands if nobody else changed
// the record between our read and our write, and we retry a few times on
// conflict instead of silently overwriting a concurrent update. If the
// SDK/store doesn't support conditional writes for any reason (older
// version, unexpected response shape), this falls back to the original
// unconditional get-then-set so rate limiting keeps working exactly as
// before rather than throwing — it just loses the extra concurrency
// guarantee in that fallback case, same as before this change.
const MAX_CONFLICT_RETRIES = 3;

async function checkRateLimitByKey(bucketKey, { limit, windowMs }) {
    const store = getBlobStore('rate-limits');

    for (let attempt = 0; attempt <= MAX_CONFLICT_RETRIES; attempt++) {
        const now = Date.now();

        let current;
        try {
            current = await store.getWithMetadata(bucketKey, { type: 'json' });
        } catch {
            current = null; // Conditional path unavailable — fall back below.
        }

        // SDK doesn't support getWithMetadata / returned an unusable
        // shape: fall back to the simple, non-conditional behavior this
        // function always had.
        if (!current || typeof current.etag !== 'string') {
            const record = await store.get(bucketKey, { type: 'json' }).catch(() => null);
            if (!record || now - record.windowStart > windowMs) {
                await store.setJSON(bucketKey, { windowStart: now, count: 1 });
                return { limited: false };
            }
            if (record.count + 1 > limit) {
                return { limited: true };
            }
            await store.setJSON(bucketKey, { windowStart: record.windowStart, count: record.count + 1 });
            return { limited: false };
        }

        const record = current.data;
        const isNewWindow = !record || now - record.windowStart > windowMs;
        const nextRecord = isNewWindow
            ? { windowStart: now, count: 1 }
            : { windowStart: record.windowStart, count: record.count + 1 };

        if (!isNewWindow && record.count + 1 > limit) {
            return { limited: true };
        }

        try {
            const wrote = await store.set(bucketKey, JSON.stringify(nextRecord), {
                onlyIfMatch: current.etag
            });
            // Some SDK versions return a boolean success flag; others
            // resolve void on success and throw/reject on conflict. Treat
            // an explicit `false` the same as a thrown conflict: retry.
            if (wrote === false) continue;
            return { limited: false };
        } catch {
            // Someone else wrote to this bucket between our read and our
            // write — retry with a fresh read rather than clobbering
            // their update or silently under-counting.
            continue;
        }
    }

    // Exhausted retries under very heavy contention on this single
    // bucket — fail open (don't block a legitimate request) rather than
    // fail closed, matching this limiter's role as a best-effort bot
    // filter, not a hard quota.
    return { limited: false };
}

// IP-keyed limit. This is the cheap, first-pass filter: it runs before
// any Pi API call, so it catches anonymous/scripted bot bursts (bad or
// stolen tokens, no token at all) at minimal cost. Its blind spot is
// shared IPs (a school, an ISP's carrier-grade NAT) where many real
// players can look like one caller — see checkUidRateLimit below for the
// layer that covers that gap.
async function checkRateLimit(name, event, opts) {
    const ip = getClientIp(event);
    return checkRateLimitByKey(`${name}:ip:${ip}`, opts);
}

// uid-keyed limit. Only usable *after* the caller has already verified
// the access token against Pi's /v2/me (so uid is Pi-confirmed, never
// client-supplied) — this is deliberately a second layer, not a
// replacement for checkRateLimit: it catches one real account calling an
// endpoint too often regardless of which IP/network they're on, without
// letting one bad IP throttle every legitimate player behind it.
async function checkUidRateLimit(name, uid, opts) {
    return checkRateLimitByKey(`${name}:uid:${uid}`, opts);
}

module.exports = { isTrustedOrigin, checkRateLimit, checkUidRateLimit };
