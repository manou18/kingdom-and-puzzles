// netlify/functions/gift-send.js
//
// Ported from POST /api/gift/send in the original server.js. Delivery
// grants the gift's contents (gold/badge/frame) directly into the
// recipient's server-side record in the same write as the mailbox entry
// (see the recipient mutateJson call below) — the mailbox entry itself
// (pendingGifts) now exists only to drive the "you got a gift!" toast and
// gift-history log the next time that player's app loads (see
// applyPendingGifts() in script.js), not to carry the actual grant.
//
// SECURITY: senderId is resolved via identity.js — a signed-in Pi player's
// canonical id (`pi_<uid>`) is derived from a verified access token, never
// taken as-is from the `senderId` field the request happens to include.
// Spending another Pi account's gold on a gift without their access token
// is no longer possible. The gift record also stores `fromUsername` taken
// from that SAME verified identity (never from anything the client sends
// for it), so the recipient's client can show a real name — see
// displayName in leaderboard.js and fromUsername handling in
// applyPendingGifts() in script.js.
//
// recipientId itself is NOT identity-verified here (nor was it in the
// original design) — it's just which mailbox the gift gets delivered to,
// same trust level as "this is who I clicked 🎁 next to on the
// leaderboard". There's no way to spend someone else's resources or act on
// their behalf via recipientId, so it doesn't need the same proof senderId
// does.
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit, checkUidRateLimit } = require('./_lib/security');
const { resolveIdentity } = require('./_lib/identity');
const { isValidPlayerId } = require('./_lib/validate');
const { playerStateStore } = require('./_lib/grantEntitlement');
const { mutateJson, ABORT } = require('./_lib/blobWrite');

const GIFT_DAILY_LIMIT = 5;
const GIFT_GOLD_MIN = 5;
const GIFT_GOLD_MAX = 200;
// Must stay byte-for-byte identical to CANNED_GIFT_MESSAGES in script.js —
// always accepted verbatim and unfiltered.
const CANNED_GIFT_MESSAGES = [
    'Congrats! 🎉', 'Thanks for playing together! 🤝', 'Good luck! 🍀', 'Enjoy! 🎁',
    'Well deserved! 👏', 'You inspire me! ✨', 'Keep it up! 💪', 'From one Pioneer to another 🏰',
];
const GIFT_MESSAGE_MAX_LEN = 60;
const GIFT_MESSAGE_URL_RE = /(https?:\/\/|www\.)/i;
const GIFT_MESSAGE_DOMAIN_RE = /\b[a-z0-9-]+\.(com|net|org|io|co|info|biz|xyz|ru|gg|app|dev|me|link|tv|shop)\b/i;

function isValidGiftMessage(message) {
    if (message === undefined || message === null || message === '') return true;
    if (typeof message !== 'string') return false;
    if (CANNED_GIFT_MESSAGES.includes(message)) return true;
    if (message.length > GIFT_MESSAGE_MAX_LEN) return false;
    if (/[<>]/.test(message)) return false;
    if (GIFT_MESSAGE_URL_RE.test(message) || GIFT_MESSAGE_DOMAIN_RE.test(message)) return false;
    return true;
}

// Mirrors the gold prices of the subset of client-side BADGES/BADGE_FRAMES
// that are safe to gift. Keep in sync with script.js if those prices ever
// change — deliberately duplicated rather than trusting a price the client
// sends.
const GIFTABLE_BADGES = {
    moon: 150, star: 90, flame: 120, blossom: 60, falcon: 135, dragon: 240,
    compass: 105, clover: 75, horseshoe: 75, evileye: 90, rabbitfoot: 105, bookworm: 120,
    friendship: 100, // gift-exclusive — see GIFT_EXCLUSIVE_BADGES in script.js
};
const GIFTABLE_FRAMES = {
    silver: 45, gold: 60, jeweled: 120,
    ribbon: 90, // gift-exclusive — see GIFT_EXCLUSIVE_FRAMES in script.js
};

function todayKey() {
    return new Date().toISOString().slice(0, 10);
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }
    if (!isTrustedOrigin(event)) {
        return jsonResponse(403, { error: 'Forbidden' });
    }
    const rate = await checkRateLimit('gift-send', event, { limit: 10, windowMs: 5 * 60 * 1000 });
    if (rate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }
    if (!event.body) {
        return jsonResponse(400, { error: 'No body provided' });
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return jsonResponse(400, { error: 'invalid JSON' });
    }
    const { senderId: claimedSenderId, accessToken, recipientId, kind, itemId, amount, message } = body || {};

    if (!isValidPlayerId(recipientId)) {
        return jsonResponse(400, { error: 'invalid recipient id' });
    }
    if (!['gold', 'badge', 'frame'].includes(kind)) {
        return jsonResponse(400, { error: 'invalid gift kind' });
    }
    if (message !== undefined && message !== null && !isValidGiftMessage(message)) {
        return jsonResponse(400, { error: 'invalid message' });
    }

    const identity = await resolveIdentity({ accessToken, claimedPlayerId: claimedSenderId });
    if (!identity) {
        return jsonResponse(401, { error: 'Could not verify player identity' });
    }
    const senderId = identity.playerId;

    if (senderId === recipientId) {
        return jsonResponse(400, { error: "you can't gift yourself" });
    }

    const uidRate = await checkUidRateLimit('gift-send', senderId, { limit: 10, windowMs: 5 * 60 * 1000 });
    if (uidRate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    let cost, giftPayload;
    if (kind === 'gold') {
        if (!Number.isInteger(amount) || amount < GIFT_GOLD_MIN || amount > GIFT_GOLD_MAX) {
            return jsonResponse(400, { error: 'invalid gold amount' });
        }
        cost = amount;
        giftPayload = { kind: 'gold', amount };
    } else if (kind === 'badge') {
        if (!Object.prototype.hasOwnProperty.call(GIFTABLE_BADGES, itemId)) {
            return jsonResponse(400, { error: 'that badge cannot be gifted' });
        }
        cost = GIFTABLE_BADGES[itemId];
        giftPayload = { kind: 'badge', itemId };
    } else {
        if (!Object.prototype.hasOwnProperty.call(GIFTABLE_FRAMES, itemId)) {
            return jsonResponse(400, { error: 'that frame cannot be gifted' });
        }
        cost = GIFTABLE_FRAMES[itemId];
        giftPayload = { kind: 'frame', itemId };
    }

    try {
        const store = playerStateStore();

        const recipientState = await store.get(recipientId, { type: 'json' }).catch(() => null);
        if (!recipientState) {
            return jsonResponse(404, { error: 'recipient not found' });
        }
        if (kind === 'badge' && (recipientState.ownedBadges || []).includes(itemId)) {
            return jsonResponse(400, { error: 'recipient already owns that badge' });
        }
        if (kind === 'frame' && (recipientState.ownedFrames || []).includes(itemId)) {
            return jsonResponse(400, { error: 'recipient already owns that frame' });
        }

        // SECURITY FIX: both the sender's spend and the recipient's
        // mailbox write used to be a bare get-then-set. For the sender,
        // two gift requests fired close together (or a gift racing a
        // state-save) could both read the same gold/giftsSentCount and
        // both pass their checks, spending more gold than the sender
        // actually had and/or exceeding the daily gift limit. For the
        // recipient, two different senders gifting the same recipient at
        // once could race on the pendingGifts push and one gift would
        // silently vanish — the sender charged, the recipient never
        // receiving it. Both now go through mutateJson (see
        // _lib/blobWrite.js), which re-applies the same checks against the
        // freshest read on every retry.
        let failReason = null;
        let senderUsernameFallback = null;
        const senderResult = await mutateJson(store, senderId, (current) => {
            if (!current) {
                failReason = 'sender not found';
                return ABORT;
            }
            const senderState = current;
            senderUsernameFallback = senderState.piUsername || null;
            const today = todayKey();
            if (senderState.giftsSentDate !== today) {
                senderState.giftsSentDate = today;
                senderState.giftsSentCount = 0;
            }
            if ((senderState.giftsSentCount || 0) >= GIFT_DAILY_LIMIT) {
                failReason = `You can only send ${GIFT_DAILY_LIMIT} gifts per day`;
                return ABORT;
            }
            if ((senderState.gold || 0) < cost) {
                failReason = 'not enough gold';
                return ABORT;
            }
            senderState.gold -= cost;
            senderState.giftsSentCount = (senderState.giftsSentCount || 0) + 1;
            return senderState;
        });
        if (senderResult.aborted) {
            return jsonResponse(failReason === 'sender not found' ? 404 : 400, { error: failReason || 'gift failed' });
        }

        const gift = {
            id: `gift_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
            fromPlayerId: senderId,
            // Never taken from the client — only from this request's own
            // verified identity (or whatever this sender's state already
            // had stored from a prior state-save, for a guest sender who
            // has no verified username at all).
            fromUsername: identity.username || senderUsernameFallback,
            message: message || null,
            sentAt: Date.now(),
            ...giftPayload,
        };
        await mutateJson(store, recipientId, (current) => {
            const freshRecipientState = current || {};
            if (!Array.isArray(freshRecipientState.pendingGifts)) freshRecipientState.pendingGifts = [];
            freshRecipientState.pendingGifts.push(gift);

            // SECURITY FIX (follow-up): grant the gift's actual contents
            // here, server-side, in the same write — instead of leaving
            // ownership entirely up to the recipient's own client
            // faithfully applying pendingGifts later (see
            // applyPendingGifts() in script.js). state-save.js no longer
            // accepts a client-added badge/frame id it doesn't already
            // have on file (see that file's SELF_EARNABLE_* lists), so if
            // this endpoint didn't grant it here, a gifted badge/frame
            // would show a toast on the recipient's device and then
            // silently fail to ever actually persist. pendingGifts now
            // exists purely to drive that toast/history UI — the
            // ownership grant no longer depends on it.
            if (giftPayload.kind === 'gold') {
                freshRecipientState.gold = (freshRecipientState.gold || 0) + giftPayload.amount;
            } else if (giftPayload.kind === 'badge') {
                if (!Array.isArray(freshRecipientState.ownedBadges)) freshRecipientState.ownedBadges = [];
                if (!freshRecipientState.ownedBadges.includes(giftPayload.itemId)) {
                    freshRecipientState.ownedBadges.push(giftPayload.itemId);
                }
            } else if (giftPayload.kind === 'frame') {
                if (!Array.isArray(freshRecipientState.ownedFrames)) freshRecipientState.ownedFrames = [];
                if (!freshRecipientState.ownedFrames.includes(giftPayload.itemId)) {
                    freshRecipientState.ownedFrames.push(giftPayload.itemId);
                }
            }
            return freshRecipientState;
        });

        return jsonResponse(200, { ok: true, cost });
    } catch (err) {
        console.error('gift-send error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
