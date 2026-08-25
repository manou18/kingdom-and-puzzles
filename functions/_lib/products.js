// netlify/functions/_lib/products.js
//
// SECURITY: this is the server-side source of truth for "what does this
// Pi payment's metadata actually buy". It mirrors the pricing constants in
// script.js (GEM_PACKS / GOLD_PACKS / PATRON_PRICE_USD / PATRON_PLUS_PRICE_USD /
// STARTER_OFFER_*), but unlike script.js, THIS copy is the one that decides
// what actually gets granted (gems/gold/patron days) and how much it should
// have cost. The client's copy is cosmetic — used only to show a price and
// build the Pi.createPayment() call — never trusted to say what was bought
// or for how much. This mirrors the pattern used in chesspi-board's
// products.js, adapted for this game's gems/gold/patron economy instead of
// unlockable levels/themes/piece sets.
//
// If you change a price in script.js, update the matching entry here too.

const GEM_PACKS = [
    { gems: 90, usdPrice: 0.09 },
    { gems: 220, usdPrice: 0.18 },
    { gems: 650, usdPrice: 0.46 },
    { gems: 5000, usdPrice: 2.99 },
];
const GOLD_PACKS = [
    { gold: 140, usdPrice: 0.09 },
    { gold: 320, usdPrice: 0.18 },
    { gold: 900, usdPrice: 0.46 },
    { gold: 7000, usdPrice: 2.99 },
];

const PATRON_PRICE_USD = 0.28;
const PATRON_DAYS = 30;
const PATRON_PLUS_PRICE_USD = 0.55;
const PATRON_PLUS_DAYS = 30;

// The client quotes a Pi price computed from a live CoinGecko/CoinMarketCap
// fetch at the moment the shop renders, then re-quotes again right before
// charging — but the PI/USD market rate can drift a little between that
// quote and when we verify here. Reject only amounts that are wildly off
// (i.e. someone tampering with the client to pay a token amount for a
// gem/gold pack or patron pass), not honest market movement. Mirrors
// chesspi-board's PRICE_TOLERANCE_RATIO exactly.
const PRICE_TOLERANCE_RATIO = 0.5; // accept amounts down to 50% of expected

// Starter Offer — fixed directly in Pi (never USD-converted), so a
// price-feed outage can't block it and its cost never drifts with the
// market. Mirrors STARTER_OFFER_* in script.js exactly.
const STARTER_OFFER_PI = 0.2;
const STARTER_OFFER_WEEKLY_GEMS = [18, 14, 10, 8]; // week 1..4 (index 0..3)
const STARTER_OFFER_DAYS = 28; // whole series closes for good this many days after account creation

// Returns 0-3 for "this account is currently in week N of the series", or
// -1 if not eligible (unknown/missing creation time, or past the window).
// `accountCreatedAt` must come from the player's own server-stored record
// (see state's accountCreatedAt, set authoritatively the first time this
// backend ever saves the account) — never from anything the client claims.
function starterOfferWeekIndexFor(accountCreatedAt) {
    if (!accountCreatedAt) return -1;
    const daysSince = (Date.now() - accountCreatedAt) / 86400000;
    if (daysSince < 0 || daysSince >= STARTER_OFFER_DAYS) return -1;
    return Math.floor(daysSince / 7);
}

// Resolves a Pi payment's metadata (as sent by purchaseWithPi() client-side
// via Pi.createPayment({ metadata })) into what should be granted, and what
// it should have cost. Returns null for anything unrecognized or where the
// requested pack/tier doesn't match a real catalog entry — callers must
// treat that as "reject the payment", never "grant nothing but still mark
// it complete".
//
// `context` carries facts about THIS player read server-side from their
// stored state (never from the client) — currently only used by the
// 'starter' kind, which needs the account's real creation date and which
// weeks it has already claimed.
function resolveProduct(metadata, context = {}) {
    if (!metadata || typeof metadata !== 'object') return null;

    if (metadata.kind === 'gems') {
        const pack = GEM_PACKS.find((p) => p.gems === metadata.gems);
        if (!pack) return null;
        return { kind: 'gems', gems: pack.gems, expectedUsd: pack.usdPrice };
    }

    if (metadata.kind === 'gold') {
        const pack = GOLD_PACKS.find((p) => p.gold === metadata.gold);
        if (!pack) return null;
        return { kind: 'gold', gold: pack.gold, expectedUsd: pack.usdPrice };
    }

    if (metadata.kind === 'patron') {
        const isPlus = metadata.tier === 'plus';
        const expectedDays = isPlus ? PATRON_PLUS_DAYS : PATRON_DAYS;
        if (metadata.days !== expectedDays) return null;
        return {
            kind: 'patron',
            days: expectedDays,
            tier: isPlus ? 'plus' : 'basic',
            expectedUsd: isPlus ? PATRON_PLUS_PRICE_USD : PATRON_PRICE_USD,
        };
    }

    if (metadata.kind === 'starter') {
        return buildStarterOfferProduct(metadata, context);
    }

    return null;
}

// Eligibility, both enforced here against the player's REAL server-stored
// record (never the client's claimed weekIndex):
//   - context.accountCreatedAt must place the account inside a valid,
//     not-yet-expired week of the series (starterOfferWeekIndexFor).
//   - that week must not already be in context.claimedWeeks.
//   - metadata.gems must match exactly what that week's tier grants.
function buildStarterOfferProduct(metadata, context) {
    const weekIndex = starterOfferWeekIndexFor(context.accountCreatedAt);
    if (weekIndex === -1) return null;
    const claimed = Array.isArray(context.claimedWeeks) ? context.claimedWeeks : [];
    if (claimed.includes(weekIndex)) return null;
    const expectedGems = STARTER_OFFER_WEEKLY_GEMS[weekIndex];
    if (metadata.gems !== expectedGems) return null;
    return {
        kind: 'starter',
        gems: expectedGems,
        weekIndex,
        // expectedPi, not expectedUsd — this product is checked directly
        // in Pi by isPlausiblePiAmount, never converted from/to USD.
        expectedPi: STARTER_OFFER_PI,
    };
}

// True if `amountPi` is a plausible payment for a product priced directly
// in Pi (currently only the Starter Offer). No piUsdRate involved, so this
// check still works even during a price-feed outage.
function isPlausiblePiAmount(amountPi, expectedPi) {
    if (!(amountPi > 0) || !(expectedPi > 0)) return false;
    return amountPi >= expectedPi * PRICE_TOLERANCE_RATIO;
}

// True if `amountPi` is a plausible payment for `expectedUsd`, given
// `piUsdRate` (Pi's current USD price). Used to catch a tampered client
// sending a token amount for a gem/gold pack or patron pass — not meant to
// catch honest price-feed drift, hence the generous tolerance.
function isPlausibleAmount(amountPi, expectedUsd, piUsdRate) {
    if (!(amountPi > 0) || !(expectedUsd > 0) || !(piUsdRate > 0)) return false;
    const expectedPi = expectedUsd / piUsdRate;
    return amountPi >= expectedPi * PRICE_TOLERANCE_RATIO;
}

module.exports = {
    GEM_PACKS,
    GOLD_PACKS,
    PATRON_PRICE_USD,
    PATRON_DAYS,
    PATRON_PLUS_PRICE_USD,
    PATRON_PLUS_DAYS,
    STARTER_OFFER_PI,
    STARTER_OFFER_WEEKLY_GEMS,
    STARTER_OFFER_DAYS,
    starterOfferWeekIndexFor,
    resolveProduct,
    isPlausibleAmount,
    isPlausiblePiAmount,
};
