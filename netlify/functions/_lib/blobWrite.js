// netlify/functions/_lib/blobWrite.js
//
// SECURITY FIX: shared optimistic-concurrency read-modify-write helper for
// JSON blobs, generalized from the onlyIfMatch/etag retry pattern that
// security.js's checkRateLimitByKey already used for the rate-limit
// counters (see that function for the original, well-commented version).
// That pattern was never applied to the money-relevant blobs — a player's
// state (gold/gems/skins/badges) and payment records — even though those
// are exactly the writes where two concurrent requests silently clobbering
// each other actually costs someone something (a lost gem grant, a lost
// gift, a market payout overwritten by an unrelated save).
//
// Any function that reads a player's (or a listing's/payment's) JSON
// record, changes it, and writes it back should go through mutateJson
// instead of a bare get-then-set.
const MAX_CONFLICT_RETRIES = 4;

// Sentinel a mutate() callback can return to abort without writing (e.g.
// the record failed a business-rule check once actually read under lock).
const ABORT = Symbol('blobWrite.abort');

// mutate(currentValueOrNull) => nextValue | ABORT (sync or async).
// Returns { aborted, value } on success/abort. Throws only if every retry
// hit contention — money-relevant writes should fail closed (surface a
// retryable error) rather than silently drop or double-apply an update,
// unlike the rate limiter's fail-open behavior.
async function mutateJson(store, key, mutate) {
    for (let attempt = 0; attempt <= MAX_CONFLICT_RETRIES; attempt++) {
        let current;
        try {
            current = await store.getWithMetadata(key, { type: 'json' });
        } catch {
            current = null;
        }

        // SDK/store doesn't support conditional reads (older @netlify/blobs,
        // or an unexpected response shape) — fall back to the plain
        // get-then-set every one of these functions originally did, so
        // this never throws just because conditional writes aren't
        // available. Loses the extra concurrency guarantee only in that
        // fallback case.
        if (!current || typeof current.etag !== 'string') {
            const record = await store.get(key, { type: 'json' }).catch(() => null);
            const result = await mutate(record);
            if (result === ABORT) return { aborted: true, value: null };
            await store.setJSON(key, result);
            return { aborted: false, value: result };
        }

        const result = await mutate(current.data || null);
        if (result === ABORT) return { aborted: true, value: null };

        try {
            const wrote = await store.set(key, JSON.stringify(result), {
                onlyIfMatch: current.etag,
            });
            // Some SDK versions return a boolean success flag; others
            // resolve void on success and throw/reject on conflict.
            if (wrote === false) continue;
            return { aborted: false, value: result };
        } catch {
            continue; // someone else wrote first — retry with a fresh read
        }
    }
    throw new Error(`blob write conflict on "${key}": too much contention, please retry`);
}

module.exports = { mutateJson, ABORT };
