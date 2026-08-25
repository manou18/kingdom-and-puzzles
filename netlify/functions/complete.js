// netlify/functions/complete.js
//
// Called by the client's Pi.createPayment onReadyForServerCompletion
// callback (and by onIncompletePaymentFound when resuming an interrupted
// payment — see script.js). Client sends ONLY `{ paymentId, txid }` — same
// as approve.js, no playerId/accessToken involved (see the comment at the
// top of approve.js for why). This is the ONLY place a purchase actually
// gets applied to a player's stored state:
//   1. Requires an 'approved' ledger record for this paymentId (written by
//      approve.js from data it fetched from Pi — never from the client).
//   2. Calls Pi's /complete endpoint.
//   3. Re-fetches the payment from Pi and requires
//      status.developer_completed to actually be true before granting
//      anything, AND requires payment.user_uid to match the uid the
//      ledger record was approved under — Pi's own payment record is the
//      identity check here, exactly like approve.js.
//   4. Grants the entitlement server-side (grantEntitlement.js) and
//      returns the updated state so the client can adopt it directly (see
//      data.grantedState in purchaseWithPi()'s onReadyForServerCompletion).
//   5. Idempotent: if this paymentId was already completed, returns the
//      previous result again instead of granting a second time.
const axios = require('axios');
const { getBlobStore } = require('./_lib/blobStore');
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit } = require('./_lib/security');
const { isValidPaymentId } = require('./_lib/validate');
const { grantEntitlement } = require('./_lib/grantEntitlement');

exports.handler = async (event) => {
    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
        console.error('complete: PI_API_KEY is not configured');
        return jsonResponse(500, { error: 'Server misconfigured' });
    }

    try {
        if (event.httpMethod !== 'POST') {
            return jsonResponse(405, { error: 'Method not allowed' });
        }
        if (!isTrustedOrigin(event)) {
            return jsonResponse(403, { error: 'Forbidden' });
        }
        const rate = await checkRateLimit('complete', event, { limit: 10, windowMs: 5 * 60 * 1000 });
        if (rate.limited) {
            return jsonResponse(429, { error: 'Too many requests, please slow down' });
        }
        if (!event.body) {
            return jsonResponse(400, { error: 'No body provided' });
        }

        const body = JSON.parse(event.body);
        const { paymentId, txid } = body;

        if (!isValidPaymentId(paymentId) || typeof txid !== 'string' || !txid) {
            return jsonResponse(400, { error: 'Missing paymentId or txid' });
        }

        const paymentsStore = getBlobStore('payments');

        // SECURITY FIX: the old code read `record`, checked its status,
        // and only much later (after two Pi API round-trips and a grant)
        // wrote `status: 'completed'` back — with nothing locking the
        // record in between. Two nearly-simultaneous calls for the same
        // paymentId (a client retry, or a race with
        // onIncompletePaymentFound / cleanup-stale-payments.js's recovery
        // pass) could both pass the "not completed yet" check and both
        // reach grantEntitlement, double-granting gems/gold/patron time
        // for a single real payment. Fixed by atomically claiming the
        // record (an etag-guarded conditional write to a transient
        // 'granting' status) BEFORE doing any Pi API work or granting
        // anything — only the caller that wins the claim proceeds; a
        // loser is told to retry rather than granting a second time.
        let current;
        try {
            current = await paymentsStore.getWithMetadata(paymentId, { type: 'json' });
        } catch {
            current = null;
        }
        const record = current && current.data;

        if (!record || record.status === 'cancelled') {
            console.error('complete: no approved ledger record for paymentId', paymentId);
            return jsonResponse(400, { error: 'Payment was not approved through this app' });
        }

        // Idempotent replay: already completed — return the same result
        // again instead of granting the entitlement a second time.
        if (record.status === 'completed') {
            return jsonResponse(200, { message: 'Completed', grantedState: record.grantedState || null, alreadyCompleted: true });
        }
        if (record.status === 'granting') {
            // Someone else is already mid-flight on this exact paymentId.
            return jsonResponse(409, { error: 'Payment completion already in progress, please retry shortly' });
        }

        const preClaimStatus = record.status;
        let claimed = false;
        if (current && typeof current.etag === 'string') {
            try {
                const wrote = await paymentsStore.set(
                    paymentId,
                    JSON.stringify({ ...record, status: 'granting' }),
                    { onlyIfMatch: current.etag },
                );
                claimed = wrote !== false;
            } catch {
                claimed = false;
            }
        } else {
            // Conditional writes unsupported by this SDK/store — fall back
            // to the original unconditional behavior rather than throwing;
            // this path is no worse than before this fix, just not improved.
            await paymentsStore.setJSON(paymentId, { ...record, status: 'granting' });
            claimed = true;
        }
        if (!claimed) {
            const fresh = await paymentsStore.get(paymentId, { type: 'json' }).catch(() => null);
            if (fresh && fresh.status === 'completed') {
                return jsonResponse(200, { message: 'Completed', grantedState: fresh.grantedState || null, alreadyCompleted: true });
            }
            return jsonResponse(409, { error: 'Payment completion already in progress, please retry shortly' });
        }

        // From here on, this request holds the claim — any early return
        // MUST release it (revert status back to what it was before the
        // claim) or the payment gets stuck at 'granting' forever and can
        // never be retried. releaseClaim() is best-effort: if it fails too,
        // we've already logged everything needed to fix it by hand.
        const releaseClaim = async () => {
            try {
                await paymentsStore.setJSON(paymentId, { ...record, status: preClaimStatus });
            } catch (releaseErr) {
                console.error('complete: failed to release claim on', paymentId, releaseErr.message);
            }
        };

        try {
            const axiosClient = axios.create({ baseURL: 'https://api.minepi.com' });
            const config = { headers: { Authorization: `Key ${PI_API_KEY}` }, timeout: 10000 };

            await axiosClient.post(`/v2/payments/${paymentId}/complete`, { txid }, config);

            // Re-fetch from Pi to get the authoritative post-completion status
            // rather than assuming the POST above succeeding means the
            // payment is actually settled.
            let payment;
            try {
                const paymentRes = await axiosClient.get(`/v2/payments/${paymentId}`, config);
                payment = paymentRes.data;
            } catch (fetchErr) {
                console.error('complete: could not re-fetch payment from Pi:', fetchErr.message);
                await releaseClaim();
                return jsonResponse(502, { error: 'Could not verify completed payment with Pi' });
            }

            const completed = !!(payment && payment.status && payment.status.developer_completed);
            if (!completed) {
                console.error('complete: Pi does not report this payment as completed', paymentId);
                await releaseClaim();
                return jsonResponse(400, { error: 'Payment is not confirmed complete' });
            }
            if (`pi_${payment.user_uid}` !== record.playerId) {
                console.error('complete: uid mismatch between ledger and Pi payment', { ledgerPlayerId: record.playerId, paymentUid: payment.user_uid });
                await releaseClaim();
                return jsonResponse(400, { error: 'Payment/user mismatch' });
            }

            // The product to grant was already resolved and validated by
            // approve.js — grant exactly that, never re-resolve from raw
            // metadata here (avoids re-deriving Starter Offer eligibility a
            // second time against state that may have moved on).
            const grantedState = await grantEntitlement(record.playerId, record.product, paymentId);

            await paymentsStore.setJSON(paymentId, {
                ...record,
                status: 'completed',
                txid,
                completedAt: Date.now(),
                grantedState,
            });

            return jsonResponse(200, { message: 'Completed', grantedState });
        } catch (innerError) {
            await releaseClaim();
            throw innerError;
        }
    } catch (error) {
        console.error('complete error:', error.message);
        return jsonResponse(500, { error: 'Completion failed: ' + error.message });
    }
};
