// netlify/functions/_lib/grantEntitlement.js
//
// SECURITY: this is the only place in the whole backend allowed to add
// gems/gold, extend patronUntil, or mark a Starter Offer week claimed. It
// is called from complete.js (and cleanup-stale-payments.js for the "paid
// on Pi but the client never confirmed" recovery path), and only after:
//   (a) Pi's API confirms the payment is developer_completed, and
//   (b) we have our own "approved" ledger record (written by approve.js)
//       proving this metadata/uid pair was the one actually approved for
//       this paymentId.
//
// Unlike chesspi-board, this game keeps ONE blob per player holding their
// entire game state (city, tribe, puzzle progress, gold, gems, ...) rather
// than a narrow "progress" record — this function reads that same blob,
// applies the grant, and writes it back, mirroring applyGrant() from the
// original server.js exactly.
//
// SECURITY FIX: this read-modify-write now goes through mutateJson's
// optimistic-concurrency guard (see _lib/blobWrite.js) instead of a bare
// get-then-set. Without it, two grants landing on the same player's record
// at nearly the same instant (e.g. a real completion racing
// cleanup-stale-payments.js's recovery pass for the SAME paymentId, or two
// different purchases completing back to back) could both read the same
// starting state and one write would silently clobber the other's gold/
// gems/patron update — the second grant would vanish with no error. The
// mutator re-applies the grant logic against whatever the freshest read
// actually is on each retry, so it's safe even if it has to run twice.
//
// SECURITY FIX (idempotency): the player-state blob and the payment-record
// blob are two separate stores with no cross-store transaction — this
// function writes the former, then complete.js/cleanup-stale-payments.js
// separately mark the payment record 'completed' afterward. If the process
// dies in the gap between those two writes (a hard timeout, a crash — not
// something a try/catch can guard against), the payment record is left
// looking un-granted even though the grant already landed, and whichever
// caller retries it next (a client retry, complete.js's own claim-release
// path, or cleanup-stale-payments.js's next daily pass) would call this
// function again and double-grant. Closed by making the grant itself
// idempotent per paymentId: every call now records paymentId in the
// player's own state (grantedPaymentIds) in the SAME write as the grant,
// and no-ops on a repeat call for a paymentId already recorded there —
// safe no matter which caller retries it, or how many times.
const { getBlobStore } = require('./blobStore');
const { mutateJson } = require('./blobWrite');

// Bounded so a long-lived whale account's history can't grow this array
// forever — far more than any realistic purchase history, kept purely so
// a very-delayed retry (e.g. a manual cleanup run months later) still gets
// caught; older entries fall off the front once the cap is hit.
const MAX_TRACKED_PAYMENT_IDS = 1000;

function playerStateStore() {
    return getBlobStore('player-state');
}

function applyProductToState(state, product) {
    if (product.kind === 'gems') {
        state.gems = (state.gems || 0) + product.gems;
    } else if (product.kind === 'gold') {
        state.gold = (state.gold || 0) + product.gold;
    } else if (product.kind === 'patron') {
        const now = Date.now();
        const currentUntil = state.patronUntil ? new Date(state.patronUntil).getTime() : 0;
        const base = currentUntil > now ? currentUntil : now; // stacks onto remaining time instead of wasting it
        state.patronUntil = new Date(base + product.days * 86400000).toISOString();
        state.patronTier = product.tier === 'plus' ? 'plus' : 'basic';
        if (product.tier === 'plus') {
            // Exclusive Patron+ badge/frame — granted once, kept forever,
            // same "never take away something already bought" rule as
            // every other cosmetic. Mirrors PATRON_PLUS_BADGE /
            // PATRON_PLUS_FRAME in script.js.
            if (!Array.isArray(state.ownedBadges)) state.ownedBadges = [];
            if (!state.ownedBadges.includes('patron-plus')) state.ownedBadges.push('patron-plus');
            if (!Array.isArray(state.ownedFrames)) state.ownedFrames = [];
            if (!state.ownedFrames.includes('patron-plus-frame')) state.ownedFrames.push('patron-plus-frame');
        }
    } else if (product.kind === 'starter') {
        // Belt-and-suspenders re-check at grant time, in case two payments
        // for the same account/week both cleared the earlier check in
        // approve.js concurrently — only the first one to actually reach
        // here grants anything. Now that this whole mutator runs under
        // mutateJson, this also correctly re-checks against the freshest
        // state on every retry, not just the very first read.
        if (!Array.isArray(state.starterOfferClaimedWeeks)) state.starterOfferClaimedWeeks = [];
        if (state.starterOfferClaimedWeeks.includes(product.weekIndex)) return state;
        state.gems = (state.gems || 0) + product.gems;
        state.starterOfferClaimedWeeks.push(product.weekIndex);
    }
    return state;
}

// Applies a resolved product (see products.js#resolveProduct) to playerId's
// stored state and persists the result. `paymentId` is optional (the
// original chesspi-board-style grant call had no notion of it) but should
// always be passed by IAP callers now — it's what makes a repeat call for
// the same payment a safe no-op instead of a double-grant. Returns the
// updated state object either way.
async function grantEntitlement(playerId, product, paymentId) {
    const store = playerStateStore();
    const { value } = await mutateJson(store, playerId, (current) => {
        const state = current || {};
        if (paymentId) {
            if (!Array.isArray(state.grantedPaymentIds)) state.grantedPaymentIds = [];
            if (state.grantedPaymentIds.includes(paymentId)) {
                return state; // already granted — no-op, safe to call again
            }
            applyProductToState(state, product);
            state.grantedPaymentIds.push(paymentId);
            if (state.grantedPaymentIds.length > MAX_TRACKED_PAYMENT_IDS) {
                state.grantedPaymentIds = state.grantedPaymentIds.slice(-MAX_TRACKED_PAYMENT_IDS);
            }
            return state;
        }
        return applyProductToState(state, product);
    });
    return value;
}

module.exports = { grantEntitlement, playerStateStore };
