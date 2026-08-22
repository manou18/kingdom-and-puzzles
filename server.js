/**
 * Kingdoms & Words — backend
 * -------------------------------------------------------------------------
 * Three jobs:
 *   1. Save/load player state           (existing — unchanged behavior)
 *   2. Real Pi payments (gold, gems + patron) — server-authoritative granting
 *   3. Internal gold-only marketplace   — server-authoritative trading
 *
 * Storage is still one JSON file per player under ./data/, plus a couple of
 * small JSON files for pending payments and marketplace listings. Fine for
 * getting started; swap for a real database once you have real traffic —
 * every disk read/write is isolated in small helper functions below so
 * that's a contained change later.
 *
 * SECURITY PRINCIPLE USED THROUGHOUT THIS FILE: never trust the client for
 * anything that moves gold, gems, or items. The client can ask the server to
 * do something; the server decides whether it's actually true and valid.
 * -------------------------------------------------------------------------
 */

const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const PENDING_DIR = path.join(DATA_DIR, 'pending-payments');
const MARKET_FILE = path.join(DATA_DIR, 'market-listings.json');

app.use(express.json({ limit: '256kb' }));
app.disable('x-powered-by');

// CORS — replace '*' with your real site's origin(s) before going live.
const ALLOWED_ORIGINS = ['*'];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS.includes('*') ? '*' : origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const lastWriteAt = new Map();
const MIN_MS_BETWEEN_WRITES = 250;
function rateLimited(key) {
  const now = Date.now();
  const last = lastWriteAt.get(key) || 0;
  if (now - last < MIN_MS_BETWEEN_WRITES) return true;
  lastWriteAt.set(key, now);
  return false;
}

function isValidPlayerId(id) {
  return typeof id === 'string' && /^(pi_|guest_)[A-Za-z0-9_.-]{1,80}$/.test(id);
}
function isValidPaymentId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(id);
}
function isValidListingId(id) {
  return typeof id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

function filePathFor(playerId) {
  return path.join(DATA_DIR, `${playerId}.json`);
}
function pendingPathFor(paymentId) {
  return path.join(PENDING_DIR, `${paymentId}.json`);
}

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(PENDING_DIR, { recursive: true });
  try { await fs.access(MARKET_FILE); }
  catch { await fs.writeFile(MARKET_FILE, JSON.stringify([])); }
}

async function readPlayerState(playerId) {
  try { return JSON.parse(await fs.readFile(filePathFor(playerId), 'utf8')); }
  catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}
async function writePlayerState(playerId, state) {
  await fs.writeFile(filePathFor(playerId), JSON.stringify(state));
}

/* ---------------------------------------------------------------------- *
 * A tiny in-process mutex so two requests can't read-modify-write the same
 * file at once (e.g. two simultaneous marketplace purchases of the same
 * listing, or a payment completion racing a state save). Good enough for a
 * single-process Node server; if you ever run multiple instances behind a
 * load balancer, replace this with a real distributed lock or a database
 * with real transactions instead.
 * ---------------------------------------------------------------------- */
const locks = new Map();
function withLock(key, fn) {
  const prev = locks.get(key) || Promise.resolve();
  const next = prev.then(fn, fn).finally(() => {
    if (locks.get(key) === next) locks.delete(key);
  });
  locks.set(key, next);
  return next;
}

/* ============================= SAVE / LOAD ============================= */

app.get('/api/state/:playerId', async (req, res) => {
  const { playerId } = req.params;
  if (!isValidPlayerId(playerId)) return res.status(400).json({ error: 'invalid playerId' });
  try {
    const raw = await fs.readFile(filePathFor(playerId), 'utf8');
    res.type('application/json').send(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return res.status(404).json({ error: 'no save found' });
    console.error('Read error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/state/:playerId', async (req, res) => {
  const { playerId } = req.params;
  if (!isValidPlayerId(playerId)) return res.status(400).json({ error: 'invalid playerId' });
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ error: 'invalid body' });
  if (rateLimited(`save:${playerId}`)) return res.status(429).json({ error: 'too many saves, slow down' });
  try {
    await ensureDirs();
    await withLock(`player:${playerId}`, async () => {
      const existing = await readPlayerState(playerId);
      const toSave = { ...req.body };
      // accountCreatedAt is server-authoritative: set once, the first time
      // this server ever sees a save for this account, and never moved
      // afterward — never trusted from whatever (if anything) the client
      // sends for it. This is what gates STARTER_OFFER_* eligibility above,
      // so a reinstall or a locally-edited save can't reset or fast-forward
      // through the 4-week window.
      toSave.accountCreatedAt = (existing && existing.accountCreatedAt) || Date.now();
      await writePlayerState(playerId, toSave);
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Write error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

/* ============================= LEADERBOARD ============================= *
 * Reads every player's save file and returns the raw stats — sorting by
 * whichever metric (gold, dynasties founded, lifetime donations, streak)
 * happens client-side, so the client can offer multiple leaderboard views
 * without multiple endpoints.
 *
 * PERFORMANCE NOTE: this re-reads every save file on every request, which
 * is fine at small scale but won't hold up with thousands of players —
 * move to a real database with an indexed query once that matters, rather
 * than optimizing this file-scan approach further.
 * ------------------------------------------------------------------------- */
app.get('/api/leaderboard', async (req, res) => {
  try {
    await ensureDirs();
    const files = await fs.readdir(DATA_DIR);
    const players = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const playerId = file.slice(0, -5);
      if (!isValidPlayerId(playerId)) continue; // skips market-listings.json etc.
      try {
        const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf8');
        const s = JSON.parse(raw);
        players.push({
          playerId,
          gold: s.gold || 0,
          prestigeCount: s.prestigeCount || 0,
          totalDonated: s.totalDonated || 0,
          streak: s.streak || 0,
          equippedBadge: s.equippedBadge || null, // cosmetic only — safe to expose publicly
          equippedFrame: s.equippedFrame || null, // cosmetic only — safe to expose publicly
        });
      } catch { /* skip an unreadable/corrupt save rather than failing the whole list */ }
    }
    res.json(players);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

/* ============================= PI PAYMENTS ============================= *
 * Flow (matches Pi SDK's Pi.createPayment callbacks on the client):
 *   1. Client calls Pi.createPayment(...). Pi's SDK calls back
 *      onReadyForServerApproval(paymentId) -> client POSTs here.
 *   2. We fetch the payment from Pi's API (the trusted source of what was
 *      actually paid for) and call Pi's /approve endpoint, then remember
 *      what to grant once it completes.
 *   3. Pi's SDK then calls onReadyForServerCompletion(paymentId, txid) on
 *      the client -> client POSTs here. We call Pi's /complete endpoint,
 *      then grant the purchase using ONLY the metadata we fetched from Pi
 *      in step 2 — never anything the client sends — and return the
 *      player's updated state so the client can sync immediately.
 *
 * IMPORTANT: verify this against Pi Network's current developer docs before
 * going live — API paths/headers can change and this wasn't tested against
 * a live payment in this environment. Set PI_API_KEY as an environment
 * variable (from the Pi Developer Portal); never hardcode or commit it.
 * ------------------------------------------------------------------------- */
const PI_API_BASE = 'https://api.minepi.com/v2';
const PI_API_KEY = process.env.PI_API_KEY;

async function piApi(pathSuffix, options = {}) {
  if (!PI_API_KEY) throw new Error('PI_API_KEY is not set on the server');
  const res = await fetch(`${PI_API_BASE}${pathSuffix}`, {
    ...options,
    headers: {
      'Authorization': `Key ${PI_API_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  let data = null;
  try { data = await res.json(); } catch { /* no body */ }
  return { ok: res.ok, status: res.status, data };
}

// Only these purchase kinds are ever granted — anything else is rejected.
// gems: flat currency top-up. gold: flat gold top-up (a convenience
// alternative to gems, priced worse per-Pi client-side — see GOLD_PACKS in
// index.html). patron: extends patronUntil by N days, optionally tagged
// with tier:'plus' for the pricier Patron+ offer (bigger gem trickle,
// exclusive badge/frame — see applyGrant below). starter: one claim per
// calendar week of the 4-week onboarding series (see STARTER_OFFER_* in
// index.html) — its Pi amount, weekly gem tiers, and eligibility window are
// all fixed/derived server-side here, never trusted from the client, and
// the once-per-week cap is enforced against state.starterOfferClaimedWeeks
// and state.accountCreatedAt (itself set authoritatively the first time this
// server ever saves the account — see POST /api/state/:playerId below).
const STARTER_OFFER_PI = 0.2;
const STARTER_OFFER_WEEKLY_GEMS = [18, 14, 10, 8]; // week 1..4 (index 0..3)
const STARTER_OFFER_DAYS = 28; // whole series closes for good this many days after account creation

// Returns 0-3 for "this account is currently in week N of the series", or
// -1 if not eligible (unknown creation time, or past the window). Mirrors
// starterOfferWeekIndex() in index.html but this copy is the one that
// actually gates a real payment.
function starterOfferWeekIndexFor(accountCreatedAt) {
  if (!accountCreatedAt) return -1;
  const daysSince = (Date.now() - accountCreatedAt) / 86400000;
  if (daysSince < 0 || daysSince >= STARTER_OFFER_DAYS) return -1;
  return Math.floor(daysSince / 7);
}

function isGrantableMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return false;
  if (metadata.kind === 'gems') return Number.isInteger(metadata.gems) && metadata.gems > 0 && metadata.gems <= 100000;
  if (metadata.kind === 'gold') return Number.isInteger(metadata.gold) && metadata.gold > 0 && metadata.gold <= 1000000;
  if (metadata.kind === 'patron') {
    if (!Number.isInteger(metadata.days) || metadata.days <= 0 || metadata.days > 366) return false;
    if (metadata.tier !== undefined && metadata.tier !== 'basic' && metadata.tier !== 'plus') return false;
    return true;
  }
  if (metadata.kind === 'starter') {
    // Only a sanity check here (a real gem tier value) — actual week
    // eligibility and the per-week cap are checked in /approve below, where
    // we have the account's own records to check against.
    return STARTER_OFFER_WEEKLY_GEMS.includes(metadata.gems);
  }
  return false;
}

app.post('/api/payments/approve', async (req, res) => {
  const { paymentId, playerId } = req.body || {};
  if (!isValidPaymentId(paymentId) || !isValidPlayerId(playerId)) {
    return res.status(400).json({ error: 'invalid request' });
  }
  try {
    const info = await piApi(`/payments/${paymentId}`);
    if (!info.ok || !info.data) return res.status(502).json({ error: 'could not verify payment with Pi' });
    if (!isGrantableMetadata(info.data.metadata)) {
      return res.status(400).json({ error: 'payment metadata does not match an offer this server grants' });
    }
    let starterWeekIndex;
    if (info.data.metadata.kind === 'starter') {
      // Fixed-price offer: the amount Pi says was actually paid must match
      // the fixed Pi price exactly, and this account's own current week
      // must not already be claimed — both checked against our own
      // records, never the client's claimed weekIndex.
      if (typeof info.data.amount !== 'number' || Math.abs(info.data.amount - STARTER_OFFER_PI) > 1e-6) {
        return res.status(400).json({ error: 'starter offer amount does not match the fixed price' });
      }
      const existing = await readPlayerState(playerId);
      starterWeekIndex = starterOfferWeekIndexFor(existing && existing.accountCreatedAt);
      if (starterWeekIndex === -1) {
        return res.status(400).json({ error: 'starter offer is not available for this account right now' });
      }
      const claimed = (existing && existing.starterOfferClaimedWeeks) || [];
      if (claimed.includes(starterWeekIndex)) {
        return res.status(400).json({ error: "this week's starter offer has already been claimed" });
      }
      const expectedGems = STARTER_OFFER_WEEKLY_GEMS[starterWeekIndex];
      if (info.data.metadata.gems !== expectedGems) {
        return res.status(400).json({ error: "starter offer gem amount does not match this account's current week tier" });
      }
    }
    const approve = await piApi(`/payments/${paymentId}/approve`, { method: 'POST' });
    if (!approve.ok) return res.status(502).json({ error: 'Pi approval failed' });

    await ensureDirs();
    await fs.writeFile(pendingPathFor(paymentId), JSON.stringify({
      playerId, metadata: info.data.metadata, amount: info.data.amount, createdAt: Date.now(),
      // Recorded now (server-derived, not client-supplied) so /complete
      // marks the exact week this grant belongs to even in the rare case
      // the calendar ticks over into a new week between approve and complete.
      starterWeekIndex,
    }));
    res.json({ ok: true });
  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/payments/complete', async (req, res) => {
  const { paymentId, txid, playerId } = req.body || {};
  if (!isValidPaymentId(paymentId) || !isValidPlayerId(playerId) || typeof txid !== 'string' || !txid) {
    return res.status(400).json({ error: 'invalid request' });
  }
  try {
    const pendingRaw = await fs.readFile(pendingPathFor(paymentId), 'utf8').catch(() => null);
    if (!pendingRaw) return res.status(400).json({ error: 'no matching pending payment' });
    const pending = JSON.parse(pendingRaw);
    if (pending.playerId !== playerId) return res.status(403).json({ error: 'player mismatch' });

    const complete = await piApi(`/payments/${paymentId}/complete`, {
      method: 'POST', body: JSON.stringify({ txid }),
    });
    if (!complete.ok) return res.status(502).json({ error: 'Pi completion failed' });

    const grantedState = await withLock(`player:${playerId}`, async () => {
      const state = (await readPlayerState(playerId)) || {};
      applyGrant(state, pending.metadata, pending.starterWeekIndex);
      await writePlayerState(playerId, state);
      return state;
    });

    await fs.unlink(pendingPathFor(paymentId)).catch(() => {});
    res.json({ ok: true, grantedState });
  } catch (err) {
    console.error('Complete error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

function applyGrant(state, metadata, starterWeekIndex) {
  if (metadata.kind === 'starter') {
    // Belt-and-suspenders re-check at grant time (inside the per-player
    // lock in /api/payments/complete), in case two payments for the same
    // account/week both cleared the earlier check in /approve concurrently —
    // only the first one to actually reach here grants anything.
    if (!Array.isArray(state.starterOfferClaimedWeeks)) state.starterOfferClaimedWeeks = [];
    if (state.starterOfferClaimedWeeks.includes(starterWeekIndex)) return;
    state.gems = (state.gems || 0) + metadata.gems;
    state.starterOfferClaimedWeeks.push(starterWeekIndex);
  } else if (metadata.kind === 'gems') {
    state.gems = (state.gems || 0) + metadata.gems;
  } else if (metadata.kind === 'gold') {
    state.gold = (state.gold || 0) + metadata.gold;
  } else if (metadata.kind === 'patron') {
    const now = Date.now();
    const currentUntil = state.patronUntil ? new Date(state.patronUntil).getTime() : 0;
    const base = currentUntil > now ? currentUntil : now; // stacks onto remaining time instead of wasting it
    state.patronUntil = new Date(base + metadata.days * 86400000).toISOString();
    state.patronTier = metadata.tier === 'plus' ? 'plus' : 'basic'; // which tier's daily trickle applies going forward
    if (metadata.tier === 'plus') {
      // Exclusive Patron+ badge/frame — granted once, kept forever, same
      // "never take away something already bought" rule as every other
      // cosmetic in this file. Mirrors PATRON_PLUS_BADGE / PATRON_PLUS_FRAME
      // in index.html.
      if (!Array.isArray(state.ownedBadges)) state.ownedBadges = [];
      if (!state.ownedBadges.includes('patron-plus')) state.ownedBadges.push('patron-plus');
      if (!Array.isArray(state.ownedFrames)) state.ownedFrames = [];
      if (!state.ownedFrames.includes('patron-plus-frame')) state.ownedFrames.push('patron-plus-frame');
    }
  }
}

/* ============================= MARKETPLACE ============================= *
 * Gold-only trading of cosmetic skins between players. No path to real
 * money: gold can be earned in-game or bought in packs, but never cashed
 * back out — only gems (bought directly with Pi) and gold move here, and
 * gold never converts back to Pi. See the README for why this boundary
 * matters.
 *
 * Listing shape: { id, sellerId, buildingKey, skinIdx, price, createdAt }
 * A 10% commission is taken on sale (rounded down), same idea as the Steam
 * Community Market the user referenced.
 * ------------------------------------------------------------------------- */
const MARKET_COMMISSION = 0.10;

async function readListings() {
  await ensureDirs();
  return JSON.parse(await fs.readFile(MARKET_FILE, 'utf8'));
}
async function writeListings(listings) {
  await fs.writeFile(MARKET_FILE, JSON.stringify(listings));
}

app.get('/api/market/listings', async (req, res) => {
  try { res.json(await readListings()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'internal error' }); }
});

app.post('/api/market/list', async (req, res) => {
  const { sellerId, buildingKey, skinIdx, price } = req.body || {};
  if (!isValidPlayerId(sellerId) || typeof buildingKey !== 'string' ||
      !Number.isInteger(skinIdx) || skinIdx <= 0 ||
      !Number.isInteger(price) || price <= 0 || price > 1000000) {
    return res.status(400).json({ error: 'invalid listing' });
  }
  try {
    const result = await withLock(`player:${sellerId}`, async () => {
      const state = await readPlayerState(sellerId);
      const owned = state && state.skins && state.skins[buildingKey];
      if (!owned || !owned.includes(skinIdx)) return { error: "you don't own that skin" };
      // Pull the skin out of the seller's inventory now, so it can't be
      // equipped, used, or listed twice while the listing is live.
      state.skins[buildingKey] = owned.filter(i => i !== skinIdx);
      if (state.equippedSkin && state.equippedSkin[buildingKey] === skinIdx) {
        state.equippedSkin[buildingKey] = 0;
      }
      await writePlayerState(sellerId, state);
      return { ok: true };
    });
    if (result.error) return res.status(400).json({ error: result.error });

    const listing = {
      id: `lst_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      sellerId, buildingKey, skinIdx, price, createdAt: Date.now(),
    };
    await withLock('market', async () => {
      const listings = await readListings();
      listings.push(listing);
      await writeListings(listings);
    });
    res.json({ ok: true, listing });
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/market/cancel', async (req, res) => {
  const { listingId, sellerId } = req.body || {};
  if (!isValidListingId(listingId) || !isValidPlayerId(sellerId)) {
    return res.status(400).json({ error: 'invalid request' });
  }
  try {
    const listing = await withLock('market', async () => {
      const listings = await readListings();
      const idx = listings.findIndex(l => l.id === listingId && l.sellerId === sellerId);
      if (idx === -1) return null;
      const [removed] = listings.splice(idx, 1);
      await writeListings(listings);
      return removed;
    });
    if (!listing) return res.status(404).json({ error: 'listing not found' });

    await withLock(`player:${sellerId}`, async () => {
      const state = (await readPlayerState(sellerId)) || {};
      if (!state.skins) state.skins = {};
      if (!state.skins[listing.buildingKey]) state.skins[listing.buildingKey] = [0];
      if (!state.skins[listing.buildingKey].includes(listing.skinIdx)) {
        state.skins[listing.buildingKey].push(listing.skinIdx);
      }
      await writePlayerState(sellerId, state);
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/market/buy', async (req, res) => {
  const { listingId, buyerId } = req.body || {};
  if (!isValidListingId(listingId) || !isValidPlayerId(buyerId)) {
    return res.status(400).json({ error: 'invalid request' });
  }
  try {
    // Remove the listing under the market lock first, so two buyers racing
    // for the same item can't both succeed.
    const listing = await withLock('market', async () => {
      const listings = await readListings();
      const idx = listings.findIndex(l => l.id === listingId);
      if (idx === -1) return null;
      const [removed] = listings.splice(idx, 1);
      await writeListings(listings);
      return removed;
    });
    if (!listing) return res.status(404).json({ error: 'listing no longer available' });
    if (listing.sellerId === buyerId) {
      // put it back — buying your own listing isn't a valid trade
      await withLock('market', async () => {
        const listings = await readListings();
        listings.push(listing);
        await writeListings(listings);
      });
      return res.status(400).json({ error: "you can't buy your own listing" });
    }

    const buyerState = await withLock(`player:${buyerId}`, async () => {
      const state = await readPlayerState(buyerId);
      if (!state || (state.gold || 0) < listing.price) return { error: 'not enough gold' };
      state.gold -= listing.price;
      if (!state.skins) state.skins = {};
      if (!state.skins[listing.buildingKey]) state.skins[listing.buildingKey] = [0];
      state.skins[listing.buildingKey].push(listing.skinIdx);
      await writePlayerState(buyerId, state);
      return { ok: true };
    });

    if (buyerState.error) {
      // refund the listing since the purchase didn't go through
      await withLock('market', async () => {
        const listings = await readListings();
        listings.push(listing);
        await writeListings(listings);
      });
      return res.status(400).json({ error: buyerState.error });
    }

    const payout = Math.floor(listing.price * (1 - MARKET_COMMISSION));
    await withLock(`player:${listing.sellerId}`, async () => {
      const state = (await readPlayerState(listing.sellerId)) || {};
      state.gold = (state.gold || 0) + payout;
      await writePlayerState(listing.sellerId, state);
    });

    res.json({ ok: true, paid: listing.price, sellerReceived: payout });
  } catch (err) {
    console.error('Buy error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

/* ============================= GIFTS ============================= *
 * Player-to-player gifting: gold, or a cosmetic badge/frame credited
 * straight to a chosen recipient. Gold only, never gems — gems trace back
 * to real Pi money, so letting them move player-to-player would open a
 * laundering path between two Pi wallets. Achievement badges (see
 * ACHIEVEMENT_BADGES client-side) and the Founder badge are never in
 * GIFTABLE_BADGES below, for the same reason they're never purchasable:
 * owning one must always mean it was actually earned, so there's no
 * gift-shaped loophole into getting one another way.
 *
 * GIFTABLE_BADGES / GIFTABLE_FRAMES also include a couple of gift-exclusive
 * items (currently 'friendship' and 'ribbon') that never appear in the
 * normal purchasable BADGES/BADGE_FRAMES catalog client-side at all — for
 * those, gifting is the ONLY way to obtain them. Same ownership/duplicate
 * checks below apply either way.
 *
 * Delivery uses a small mailbox, not a live write into the recipient's
 * gameplay state: the gift is appended to recipient.pendingGifts, and the
 * CLIENT applies it (adds the gold/badge, shows a toast, clears the list)
 * next time that player's app loads — see applyPendingGifts() in index.html.
 * That keeps this endpoint from needing to know anything about gameplay
 * beyond "hand them this envelope."
 * ------------------------------------------------------------------------- */
const GIFT_DAILY_LIMIT = 5; // max gifts one player can SEND per calendar day (UTC)
const GIFT_GOLD_MIN = 5;
const GIFT_GOLD_MAX = 200;
// Must stay byte-for-byte identical to CANNED_GIFT_MESSAGES in index.html —
// the server's own copy, always accepted verbatim and unfiltered.
const CANNED_GIFT_MESSAGES = [
  'Congrats! 🎉', 'Thanks for playing together! 🤝', 'Good luck! 🍀', 'Enjoy! 🎁',
  'Well deserved! 👏', 'You inspire me! ✨', 'Keep it up! 💪', 'From one Pioneer to another 🏰',
];
// Must match GIFT_MESSAGE_MAX_LEN in index.html.
const GIFT_MESSAGE_MAX_LEN = 60;
const GIFT_MESSAGE_URL_RE = /(https?:\/\/|www\.)/i;
const GIFT_MESSAGE_DOMAIN_RE = /\b[a-z0-9-]+\.(com|net|org|io|co|info|biz|xyz|ru|gg|app|dev|me|link|tv|shop)\b/i;
// Free-text gift messages are now allowed alongside the canned whitelist,
// but never trusted as-is: length-capped, and rejected outright if it
// contains any HTML-tag-shaped angle brackets or anything link-shaped
// (scheme, www., or a bare domain). This is the server's own check — the
// client's sanitizeGiftMessage() is only there for instant feedback, this
// one is the actual authority since we never trust what the client sends.
function isValidGiftMessage(message) {
  if (message === undefined || message === null || message === '') return true;
  if (typeof message !== 'string') return false;
  if (CANNED_GIFT_MESSAGES.includes(message)) return true;
  if (message.length > GIFT_MESSAGE_MAX_LEN) return false;
  if (/[<>]/.test(message)) return false;
  if (GIFT_MESSAGE_URL_RE.test(message) || GIFT_MESSAGE_DOMAIN_RE.test(message)) return false;
  return true;
}

// Mirrors the gold prices of the subset of client-side BADGES / BADGE_FRAMES
// that are safe to gift. Keep in sync with index.html if those prices ever
// change — deliberately duplicated rather than trusting a price the client
// sends, per this file's security principle at the top.
const GIFTABLE_BADGES = {
  moon: 150, star: 90, flame: 120, blossom: 60, falcon: 135, dragon: 240,
  compass: 105, clover: 75, horseshoe: 75, evileye: 90, rabbitfoot: 105, bookworm: 120,
  // Gift-exclusive — mirrors GIFT_EXCLUSIVE_BADGES in index.html. Not present
  // in any purchasable client-side list, so the ONLY path to owning one is
  // through this endpoint. Same "recipient can't already own it" check below
  // applies, so it can't be re-gifted to someone who already has it.
  friendship: 100,
};
const GIFTABLE_FRAMES = {
  silver: 45, gold: 60, jeweled: 120,
  // Gift-exclusive — mirrors GIFT_EXCLUSIVE_FRAMES in index.html.
  ribbon: 90,
};

function todayKey() { return new Date().toISOString().slice(0, 10); }

app.post('/api/gift/send', async (req, res) => {
  const { senderId, recipientId, kind, itemId, amount, message } = req.body || {};
  if (!isValidPlayerId(senderId) || !isValidPlayerId(recipientId)) {
    return res.status(400).json({ error: 'invalid player id' });
  }
  if (senderId === recipientId) return res.status(400).json({ error: "you can't gift yourself" });
  if (!['gold', 'badge', 'frame'].includes(kind)) return res.status(400).json({ error: 'invalid gift kind' });
  if (message !== undefined && message !== null && !isValidGiftMessage(message)) {
    return res.status(400).json({ error: 'invalid message' }); // too long, or link/HTML-shaped content
  }

  let cost, giftPayload;
  if (kind === 'gold') {
    if (!Number.isInteger(amount) || amount < GIFT_GOLD_MIN || amount > GIFT_GOLD_MAX) {
      return res.status(400).json({ error: 'invalid gold amount' });
    }
    cost = amount;
    giftPayload = { kind: 'gold', amount };
  } else if (kind === 'badge') {
    if (!Object.prototype.hasOwnProperty.call(GIFTABLE_BADGES, itemId)) {
      return res.status(400).json({ error: 'that badge cannot be gifted' });
    }
    cost = GIFTABLE_BADGES[itemId];
    giftPayload = { kind: 'badge', itemId };
  } else {
    if (!Object.prototype.hasOwnProperty.call(GIFTABLE_FRAMES, itemId)) {
      return res.status(400).json({ error: 'that frame cannot be gifted' });
    }
    cost = GIFTABLE_FRAMES[itemId];
    giftPayload = { kind: 'frame', itemId };
  }

  try {
    // Recipient must actually exist, and (for badge/frame) not already own
    // it — both checked here since we already have to read their file for
    // the existence check, so it costs nothing extra to also save the
    // sender from spending gold on a gift that would just no-op on arrival.
    const recipientState = await readPlayerState(recipientId);
    if (!recipientState) return res.status(404).json({ error: 'recipient not found' });
    if (kind === 'badge' && (recipientState.ownedBadges || []).includes(itemId)) {
      return res.status(400).json({ error: 'recipient already owns that badge' });
    }
    if (kind === 'frame' && (recipientState.ownedFrames || []).includes(itemId)) {
      return res.status(400).json({ error: 'recipient already owns that frame' });
    }

    const result = await withLock(`player:${senderId}`, async () => {
      const state = await readPlayerState(senderId);
      if (!state) return { error: 'sender not found' };
      const today = todayKey();
      if (state.giftsSentDate !== today) { state.giftsSentDate = today; state.giftsSentCount = 0; }
      if ((state.giftsSentCount || 0) >= GIFT_DAILY_LIMIT) {
        return { error: `You can only send ${GIFT_DAILY_LIMIT} gifts per day` };
      }
      if ((state.gold || 0) < cost) return { error: 'not enough gold' };
      state.gold -= cost;
      state.giftsSentCount = (state.giftsSentCount || 0) + 1;
      await writePlayerState(senderId, state);
      return { ok: true };
    });
    if (result.error) return res.status(400).json({ error: result.error });

    const gift = {
      id: `gift_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      fromPlayerId: senderId,
      message: message || null,
      sentAt: Date.now(),
      ...giftPayload,
    };
    // Small race window: if the recipient's own client saves its full state
    // between this write and the recipient next loading it, this gift could
    // be overwritten before they see it. Acceptable for a cosmetic social
    // feature — same trade-off already made elsewhere in this file for
    // simplicity over a real distributed transaction.
    await withLock(`player:${recipientId}`, async () => {
      const state = (await readPlayerState(recipientId)) || {};
      if (!Array.isArray(state.pendingGifts)) state.pendingGifts = [];
      state.pendingGifts.push(gift);
      await writePlayerState(recipientId, state);
    });

    res.json({ ok: true, cost });
  } catch (err) {
    console.error('Gift error:', err);
    res.status(500).json({ error: 'internal error' });
  }
});

ensureDirs().then(() => {
  app.listen(PORT, () => console.log(`Kingdoms & Words server listening on :${PORT}`));
});
