// netlify/functions/cleanup-stale-payments.js
//
// Ported from chesspi-board's cleanup-stale-payments.js. PURPOSE: over time,
// the 'payments' Blobs store accumulates records stuck in status 'approved'
// — approve.js wrote them, but complete.js was never called (the player
// closed the app after signing on-chain, lost connectivity, etc). This
// function runs on a schedule and reconciles those records instead of just
// deleting them:
//   - developer_completed === true on Pi's side -> finish the grant
//     ourselves, exactly as complete.js would have, and mark it 'completed'.
//   - otherwise (cancelled / never confirmed / expired on Pi's side) ->
//     mark it 'expired' (kept for audit history, not deleted).
// Already-'expired' records past PURGE_EXPIRED_AFTER_MS are hard-deleted so
// the store doesn't grow unbounded. 'completed' records are never touched.
//
// SECURITY: this does not weaken approve.js/complete.js — complete.js
// already refuses to grant anything without an 'approved' ledger record, so
// this only ever makes that check stricter over time.
const axios = require('axios');
const { getBlobStore } = require('./_lib/blobStore');
const { jsonResponse } = require('./_lib/jsonResponse');
const { grantEntitlement } = require('./_lib/grantEntitlement');

const STALE_AFTER_MS = 24 * 60 * 60 * 1000; // 24 hours
const PURGE_EXPIRED_AFTER_MS = 25 * 24 * 60 * 60 * 1000; // 25 days

exports.handler = async () => {
    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
        console.error('cleanup-stale-payments: PI_API_KEY is not configured');
        return jsonResponse(500, { error: 'Server misconfigured' });
    }

    const paymentsStore = getBlobStore('payments');
    const axiosClient = axios.create({ baseURL: 'https://api.minepi.com' });
    const config = { headers: { Authorization: `Key ${PI_API_KEY}` }, timeout: 10000 };

    const summary = { scanned: 0, completedLate: 0, expired: 0, purged: 0, skipped: 0, errors: 0 };

    try {
        let cursor;
        do {
            const page = await paymentsStore.list({ cursor });
            cursor = page.cursor;

            for (const { key: paymentId } of page.blobs) {
                summary.scanned++;
                try {
                    const record = await paymentsStore.get(paymentId, { type: 'json' });
                    if (!record) continue;

                    if (record.status === 'expired') {
                        const expiredAge = Date.now() - (record.expiredAt || record.createdAt || 0);
                        if (expiredAge >= PURGE_EXPIRED_AFTER_MS) {
                            await paymentsStore.delete(paymentId);
                            summary.purged++;
                        }
                        continue;
                    }

                    // SECURITY FIX (follow-up): also recover records stuck
                    // at 'granting' — complete.js's transient claim-lock
                    // status (see that file) — not just 'approved' ones.
                    // A record can be left there forever if the function
                    // process dies hard (a timeout, a crash) between
                    // claiming the payment and releasing/finishing it,
                    // since nothing else would ever touch it again
                    // otherwise. Safe to treat the same as a stale
                    // 'approved' record now that grantEntitlement() is
                    // idempotent per paymentId (see _lib/grantEntitlement.js)
                    // — if the grant already landed before the crash, this
                    // just re-marks the record 'completed' without
                    // granting anything a second time.
                    if (record.status !== 'approved' && record.status !== 'granting') continue; // 'completed' etc — never touched
                    const age = Date.now() - (record.createdAt || 0);
                    if (age < STALE_AFTER_MS) continue; // too recent, leave it alone

                    let payment;
                    try {
                        const res = await axiosClient.get(`/v2/payments/${paymentId}`, config);
                        payment = res.data;
                    } catch (fetchErr) {
                        console.error('cleanup-stale-payments: could not fetch payment from Pi, skipping', paymentId, fetchErr.message);
                        summary.errors++;
                        continue;
                    }

                    const completedOnPi = !!(payment && payment.status && payment.status.developer_completed);
                    const txid = payment && payment.transaction && payment.transaction.txid;

                    // Re-check right before writing, in case complete.js
                    // finished this payment while we were mid-loop.
                    const freshRecord = await paymentsStore.get(paymentId, { type: 'json' }).catch(() => null);
                    if (!freshRecord || (freshRecord.status !== 'approved' && freshRecord.status !== 'granting')) {
                        summary.skipped++;
                        continue;
                    }

                    if (completedOnPi && txid) {
                        // Pi confirms the player actually paid — finish
                        // the grant ourselves rather than stranding them.
                        // Grant exactly the product approve.js already
                        // validated (record.product), never re-resolve
                        // from raw metadata here.
                        if (!record.product) {
                            console.error('cleanup-stale-payments: ledger record has no resolved product, leaving for manual review', paymentId);
                            summary.errors++;
                            continue;
                        }
                        const grantedState = await grantEntitlement(record.playerId, record.product, paymentId);
                        await paymentsStore.setJSON(paymentId, {
                            ...record,
                            status: 'completed',
                            txid,
                            completedAt: Date.now(),
                            completedBy: 'cleanup-stale-payments',
                            grantedState,
                        });
                        summary.completedLate++;
                    } else {
                        // Not completed on Pi's side either — genuinely
                        // abandoned. Keep the record for audit history.
                        await paymentsStore.setJSON(paymentId, {
                            ...record,
                            status: 'expired',
                            expiredAt: Date.now(),
                            expiredReason: 'no developer_completed status from Pi after ' + STALE_AFTER_MS + 'ms',
                        });
                        summary.expired++;
                    }
                } catch (itemErr) {
                    console.error('cleanup-stale-payments: error processing', paymentId, itemErr.message);
                    summary.errors++;
                }
            }
        } while (cursor);

        console.log('cleanup-stale-payments: done', summary);
        return jsonResponse(200, summary);
    } catch (error) {
        console.error('cleanup-stale-payments error:', error.message);
        return jsonResponse(500, { error: 'Cleanup failed: ' + error.message });
    }
};

// Netlify scheduled function config — runs once a day, invoked internally
// by Netlify's scheduler (not reachable via a normal public HTTP request).
exports.config = { schedule: '@daily' };
