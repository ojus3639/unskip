# Wedding Gift Registry

A mobile-first wedding gift list built with Next.js and Tailwind CSS.

## Features

- Public gift list with reserve/block flow (names hidden from guests)
- Admin login to see who reserved each gift (`admin` / `admin`)
- Edit gift list page (names + links)
- Couple photo background with a clean, minimal theme

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` — Public gift list
- `/admin` — Login + view reservations
- `/admin/edit` — Login + edit gifts

## Data

Gift data is stored in `data/registry.json`. Reservations and edits persist on the server filesystem (works on local dev and persistent Node hosts).

For serverless deploys (e.g. Vercel), use a host with writable storage or migrate to a database.

## Admin

Default credentials: **admin** / **admin**

Change `REGISTRY_SECRET` in `.env.local` for production cookie signing.
