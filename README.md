# Kingdoms & Words — backend

Handles three things:
1. Save/load (localStorage's server-side backup, already covered before)
2. Real Pi payments — gem packs and the monthly Patron pass
3. An internal, gold-only marketplace for trading cosmetic skins

## Run it locally

```bash
cd server
npm install
PI_API_KEY=your_key_from_the_pi_developer_portal npm start
```

`PI_API_KEY` is required for the payment endpoints (`/api/payments/*`) to
work — get it from the Pi Developer Portal for your app. Never commit it;
set it as an environment variable on whatever host you deploy to.

## Endpoints

**Save/load**
- `GET/POST /api/state/:playerId`

**Payments** (see the big comment above them in `server.js` for the full flow)
- `POST /api/payments/approve` — called by the client's `onReadyForServerApproval`
- `POST /api/payments/complete` — called by the client's `onReadyForServerCompletion`
- Both verify the payment against Pi's API before granting anything — the
  server never trusts amounts/items the client claims, only what Pi's API
  says the payment was actually for.

**Marketplace**
- `GET  /api/market/listings`
- `POST /api/market/list`   `{ sellerId, buildingKey, skinIdx, price }`
- `POST /api/market/buy`    `{ listingId, buyerId }` — takes a 10% commission
- `POST /api/market/cancel` `{ listingId, sellerId }`

**Leaderboard**
- `GET /api/leaderboard` — returns every player's public stats (gold, dynasties founded, lifetime donations, streak); the client sorts by whichever metric the player picks.

## Connect the game to it

Same as before — set `API_BASE` near the bottom of `index-81.html`'s
`<script>` to your deployed URL + `/api`.

## Before you put this on the real internet

- **CORS**: change `ALLOWED_ORIGINS` from `'*'` to your actual game domain(s).
- **Verify the Pi API integration against current docs.** The payment flow
  in this file (`PI_API_BASE`, the `Authorization: Key ...` header, the
  approve/complete endpoint shapes) reflects Pi Network's historically
  documented pattern, but it was written without live network access to
  test against a real payment — confirm the exact paths/headers against
  Pi's current developer documentation before accepting real payments.
- **Storage**: still one JSON file per player/listing — fine to start,
  but move to a real database with real transactions once you have
  meaningful traffic, especially for the marketplace (the in-process lock
  here only protects a single server instance; it won't be safe if you ever
  run more than one instance behind a load balancer).
- **The Pi ↔ gold boundary is deliberate**: gems are bought with Pi and gold
  is earned/bought separately, but neither converts back into Pi through the
  marketplace or anywhere else. Keep it that way — a path that lets players
  cash game assets back out for real money changes this from "an in-game
  economy" into something that likely needs money-transmission licensing
  and far more compliance work. Get real legal advice before changing that.
- **Backups**: back up `data/` periodically, especially `data/market-listings.json`.

