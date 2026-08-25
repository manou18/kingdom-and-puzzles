// netlify/functions/state-save.js
//
// Ported from POST /api/state/:playerId in the original server.js. Takes
// { playerId, accessToken, state } in the body instead of a path param —
// see saveRemote() in script.js.
//
// SECURITY: identity is resolved via identity.js — a signed-in Pi player's
// canonical playerId (`pi_<uid>`) is derived from a verified access token,
// never taken as-is from the `playerId` field (see identity.js). Writing
// to another Pi account's save without their access token is no longer
// possible.
//
// state.piUsername is set here from that SAME verified identity — never
// from anything the client sends for it — so leaderboard.js can show a
// real display name without ever trusting a client-claimed one.
//
// accountCreatedAt stays server-authoritative: set once, the first time
// this backend ever sees a save for this account, and never moved
// afterward. This is what gates STARTER_OFFER_* eligibility in
// products.js, so a reinstall or a locally-edited save can't reset or
// fast-forward through the offer window.
//
// SECURITY FIX (critical): this endpoint used to do `const toSave =
// { ...state }` — accepting the ENTIRE client-supplied state object and
// persisting it almost verbatim, overriding only accountCreatedAt and
// piUsername. Every other field, including gold, gems, patronUntil,
// patronTier, ownedBadges, ownedFrames, starterOfferClaimedWeeks, and
// skins, was taken as-is from whatever the client sent. Since the client
// is just this game's own JS running in a webview, a player could tamper
// with a save request (dev tools, or a hand-crafted POST straight to this
// endpoint with their own accessToken) and set gold/gems/patronUntil/
// ownedBadges to anything at all — completely bypassing the real-money IAP
// path that grantEntitlement.js exists specifically to gatekeep (see that
// file's own top comment: "the only place ... allowed to add gems/gold,
// extend patronUntil, or mark a Starter Offer week claimed"). Worse, a
// forged skin/badge could then be listed on the market or sent as a gift
// to a real player for real currency (see market-list.js / gift-send.js),
// laundering the fabricated value into someone else's account.
//
// Fixed with a layered approach, since this game's gold/gems ARE also a
// normal, entirely client-driven spend/earn currency for everyday
// gameplay (buildings, hints, badges, frames, skins, effects, auras, sound
// packs — see buyBadge()/buyFrame()/etc. in script.js), not just an IAP
// balance — so this endpoint can't simply refuse to ever accept a new
// gold/gems value the way it can for pure IAP flags:
//   1. PROTECTED_FIELDS are values ONLY ever supposed to move through a
//      server-verified path (real-money IAP, or another endpoint here
//      that already validates identity/ownership/limits itself). The
//      client's copy of these is always discarded and replaced with
//      whatever this backend already had on file — never trusted, no
//      exceptions, and there is no legitimate gameplay reason a client
//      save would ever need to change them itself.
//   2. gold/gems are sanitized to a finite non-negative integer and
//      clamped to a generous sanity ceiling (CURRENCY_CAP) — they remain
//      client-authoritative for ordinary play (this can't be fully closed
//      without moving every spend/earn action to its own validated
//      server endpoint, a much larger redesign), but this stops the
//      demonstrated worst case of an arbitrarily large fabricated
//      balance, and bounds how much value a tampered save could ever
//      inject into the market/gift economy.
//   3. pendingGifts may only shrink relative to what the server already
//      has on file (matched by each gift's server-assigned `id`) — the
//      client legitimately needs to clear entries it already applied
//      (see applyPendingGifts() in script.js), but can never inject a
//      fabricated gift entry that was never actually sent via
//      gift-send.js.
//   4. equippedBadge/equippedFrame/equippedSkin are validated against
//      this same save's (post-sanitization) ownership lists, so a
//      client can't merely CLAIM to be displaying a badge/frame/skin
//      it doesn't actually own — purely a cosmetic-integrity check.
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit, checkUidRateLimit } = require('./_lib/security');
const { resolveIdentity } = require('./_lib/identity');
const { playerStateStore } = require('./_lib/grantEntitlement');
const { mutateJson } = require('./_lib/blobWrite');
const { BUILDING_KEYS } = require('./_lib/cosmetics');

const MAX_BODY_BYTES = 256 * 1024; // 256kb, matches the original express.json() limit

// Only ever set by a server-verified path elsewhere in this backend
// (grantEntitlement.js for gems/gold/patron/starter-offer/grantedPaymentIds;
// gift-send.js for the gift counters) — never trusted from the client's
// own save.
const PROTECTED_FIELDS = [
    'patronUntil', 'patronTier',
    'starterOfferClaimedWeeks',
    'giftsSentDate', 'giftsSentCount',
    'grantedPaymentIds',
    'accountCreatedAt', 'piUsername',
];

// SECURITY FIX (follow-up): ownedEffects/ownedAuras/ownedSoundPacks/skins
// have NO legitimate source other than a purchase — every single entry in
// them across the entire game is bought with gold or gems (see
// cosmetic-buy.js) — so unlike ownedBadges/ownedFrames below, the
// client's copy of these is now discarded entirely, the same as the
// PROTECTED_FIELDS above. Before cosmetic-buy.js existed, this endpoint
// had to trust these because they were the ONLY path that ever wrote
// them; now that a validated server endpoint does, nothing here needs to
// grant them anymore. `skins` is an object (keyed by buildingKey), not an
// array, so it's applied separately below rather than through this list.
const FULLY_PROTECTED_ARRAY_FIELDS = ['ownedEffects', 'ownedAuras', 'ownedSoundPacks'];

// ownedBadges/ownedFrames are different: most entries are purchasable
// (now via cosmetic-buy.js) or granted server-side (patron-plus via
// grantEntitlement.js, gift-exclusive ones via gift-send.js — both of
// which land in `existing` already, same as any other protected grant),
// but a few are earned purely by playing — checked and added by the
// client itself the moment the condition becomes true (see
// checkAchievementBadges()/doPrestige()/checkCollections() in script.js) —
// and have no dedicated server endpoint of their own. Since none of these
// specific ids are giftable or ever appear in a market listing (badges/
// frames aren't tradeable at all — see market-list.js, which only ever
// deals with skins), a client fabricating one of these specific ids is a
// purely cosmetic, non-transferable claim, not an economic exploit — so
// this endpoint allows the client to ADD (never remove) exactly these ids
// if they're not already present, and drops anything else it doesn't
// already recognize as already-owned.
const SELF_EARNABLE_BADGE_IDS = ['founder', 'wordsmith'];
const SELF_EARNABLE_FRAME_IDS = ['luck-collection', 'skyward-collection'];

// Generous ceilings — far beyond anything reachable through normal play
// or the largest real IAP pack (GOLD_PACKS/GEM_PACKS top out at 7000/5000
// per purchase in products.js), but finite, so a tampered save can't set
// an unbounded balance.
const MAX_GOLD = 5_000_000;
const MAX_GEMS = 250_000;

function sanitizeCurrency(value, existingValue, max) {
    const fallback = Number.isFinite(existingValue) && existingValue >= 0 ? Math.floor(existingValue) : 0;
    if (!Number.isFinite(value) || value < 0) return fallback;
    return Math.min(Math.floor(value), max);
}

// Client may only add ids from `selfEarnableIds` that aren't already in
// `existingValue` — every other id the client claims to own (including
// anything purchasable) is dropped unless the server already had it on
// file.
function mergeSelfEarnable(clientValue, existingValue, selfEarnableIds) {
    const existing = Array.isArray(existingValue) ? existingValue : [];
    const claimed = Array.isArray(clientValue) ? clientValue : [];
    const merged = existing.slice();
    for (const id of claimed) {
        if (typeof id === 'string' && selfEarnableIds.includes(id) && !merged.includes(id)) {
            merged.push(id);
        }
    }
    return merged;
}

// pendingGifts: the client may only remove entries (after applying them
// locally), never add ones the server never actually delivered via
// gift-send.js. Matched by each gift's server-assigned `id`.
function sanitizePendingGifts(clientValue, existingValue) {
    const existing = Array.isArray(existingValue) ? existingValue : [];
    if (!Array.isArray(clientValue)) return existing;
    const existingIds = new Set(existing.map((g) => g && g.id));
    const seen = new Set();
    const kept = [];
    for (const item of clientValue) {
        const id = item && item.id;
        if (typeof id === 'string' && existingIds.has(id) && !seen.has(id)) {
            seen.add(id);
            const original = existing.find((g) => g.id === id);
            kept.push(original); // always the server's own copy of the entry, never the client's
        }
    }
    return kept;
}

// Cosmetic-consistency only: a client can't claim to be wearing a
// badge/frame/skin it doesn't (post-sanitization) actually own. Called
// AFTER merged.ownedBadges/ownedFrames/skins are already finalized above.
function sanitizeEquipped(clientState, toSave) {
    const ownedBadges = Array.isArray(toSave.ownedBadges) ? toSave.ownedBadges : [];
    const ownedFrames = Array.isArray(toSave.ownedFrames) ? toSave.ownedFrames : [];
    const skins = toSave.skins && typeof toSave.skins === 'object' ? toSave.skins : {};

    // 'founder' is a special case: script.js's equipBadge() never actually
    // pushes it into ownedBadges at all — ownership is derived purely from
    // prestigeCount > 0 at equip time (see findBadge()/equipBadge() there).
    // Mirrored here so equipping it doesn't get rejected as "unowned".
    const equippedBadge = clientState.equippedBadge;
    const ownsFounder = equippedBadge === 'founder' && Number(toSave.prestigeCount) > 0;
    toSave.equippedBadge = (typeof equippedBadge === 'string' && (ownedBadges.includes(equippedBadge) || ownsFounder))
        ? equippedBadge
        : null;

    const equippedFrame = clientState.equippedFrame;
    toSave.equippedFrame = (typeof equippedFrame === 'string' && ownedFrames.includes(equippedFrame))
        ? equippedFrame
        : null;

    // SECURITY FIX (follow-up): ownedEffects/ownedAuras/ownedSoundPacks are
    // fully protected above (FULLY_PROTECTED_ARRAY_FIELDS) the same way
    // ownedBadges/ownedFrames/skins are, but the matching equipped* fields
    // were missed in the first pass — a client could still CLAIM to have
    // an effect/aura/sound pack equipped without owning it (cosmetic-only
    // spoofing, same class of bug as the badge/frame/skin one this
    // function already fixed, just for the three fields added later).
    const ownedEffects = Array.isArray(toSave.ownedEffects) ? toSave.ownedEffects : [];
    const equippedEffect = clientState.equippedEffect;
    toSave.equippedEffect = (typeof equippedEffect === 'string' && ownedEffects.includes(equippedEffect))
        ? equippedEffect
        : null;

    const ownedAuras = Array.isArray(toSave.ownedAuras) ? toSave.ownedAuras : [];
    const equippedAura = clientState.equippedAura;
    toSave.equippedAura = (typeof equippedAura === 'string' && ownedAuras.includes(equippedAura))
        ? equippedAura
        : null;

    const ownedSoundPacks = Array.isArray(toSave.ownedSoundPacks) ? toSave.ownedSoundPacks : [];
    const equippedSoundPack = clientState.equippedSoundPack;
    // 'default' is always available for free (see equipSoundPack() in
    // script.js) and never appears in ownedSoundPacks itself.
    toSave.equippedSoundPack = (typeof equippedSoundPack === 'string' && (equippedSoundPack === 'default' || ownedSoundPacks.includes(equippedSoundPack)))
        ? equippedSoundPack
        : null;

    const clientEquippedSkin = (clientState.equippedSkin && typeof clientState.equippedSkin === 'object')
        ? clientState.equippedSkin
        : {};
    const equippedSkin = {};
    // SECURITY FIX (follow-up): buildingKey here comes straight from
    // Object.keys() of client JSON — same class of issue just fixed in
    // market-list.js (a key like "__proto__" indexing into a plain object
    // reads/writes its prototype instead of a normal property, instead of
    // any real building). Not actually exploitable in this exact spot in
    // practice (claimedIdx is always a validated integer by the time it'd
    // be assigned, and the accessor setter silently no-ops for non-object
    // values) — but that safety is implicit and easy to break with a
    // future edit, so it's whitelisted explicitly here too rather than
    // relying on that coincidence.
    for (const buildingKey of Object.keys(clientEquippedSkin)) {
        if (!BUILDING_KEYS.includes(buildingKey)) continue;
        const claimedIdx = clientEquippedSkin[buildingKey];
        const owned = Array.isArray(skins[buildingKey]) ? skins[buildingKey] : [0];
        if (Number.isInteger(claimedIdx) && owned.includes(claimedIdx)) {
            equippedSkin[buildingKey] = claimedIdx;
        }
    }
    toSave.equippedSkin = equippedSkin;
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }
    if (!isTrustedOrigin(event)) {
        return jsonResponse(403, { error: 'Forbidden' });
    }
    const rate = await checkRateLimit('state-save', event, { limit: 30, windowMs: 5 * 60 * 1000 });
    if (rate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }
    if (!event.body) {
        return jsonResponse(400, { error: 'invalid body' });
    }
    if (event.body.length > MAX_BODY_BYTES) {
        return jsonResponse(413, { error: 'save too large' });
    }

    let payload;
    try {
        payload = JSON.parse(event.body);
    } catch {
        return jsonResponse(400, { error: 'invalid JSON' });
    }

    const { playerId: claimedPlayerId, accessToken, state } = payload || {};
    if (!state || typeof state !== 'object') {
        return jsonResponse(400, { error: 'invalid state' });
    }

    const identity = await resolveIdentity({ accessToken, claimedPlayerId });
    if (!identity) {
        return jsonResponse(401, { error: 'Could not verify player identity' });
    }
    const playerId = identity.playerId;

    const uidRate = await checkUidRateLimit('state-save', playerId, { limit: 30, windowMs: 5 * 60 * 1000 });
    if (uidRate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    try {
        const store = playerStateStore();
        // Runs the whole sanitize-and-merge under mutateJson (see
        // _lib/blobWrite.js) rather than a separate read + unconditional
        // write, so a save landing at the same instant as a real IAP
        // grant, market sale, or gift can't clobber it — every protected
        // field is recomputed against whichever record is actually
        // current on each retry, never a stale snapshot from before this
        // request started.
        const { value: toSave } = await mutateJson(store, playerId, (existing) => {
            const merged = { ...state };

            for (const field of PROTECTED_FIELDS) {
                if (existing && Object.prototype.hasOwnProperty.call(existing, field)) {
                    merged[field] = existing[field];
                } else {
                    delete merged[field];
                }
            }
            for (const field of FULLY_PROTECTED_ARRAY_FIELDS) {
                merged[field] = Array.isArray(existing && existing[field]) ? existing[field] : [];
            }
            // skins is purchase-only (cosmetic-buy.js) — same full-protection
            // rule as FULLY_PROTECTED_ARRAY_FIELDS above, just an object
            // instead of an array so it's not in that list.
            merged.skins = (existing && existing.skins && typeof existing.skins === 'object') ? existing.skins : {};

            merged.ownedBadges = mergeSelfEarnable(state.ownedBadges, existing && existing.ownedBadges, SELF_EARNABLE_BADGE_IDS);
            merged.ownedFrames = mergeSelfEarnable(state.ownedFrames, existing && existing.ownedFrames, SELF_EARNABLE_FRAME_IDS);

            merged.gold = sanitizeCurrency(state.gold, existing && existing.gold, MAX_GOLD);
            merged.gems = sanitizeCurrency(state.gems, existing && existing.gems, MAX_GEMS);
            merged.pendingGifts = sanitizePendingGifts(state.pendingGifts, existing && existing.pendingGifts);
            sanitizeEquipped(state, merged);

            merged.accountCreatedAt = (existing && existing.accountCreatedAt) || Date.now();
            // Never taken from `state` (the client's copy) — only from this
            // request's own verified identity, falling back to whatever was
            // already stored (e.g. a guest save has no username at all).
            merged.piUsername = identity.username || (existing && existing.piUsername) || null;

            return merged;
        });

        return jsonResponse(200, { ok: true });
    } catch (err) {
        console.error('state-save error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
