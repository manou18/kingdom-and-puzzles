// netlify/functions/cosmetic-buy.js
//
// SECURITY FIX: this is the new, server-authoritative home for every
// gold/gems cosmetic purchase — badges, badge frames, puzzle effects,
// building auras, sound packs, and building skins (standard, legendary,
// and the traveling merchant's discounted offer). All of these used to be
// applied entirely client-side in script.js (buyBadge/buyFrame/buyEffect/
// buyAura/buySoundPack and the three skin-purchase handlers), then trusted
// verbatim by state-save.js — so a tampered client could grant itself any
// cosmetic for free, and a forged skin could then be listed for sale on
// the market to a real player (see market-list.js). Mirrors the same
// "verified identity, server-side price catalog, atomic read-modify-write"
// pattern already used by grantEntitlement.js/gift-send.js, using the
// price catalog in _lib/cosmetics.js instead of trusting anything the
// client sends about cost. state-save.js now refuses to accept new
// entries in ownedBadges/ownedFrames/ownedEffects/ownedAuras/
// ownedSoundPacks/skins that didn't come from here (or from gift-send.js,
// or from the small fixed set of achievement/prestige badges that were
// never purchasable in the first place).
const { jsonResponse } = require('./_lib/jsonResponse');
const { isTrustedOrigin, checkRateLimit, checkUidRateLimit } = require('./_lib/security');
const { resolveIdentity } = require('./_lib/identity');
const { playerStateStore } = require('./_lib/grantEntitlement');
const { mutateJson, ABORT } = require('./_lib/blobWrite');
const {
    BADGES, FRAMES, EFFECTS, AURAS, SOUND_PACKS,
    BUILDING_KEYS,
    SKIN_STANDARD_PRICE_GOLD, SKIN_STANDARD_IDXS,
    SKIN_LEGENDARY_IDX, SKIN_LEGENDARY_PRICE_GEMS,
    SKIN_MERCHANT_PRICE_GOLD, SKIN_MERCHANT_IDXS,
} = require('./_lib/cosmetics');

const CATALOGS = { badge: BADGES, frame: FRAMES, effect: EFFECTS, aura: AURAS, soundpack: SOUND_PACKS };
const OWNED_FIELD = { badge: 'ownedBadges', frame: 'ownedFrames', effect: 'ownedEffects', aura: 'ownedAuras', soundpack: 'ownedSoundPacks' };

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' });
    }
    if (!isTrustedOrigin(event)) {
        return jsonResponse(403, { error: 'Forbidden' });
    }
    const rate = await checkRateLimit('cosmetic-buy', event, { limit: 30, windowMs: 5 * 60 * 1000 });
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
    const { playerId: claimedPlayerId, accessToken, kind, itemId, currency, buildingKey, skinVariant, skinIdx: claimedSkinIdx } = body || {};

    const identity = await resolveIdentity({ accessToken, claimedPlayerId });
    if (!identity) {
        return jsonResponse(401, { error: 'Could not verify player identity' });
    }
    const playerId = identity.playerId;

    const uidRate = await checkUidRateLimit('cosmetic-buy', playerId, { limit: 30, windowMs: 5 * 60 * 1000 });
    if (uidRate.limited) {
        return jsonResponse(429, { error: 'Too many requests, please slow down' });
    }

    const store = playerStateStore();

    try {
        if (kind === 'skin') {
            if (typeof buildingKey !== 'string' || !BUILDING_KEYS.includes(buildingKey)) {
                return jsonResponse(400, { error: 'invalid building' });
            }
            if (!['standard', 'legendary', 'merchant'].includes(skinVariant)) {
                return jsonResponse(400, { error: 'invalid skin variant' });
            }

            let failReason = null;
            const result = await mutateJson(store, playerId, (current) => {
                const s = current || {};
                if (!s.skins || typeof s.skins !== 'object') s.skins = {};
                const owned = Array.isArray(s.skins[buildingKey]) ? s.skins[buildingKey] : [0];

                let idx, price, currencyKey, autoEquip;
                if (skinVariant === 'legendary') {
                    idx = SKIN_LEGENDARY_IDX;
                    price = SKIN_LEGENDARY_PRICE_GEMS;
                    currencyKey = 'gems';
                    autoEquip = true;
                } else if (skinVariant === 'merchant') {
                    // The merchant's offer is always one of these two fixed
                    // indices at this fixed price (see _lib/cosmetics.js) —
                    // no server-stored "today's offer" needed, since
                    // nothing about it is actually randomized on the price/
                    // eligibility axis, only which building it happens to
                    // pick, and that's the caller's own choice among
                    // buildings it doesn't yet own that skin for.
                    if (!SKIN_MERCHANT_IDXS.includes(claimedSkinIdx)) {
                        failReason = 'invalid merchant offer';
                        return ABORT;
                    }
                    idx = claimedSkinIdx;
                    price = SKIN_MERCHANT_PRICE_GOLD;
                    currencyKey = 'gold';
                    autoEquip = false; // matches script.js: the merchant purchase never auto-equips
                } else {
                    idx = SKIN_STANDARD_IDXS.find((i) => !owned.includes(i));
                    price = SKIN_STANDARD_PRICE_GOLD;
                    currencyKey = 'gold';
                    autoEquip = true;
                    if (idx === undefined) {
                        failReason = 'all standard skins already unlocked';
                        return ABORT;
                    }
                }

                if (owned.includes(idx)) {
                    failReason = 'you already own that skin';
                    return ABORT;
                }
                if ((s[currencyKey] || 0) < price) {
                    failReason = currencyKey === 'gems' ? 'not enough gems' : 'not enough gold';
                    return ABORT;
                }

                s[currencyKey] -= price;
                s.skins[buildingKey] = [...owned, idx];
                if (autoEquip) {
                    if (!s.equippedSkin || typeof s.equippedSkin !== 'object') s.equippedSkin = {};
                    s.equippedSkin[buildingKey] = idx;
                }
                return s;
            });

            if (result.aborted) {
                return jsonResponse(400, { error: failReason || 'purchase failed' });
            }
            return jsonResponse(200, { ok: true, grantedState: result.value });
        }

        // SECURITY FIX: `kind` used to index CATALOGS/OWNED_FIELD directly
        // (`CATALOGS[kind]`) and only check the result was truthy. A kind
        // like "constructor" or "toString" resolves to an INHERITED
        // Object.prototype value (a function, which is truthy) instead of
        // undefined, sailing past that check — and then the itemId
        // hasOwnProperty check below runs against that unintended object
        // (e.g. the real `Object` constructor) instead of a price catalog
        // at all, which could resolve `price` to `undefined` for a
        // matching itemId (e.g. "name"/"length") and NaN the player's
        // currency on the subsequent subtraction. Fixed by checking
        // `kind` is a real, own-property key of these dictionaries before
        // ever indexing into them with it, the same hasOwnProperty
        // pattern already used just below for itemId.
        if (
            typeof kind !== 'string' ||
            !Object.prototype.hasOwnProperty.call(CATALOGS, kind) ||
            !Object.prototype.hasOwnProperty.call(OWNED_FIELD, kind)
        ) {
            return jsonResponse(400, { error: 'invalid kind' });
        }
        const catalog = CATALOGS[kind];
        const ownedField = OWNED_FIELD[kind];
        if (typeof itemId !== 'string' || !Object.prototype.hasOwnProperty.call(catalog, itemId)) {
            return jsonResponse(400, { error: 'invalid item' });
        }
        if (!['gold', 'gems'].includes(currency)) {
            return jsonResponse(400, { error: 'invalid currency' });
        }
        const price = catalog[itemId][currency];

        let failReason = null;
        const result = await mutateJson(store, playerId, (current) => {
            const s = current || {};
            if (!Array.isArray(s[ownedField])) s[ownedField] = [];
            if (s[ownedField].includes(itemId)) {
                failReason = 'already owned';
                return ABORT;
            }
            if ((s[currency] || 0) < price) {
                failReason = currency === 'gems' ? 'not enough gems' : 'not enough gold';
                return ABORT;
            }
            s[currency] -= price;
            s[ownedField] = [...s[ownedField], itemId];
            return s;
        });

        if (result.aborted) {
            return jsonResponse(400, { error: failReason || 'purchase failed' });
        }
        return jsonResponse(200, { ok: true, grantedState: result.value });
    } catch (err) {
        console.error('cosmetic-buy error:', err.message);
        return jsonResponse(500, { error: 'internal error' });
    }
};
