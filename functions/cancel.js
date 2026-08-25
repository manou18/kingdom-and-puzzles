// netlify/functions/cancel.js
//
// Ported from chesspi-board's cancel.js. Bot/abuse filtering (see
// _lib/security.js) runs before anything else. Forwards the cancel to Pi's
// API, and — if an 'approved' ledger record exists for this paymentId —
// marks it 'cancelled' so a captured/replayed complete.js call can never
// grant an entitlement for a payment that was cancelled.
const axios = require('axios');
const { getBlobStore } = require('./_lib/blobStore');
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit } = require('./_lib/security');
const { isValidPaymentId } = require('./_lib/validate');

exports.handler = async (event) => {
    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
        console.error('cancel: PI_API_KEY is not configured');
        return jsonResponse(500, { error: 'Server misconfigured' });
    }

    try {
        if (event.httpMethod !== 'POST') {
            return jsonResponse(405, { error: 'Method not allowed' });
        }
        if (!isTrustedOrigin(event)) {
            return jsonResponse(403, { error: 'Forbidden' });
        }
        const rate = await checkRateLimit('cancel', event, { limit: 10, windowMs: 5 * 60 * 1000 });
        if (rate.limited) {
            return jsonResponse(429, { error: 'Too many requests, please slow down' });
        }
        if (!event.body) {
            return jsonResponse(400, { error: 'No body provided' });
        }

        const body = JSON.parse(event.body);
        const paymentId = body.paymentId;

        // SECURITY FIX: this used to accept any non-empty string, unlike
        // approve.js/complete.js which both use isValidPaymentId's shape
        // check. Tightened to match — keeps arbitrary-length/format input
        // from reaching Pi's API and the Blob store key.
        if (!isValidPaymentId(paymentId)) {
            return jsonResponse(400, { error: 'Missing paymentId' });
        }

        const axiosClient = axios.create({ baseURL: 'https://api.minepi.com' });
        const config = { headers: { Authorization: `Key ${PI_API_KEY}` }, timeout: 10000 };

        await axiosClient.post(`/v2/payments/${paymentId}/cancel`, {}, config);

        try {
            const paymentsStore = getBlobStore('payments');
            const record = await paymentsStore.get(paymentId, { type: 'json' }).catch(() => null);
            if (record && record.status !== 'completed') {
                await paymentsStore.setJSON(paymentId, { ...record, status: 'cancelled', cancelledAt: Date.now() });
            }
        } catch (ledgerErr) {
            // Non-fatal — the Pi-side cancel above already succeeded, and
            // complete.js independently re-verifies with Pi before
            // granting anything, so a missed ledger update here can't by
            // itself cause a false grant.
            console.error('cancel: failed to update ledger record:', ledgerErr.message);
        }

        return jsonResponse(200, { message: 'Canceled' });
    } catch (error) {
        console.error('cancel error:', error.message);
        return jsonResponse(500, { error: 'Cancel failed' });
    }
};
