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

For production on Vercel, create a **Blob store** in the project (Storage → Blob). Vercel sets `BLOB_READ_WRITE_TOKEN` automatically. The app saves `data/registry.json` to Blob on the first edit; until then it serves the bundled list from the repo.

## Admin

Default credentials: **admin** / **admin**

Change `REGISTRY_SECRET` in `.env.local` for production cookie signing.
