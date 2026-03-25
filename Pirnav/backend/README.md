# Pirnav Backend (Express)

This backend implements every `/api/*` endpoint the React app calls:
`/api/Jobs`, `/api/JobApplications`, `/api/interview`, `/api/Contact`, and `/api/Admin/*`.

## Prerequisites

- Node.js 18+ (tested with Node 24)

## Configure

```bash
cd Pirnav/backend
cp .env.example .env
```

Default admin credentials (from `.env.example`):
- `ADMIN_EMAIL=admin@pirnav.com`
- `ADMIN_PASSWORD=admin1234`

## Run

```bash
npm install
npm run dev
```

Server listens on `PORT` (default `5001`).

## Frontend

Make sure the frontend points at this backend:
`Pirnav/app/.env.example` uses `VITE_API_BASE_URL=http://localhost:5001`.

