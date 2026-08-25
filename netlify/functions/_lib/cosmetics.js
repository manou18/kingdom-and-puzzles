// netlify/functions/_lib/cosmetics.js
//
// SECURITY FIX: server-side source of truth for cosmetic purchase prices
// (badges, badge frames, puzzle effects, building auras, sound packs, and
// building skins), mirroring the pricing constants in script.js (BADGES /
// BADGE_FRAMES / PUZZLE_EFFECTS / BUILDING_AURAS / SOUND_PACKS / the skin
// shop's fixed prices) the same way products.js already does for gem/gold
// IAP packs and gift-send.js's GIFTABLE_BADGES/GIFTABLE_FRAMES do for
// gifting. Before this file existed, these purchases were applied entirely
// client-side (state.gold/gems decremented and the item pushed into
// state.ownedBadges/etc. directly in script.js), then trusted verbatim by
// state-save.js — so a tampered client could simply grant itself any
// cosmetic for free, or (worse, for skins specifically) list a
// never-actually-bought skin on the market for sale to a real player (see
// market-list.js's ownership check, which is only as trustworthy as this
// data). cosmetic-buy.js is now the only place these are granted; keep
// this file's numbers in sync with script.js if a price ever changes.

const BADGES = {
    moon: { gems: 50, gold: 150 },
    star: { gems: 30, gold: 90 },
    flame: { gems: 40, gold: 120 },
    blossom: { gems: 20, gold: 60 },
    falcon: { gems: 45, gold: 135 },
    dragon: { gems: 80, gold: 240 },
    compass: { gems: 35, gold: 105 },
    clover: { gems: 25, gold: 75 },
    horseshoe: { gems: 25, gold: 75 },
    evileye: { gems: 30, gold: 90 },
    rabbitfoot: { gems: 35, gold: 105 },
    bookworm: { gems: 40, gold: 120 },
};

const FRAMES = {
    silver: { gems: 15, gold: 45 },
    gold: { gems: 20, gold: 60 },
    jeweled: { gems: 40, gold: 120 },
};

const EFFECTS = {
    sparkles: { gems: 50, gold: 150 },
    leaves: { gems: 45, gold: 135 },
    stars: { gems: 60, gold: 180 },
    blossoms: { gems: 55, gold: 165 },
    blueflame: { gems: 70, gold: 210 },
};

const AURAS = {
    gold: { gems: 30, gold: 90 },
    silver: { gems: 25, gold: 75 },
    fire: { gems: 35, gold: 105 },
    magic: { gems: 40, gold: 120 },
};

const SOUND_PACKS = {
    classic: { gems: 30, gold: 90 },
    electronic: { gems: 40, gold: 120 },
    nature: { gems: 35, gold: 105 },
    epic: { gems: 50, gold: 150 },
};

// Mirrors BUILDING_TYPES' keys in script.js — every building has exactly 3
// standard skin colors (indices 0-2, index 0 always free/owned) plus one
// legendary skin (index 3, gem-only).
const BUILDING_KEYS = [
    'farm', 'mine', 'cottage', 'tower', 'temple', 'market', 'weaver', 'dock',
    'quarry', 'garden', 'lodge', 'barracks', 'manor', 'stage', 'vane', 'observatory',
];

// Standard skin: 20 gold, picks the seller's own next-unowned index among
// 1-2 (index 0 is always owned by default; index 3 is the legendary tier,
// never sold as "standard"). Mirrors the data-buyskin handler in script.js.
const SKIN_STANDARD_PRICE_GOLD = 20;
const SKIN_STANDARD_IDXS = [1, 2];

// Legendary skin: fixed index 3, 30 gems. Mirrors the data-buylegendary
// handler in script.js.
const SKIN_LEGENDARY_IDX = 3;
const SKIN_LEGENDARY_PRICE_GEMS = 30;

// Traveling merchant: sells one of the two standard indices (1 or 2, never
// the legendary index 3) at a fixed discounted price. Mirrors
// refreshMerchantIfDue()/buyMerchantBtn in script.js. Unlike a real
// randomized "today's offer" system, the merchant's price and possible
// indices are both fixed constants, not randomized per-visit state that
// needs its own server record — so this can be validated the same
// deterministic way as a standard purchase, just at the discounted price.
const SKIN_MERCHANT_PRICE_GOLD = 15;
const SKIN_MERCHANT_IDXS = [1, 2];

module.exports = {
    BADGES, FRAMES, EFFECTS, AURAS, SOUND_PACKS,
    BUILDING_KEYS,
    SKIN_STANDARD_PRICE_GOLD, SKIN_STANDARD_IDXS,
    SKIN_LEGENDARY_IDX, SKIN_LEGENDARY_PRICE_GEMS,
    SKIN_MERCHANT_PRICE_GOLD, SKIN_MERCHANT_IDXS,
};
