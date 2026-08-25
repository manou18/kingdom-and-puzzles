# Kingdoms & Words

A word-puzzle kingdom builder for Pi Browser. Runs as a static site with a
Netlify Functions backend — ported from the original Node/Express `server/`
folder to `netlify/functions/`, following the same patterns (payment
verification, identity verification, bot/abuse protection) as the
chesspi-board reference app.

## What the backend handles

1. **Save/load** — a player's full game state, synced across devices.
2. **Real Pi payments** — gem packs, gold packs, the monthly Patron /
   Patron+ pass, and the weekly Starter Offer.
3. **A gold-only marketplace** for trading cosmetic building skins.
4. **Gifting** — gold, badges, and frames sent between players.
5. **Leaderboard** — public stats for every player.

Storage is [Netlify Blobs](https://docs.netlify.com/blobs/overview/) — no
database to provision. One blob per player under the `player-state` store
holds their entire save; payments get their own ledger in `payments`;
marketplace listings live in `market-listings`.

## Player identity — how it's verified

There are two kinds of players, verified two different ways:

- **A Pi payment** (`approve.js`/`complete.js`) needs no separate identity
  check at all: Pi's own payment record (`GET /v2/payments/:id`) already
  says which account (`user_uid`) created it. The client sends only
  `{ paymentId }` / `{ paymentId, txid }` — there's no player-identity
  field on these requests for anyone to spoof in the first place. This
  mirrors chesspi-board's `approve.js`/`complete.js` exactly.
- **Everything else that's player-specific** (save/load, marketplace,
  gifting) needs a Pi access token, verified against Pi's own
  `GET /v2/me` (see `netlify/functions/_lib/piAuth.js` and
  `_lib/identity.js`) — mirrors chesspi-board's `get-progress.js`/
  `save-progress.js`. The canonical playerId for a signed-in player is
  `pi_<uid>` (Pi's own opaque, stable id), derived from that verified
  response — **never** from a `playerId` the request merely claims. A
  request claiming a `pi_`-prefixed identity without a valid access token
  is rejected outright (`401`).
- **Guest play** (no Pi account) is unverified by necessity — a
  self-chosen `guest_<random>` id is trusted as-is, same as the original
  design. There's no real Pi identity to check, and no real-money or
  cross-account impersonation value in guessing someone's random guest id.

`getPlayerId()` in `script.js` returns `pi_<uid>` (from `Pi.authenticate()`'s
own response) for a signed-in player — the exact same string the backend
independently re-derives from the verified token, so the two always agree.
Every player-specific `fetch()` call also sends the current
`piAccessToken` via `piAuthFields()` (POST body) / `piAuthQuery()` (GET
query string).

**Display names**: since `playerId` is now an opaque uid with no readable
name in it, `state-save.js` stores the player's real Pi username
(`piUsername`) alongside their save — again, taken only from the verified
`/v2/me` response, never the client. `leaderboard.js` returns it as
`displayName`, and `gift-send.js` stamps a gift's `fromUsername` the same
way, so a gift recipient sees a real name without the server ever having
to trust one a client typed in.

> **Migrating from an earlier version of this app?** If any test saves
> exist under the old `pi_<username>`-keyed scheme, they won't be found
> under the new `pi_<uid>` keys — this is a one-time break, not an ongoing
> issue. Fine to ignore during development; if this is already live with
> real players, you'd want a one-off migration script instead of skipping
> straight to this scheme.

## Deploy on Netlify

1. Push this repo to GitHub/GitLab/Bitbucket (or use the Netlify CLI) and
   create a new Netlify site from it. `netlify.toml` already points Netlify
   at `netlify/functions/` — no build command is needed, this is a static
   site.
2. In **Site settings → Environment variables**, set:
   - `PI_API_KEY` — from the [Pi Developer Portal](https://develop.pi.network)
     for this app. Required for every payment endpoint (`approve`,
     `complete`, `cancel`, `cleanup-stale-payments`). Never commit it.
   - `BLOBS_SITE_ID` / `BLOBS_TOKEN` — only needed if your deploy doesn't
     get Netlify Blobs' automatic configuration (see
     `netlify/functions/_lib/blobStore.js`). Most sites don't need these.
   - `CMC_API_KEY` — optional. Only used as a fallback price source if
     CoinGecko is unreachable when checking a payment's Pi/USD amount.
3. Deploy. Netlify installs `axios` and `@netlify/blobs` from
   `package.json` automatically and publishes each file in
   `netlify/functions/` as `/.netlify/functions/<name>`.
4. In `script.js`, `API_BASE` is already set to `/.netlify/functions` — no
   change needed once this same site is what you deploy. If you ever split
   the frontend and backend onto different Netlify sites, point `API_BASE`
   at the backend site's URL + `/.netlify/functions` instead.

## Endpoints

**Save/load** (identity via access token — see above)
- `GET  /.netlify/functions/state-get?playerId=...&accessToken=...`
- `POST /.netlify/functions/state-save` — `{ playerId, accessToken, state }`

**Payments** (identity via Pi's own payment record — see above; mirrors the
client's `Pi.createPayment` callbacks — see `purchaseWithPi()` in `script.js`)
- `POST /.netlify/functions/approve` — `{ paymentId }`, called from `onReadyForServerApproval`
- `POST /.netlify/functions/complete` — `{ paymentId, txid }`, called from `onReadyForServerCompletion`
- `POST /.netlify/functions/cancel` — `{ paymentId }`
- `cleanup-stale-payments` — scheduled (`@daily`), reconciles any payment
  that got approved but never completed

Both `approve` and `complete` verify the payment against Pi's API before
granting anything — the server never trusts the amount, product, or payer
identity the client claims, only what Pi's API says the payment was
actually for and who actually made it (see the comments at the top of
`netlify/functions/approve.js`).

**Marketplace** (identity via access token)
- `GET  /.netlify/functions/market-listings`
- `POST /.netlify/functions/market-list` — `{ sellerId, accessToken, buildingKey, skinIdx, price }`
- `POST /.netlify/functions/market-buy` — `{ listingId, buyerId, accessToken }` — 10% commission
- `POST /.netlify/functions/market-cancel` — `{ listingId, sellerId, accessToken }`

**Gifting** (sender identity via access token; recipient is just a delivery target, not identity-checked)
- `POST /.netlify/functions/gift-send` — `{ senderId, accessToken, recipientId, kind, itemId?, amount?, message? }`

**Leaderboard**
- `GET /.netlify/functions/leaderboard`

## Bot / abuse protection

Every function goes through `netlify/functions/_lib/security.js` (ported
from the chesspi-board reference app) before doing anything else:

- **Origin check** (`isTrustedOrigin`) — every state-mutating endpoint
  (`state-save`, `approve`, `complete`, `cancel`, `market-list`,
  `market-buy`, `market-cancel`, `gift-send`) rejects any request whose
  `Origin`/`Referer` header doesn't match the `Host` it arrived on. A
  same-origin `fetch()` from the app's own page always sends a matching
  Origin — a script, curl, or bot calling the endpoint directly from
  somewhere else won't. Needs no configuration (no domain to hardcode).
  Public read-only endpoints (`state-get`, `leaderboard`,
  `market-listings`, `get-pi-price`) skip this check on purpose, same as
  chesspi-board's `get-leaderboard.js` — a plain read has no side effects,
  so it isn't worth risking a false positive blocking a real player.
- **Per-IP rate limit** (`checkRateLimit`) — a fixed-window counter per
  `(endpoint, client IP)`, stored in a `rate-limits` Netlify Blobs store.
  Catches scripted bursts cheaply. Uses Blobs' optimistic-concurrency
  write (etag + `onlyIfMatch`) when available so two near-simultaneous
  requests can't both slip through a race in the counter.
- **Per-player rate limit** (`checkUidRateLimit`, keyed by the resolved
  `playerId`/`uid`) — a second, independent limit so a shared IP (a
  school, an ISP's carrier-grade NAT) doesn't get every real player behind
  it throttled by the IP limit alone; one player being hammered is caught
  here regardless of which IP/network they're on. Applied everywhere a
  verified identity is available — i.e. every endpoint except
  `approve`/`complete` (whose identity isn't known until after the Pi API
  call — same as chesspi-board) and `cancel` (which never handles player
  identity at all).

None of this is bulletproof alone — headers can be spoofed, and the rate
limiter is best-effort under heavy concurrency — but together they filter
out the overwhelming majority of scripted/scraper traffic for free, with
no new paid infrastructure. `robots.txt` also asks well-behaved crawlers
to stay out of `/.netlify/functions/` and `/netlify/`, and `_headers`
adds standard security response headers (`X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`, HSTS) without a
Content-Security-Policy — a CSP was deliberately left out because it can
silently break `Pi.authenticate()`/`Pi.createPayment()` if it doesn't
allowlist every domain Pi's real auth flow talks to (see the comment in
`_headers` for the full explanation).

## Before you put this on the real internet

- **Verify the Pi API integration against current docs.** The payment flow
  here (`PI_API_BASE`, the `Authorization: Key ...` header, the
  approve/complete endpoint shapes, `GET /v2/me`) mirrors Pi Network's
  documented pattern and the chesspi-board reference app, but confirm the
  exact paths/headers against Pi's current developer documentation before
  accepting real payments.
- **CORS**: Netlify Functions on the same domain as your static site don't
  need CORS headers for same-origin requests from your own frontend. If
  you ever call these functions from a different origin, add
  `Access-Control-Allow-Origin` headers to each function's response.
- **Concurrency**: like the original Express server, there is no
  distributed lock across concurrent requests — two near-simultaneous
  requests touching the same player/listing can race. Acceptable at small
  scale; if that ever matters, add optimistic concurrency (Netlify Blobs
  supports conditional writes) or move to a database with real
  transactions.
- **The Pi ↔ gold boundary is deliberate**: gems are bought with Pi and
  gold is earned/bought separately, but neither converts back into Pi
  through the marketplace or anywhere else. Keep it that way — a path that
  lets players cash game assets back out for real money changes this from
  "an in-game economy" into something that likely needs money-
  transmission licensing and far more compliance work. Get real legal
  advice before changing that.
- **PI_SANDBOX**: `script.js` currently has `PI_SANDBOX = true` (for
  testing an unapproved app inside Pi Browser's Sandbox). Set it to
  `false` once your app is live/approved on Mainnet.
