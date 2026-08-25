// netlify/functions/approve.js
//
// Called by the client's Pi.createPayment onReadyForServerApproval callback
// (see purchaseWithPi() in script.js). Ported from the /api/payments/approve
// route in the original server.js, hardened using the same pattern as
// chesspi-board's approve.js (used here as the reference implementation),
// including its most important fix:
//
//   SECURITY: this used to accept a `playerId` field straight from the
//   request body and credit the payment to THAT with no proof at all —
//   anyone could approve a payment "for" any pi_<username> they typed in.
//   Fixed the same way chesspi-board does it: the client sends ONLY
//   `{ paymentId }` (see purchaseWithPi() — no playerId, no accessToken).
//   Identity instead comes from Pi's OWN payment record — `payment.user_uid`
//   from GET /v2/payments/:id — which Pi itself attaches based on which
//   account was actually signed in when the payment was created. There is
//   no client-suppliable field for this at all, so there's nothing to
//   spoof. (This is a stronger guarantee than the accessToken-verification
//   pattern used for state-save.js/market-*.js/gift-send.js in this app —
//   those need a token because they're not tied to a specific Pi payment
//   object the way approve/complete are.)
//
// Full flow:
//   1. Bot/abuse filtering BEFORE any Pi API call — see _lib/security.js:
//      isTrustedOrigin (rejects anything not called from this app's own
//      page) and checkRateLimit (a per-IP fixed-window limit). No
//      per-player rate limit here — same as chesspi-board's approve.js —
//      since which player this is isn't known until after the Pi API
//      fetch below.
//   2. Fetches the payment itself from Pi's API (GET /v2/payments/:id) —
//      this is where user_uid, amount, and metadata all come from; never
//      trusted from the request body.
//   3. Resolves metadata against the server-side catalog (products.js) —
//      unrecognized products, or gem/gold packs and patron tiers that
//      don't match a real catalog entry, are rejected outright. Starter
//      Offer eligibility is checked against this player's own stored
//      state (accountCreatedAt, starterOfferClaimedWeeks) — never the
//      client.
//   4. Sanity-checks the paid amount against that product's expected
//      price (generous tolerance — see products.js) using the cached
//      Pi/USD rate. A missing rate fails CLOSED (payment rejected), never
//      skipped.
//   5. Calls Pi's /approve endpoint.
//   6. Writes a ledger record {playerId, product, amount, status:
//      'approved'} keyed by paymentId — complete.js requires this before
//      it will grant anything.
const axios = require('axios');
const { getBlobStore } = require('./_lib/blobStore');
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit } = require('./_lib/security');
const { resolveProduct, isPlausibleAmount, isPlausiblePiAmount } = require('./_lib/products');
const { getCachedPiUsdRate } = require('./_lib/piPrice');
const { isValidPaymentId } = require('./_lib/validate');
const { playerStateStore } = require('./_lib/grantEntitlement');

exports.handler = async (event) => {
    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
        console.error('approve: PI_API_KEY is not configured');
        return jsonResponse(500, { error: 'Server misconfigured' });
    }

    try {
        if (event.httpMethod !== 'POST') {
            return jsonResponse(405, { error: 'Method not allowed' });
        }
        if (!isTrustedOrigin(event)) {
            return jsonResponse(403, { error: 'Forbidden' });
        }
        const rate = await checkRateLimit('approve', event, { limit: 10, windowMs: 5 * 60 * 1000 });
        if (rate.limited) {
            return jsonResponse(429, { error: 'Too many requests, please slow down' });
        }
        if (!event.body) {
            return jsonResponse(400, { error: 'No body provided' });
        }

        const body = JSON.parse(event.body);
        const paymentId = body.paymentId;

        if (!isValidPaymentId(paymentId)) {
            return jsonResponse(400, { error: 'Missing paymentId' });
        }

        const axiosClient = axios.create({ baseURL: 'https://api.minepi.com' });
        const config = { headers: { Authorization: `Key ${PI_API_KEY}` }, timeout: 10000 };

        // Authoritative source for who's paying, how much, and for what —
        // never trust these values if they were ever sent by the client.
        let payment;
        try {
            const paymentRes = await axiosClient.get(`/v2/payments/${paymentId}`, config);
            payment = paymentRes.data;
        } catch (fetchErr) {
            console.error('approve: could not fetch payment from Pi:', fetchErr.message);
            return jsonResponse(400, { error: 'Could not verify payment with Pi' });
        }

        const uid = payment && payment.user_uid;
        const amount = payment && Number(payment.amount);
        const metadata = payment && payment.metadata;
        if (!uid || !(amount > 0) || !metadata) {
            return jsonResponse(400, { error: 'Malformed payment from Pi' });
        }
        const playerId = `pi_${uid}`;

        // Read this player's real stored state so Starter Offer
        // eligibility (accountCreatedAt, already-claimed weeks) is
        // resolved from server-side records, never from the client.
        const stateStore = playerStateStore();
        const existingState = await stateStore.get(playerId, { type: 'json' }).catch(() => null);

        const product = resolveProduct(metadata, {
            accountCreatedAt: existingState && existingState.accountCreatedAt,
            claimedWeeks: existingState && existingState.starterOfferClaimedWeeks,
        });
        if (!product) {
            console.error('approve: unrecognized/ineligible product, refusing to approve:', metadata);
            return jsonResponse(400, { error: 'Payment does not match an offer this server grants' });
        }

        // Amount sanity check. Products priced directly in Pi (currently
        // only the Starter Offer) are checked against expectedPi and never
        // touch the USD/piUsdRate path, so a price-feed outage can't block
        // that specific product. Everything else (gem/gold packs, patron)
        // is USD-pegged and fails CLOSED if no Pi/USD rate is available at
        // all — never silently skipped.
        if (product.expectedPi) {
            if (!isPlausiblePiAmount(amount, product.expectedPi)) {
                console.error('approve: amount implausibly low for Pi-denominated product', { metadata, amount, expectedPi: product.expectedPi });
                return jsonResponse(400, { error: 'Payment amount does not match product price' });
            }
        } else {
            const piUsdRate = await getCachedPiUsdRate();
            if (!piUsdRate) {
                console.error('approve: no Pi/USD rate available, refusing to approve without an amount check', { metadata });
                return jsonResponse(503, { error: 'Price feed unavailable — please try again in a moment' });
            }
            if (!isPlausibleAmount(amount, product.expectedUsd, piUsdRate)) {
                console.error('approve: amount implausibly low for product', { metadata, amount, expectedUsd: product.expectedUsd, piUsdRate });
                return jsonResponse(400, { error: 'Payment amount does not match product price' });
            }
        }

        const approve = await axiosClient.post(`/v2/payments/${paymentId}/approve`, {}, config);
        if (approve.status < 200 || approve.status >= 300) {
            return jsonResponse(502, { error: 'Pi approval failed' });
        }

        // Ledger entry — complete.js refuses to grant anything for a
        // paymentId that isn't recorded here as 'approved'. Store the
        // resolved product (not just raw metadata) so complete.js and
        // cleanup-stale-payments.js grant exactly what was validated here,
        // including the Starter Offer's weekIndex.
        const paymentsStore = getBlobStore('payments');
        await paymentsStore.setJSON(paymentId, {
            playerId,
            product,
            amount,
            status: 'approved',
            createdAt: Date.now(),
        });

        return jsonResponse(200, { message: 'Approved' });
    } catch (error) {
        console.error('approve error:', error.message);
        return jsonResponse(500, { error: 'Approval failed: ' + error.message });
    }
};
