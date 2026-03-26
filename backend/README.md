# Pirnav Backend (Express)

This backend implements every `/api/*` endpoint the React app calls:
`/api/Jobs`, `/api/JobApplications`, `/api/interview`, `/api/Contact`, and `/api/Admin/*`.

## Prerequisites

- Node.js 18+ (tested with Node 24)

## Configure

```bash
cd backend
cp .env.example .env
```

Set these in `backend/.env` (or via environment variables in Docker):
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Run

```bash
npm install
npm run dev
```

Server listens on `PORT` (default `5000`).

## Frontend

Frontend calls the backend via relative `/api/*` paths (proxied by nginx).

