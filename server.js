/**
 * Kingdoms & Words — backend
 * -------------------------------------------------------------------------
 * Three jobs:
 *   1. Save/load player state           (existing — unchanged behavior)
 *   2. Real Pi payments (gems + patron) — server-authoritative granting
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
    await withLock(`player:${playerId}`, () => writePlayerState(playerId, req.body));
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
// gems: flat currency top-up. patron: extends patronUntil by N days.
function isGrantableMetadata(metadata) {
  if (!metadata || typeof metadata !== 'object') return false;
  if (metadata.kind === 'gems') return Number.isInteger(metadata.gems) && metadata.gems > 0 && metadata.gems <= 100000;
  if (metadata.kind === 'patron') return Number.isInteger(metadata.days) && metadata.days > 0 && metadata.days <= 366;
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
    const approve = await piApi(`/payments/${paymentId}/approve`, { method: 'POST' });
    if (!approve.ok) return res.status(502).json({ error: 'Pi approval failed' });

    await ensureDirs();
    await fs.writeFile(pendingPathFor(paymentId), JSON.stringify({
      playerId, metadata: info.data.metadata, amount: info.data.amount, createdAt: Date.now(),
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
      applyGrant(state, pending.metadata);
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

function applyGrant(state, metadata) {
  if (metadata.kind === 'gems') {
    state.gems = (state.gems || 0) + metadata.gems;
  } else if (metadata.kind === 'patron') {
    const now = Date.now();
    const currentUntil = state.patronUntil ? new Date(state.patronUntil).getTime() : 0;
    const base = currentUntil > now ? currentUntil : now; // stacks onto remaining time instead of wasting it
    state.patronUntil = new Date(base + metadata.days * 86400000).toISOString();
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

ensureDirs().then(() => {
  app.listen(PORT, () => console.log(`Kingdoms & Words server listening on :${PORT}`));
});
