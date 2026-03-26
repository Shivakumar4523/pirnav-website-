# Backend Functions and Deployment API Changes

This document explains how the backend works and what API call updates are required when deploying in a new setup (especially Docker).

## Backend Overview

Backend path: `backend`

Tech stack:
- Node.js + Express
- JWT auth for admin routes
- `multer` for resume uploads
- JSON file persistence in `data/store.json`

Main files:
- `src/server.js`: app bootstrap, CORS, route registration, health check, sample seed jobs.
- `src/middleware/auth.js`: validates `Authorization: Bearer <token>` for admin-only routes.
- `src/storage/store.js`: JSON datastore read/write and incremental ID generation.
- `src/storage/auth.js`: password hashing and verification for admin users.

Route modules:
- `src/routes/admin.js`
  - `POST /api/Admin/login`
  - `GET /api/Admin/dashboard-summary`
  - `GET /api/Admin/recent-messages`
  - `GET /api/Admin/recent-applications`
- `src/routes/jobs.js`
  - Public: `GET /api/Jobs/public`, `GET /api/Jobs/public/:id`
  - Admin: `GET/POST/PUT/DELETE /api/Jobs`
- `src/routes/jobApplications.js`
  - Public: `POST /api/JobApplications` (multipart resume upload)
  - Admin: `GET /api/JobApplications`, `PUT /api/JobApplications/status`, `PUT /api/JobApplications/:id/status`, `GET /api/JobApplications/download/:id`
  - Alias path also enabled: `/api/candidates`
- `src/routes/interviews.js`
  - `GET /api/interview`, `POST /api/interview`, `PUT /api/interview/:id`
  - Alias path also enabled: `/api/interviews`
- `src/routes/contact.js`
  - Public: `POST /api/Contact`
  - Admin: `GET /api/Contact`, `GET /api/Contact/unread-count`, `GET /api/Contact/:id`, `PUT /api/Contact/mark-read/:id`, `DELETE /api/Contact/:id`

## Environment Variables (Backend)

Use `backend/.env`:

- `PORT=5000`
- `ADMIN_JWT_SECRET=...`
- `ADMIN_EMAIL=...`
- `ADMIN_PASSWORD=...`
- `CORS_ORIGINS=http://localhost:5173` (comma-separated for multiple origins)

## API Call Changes Needed for New Deployment

When moving to Docker, staging, or production, update frontend API base URLs so requests do not point to old domains.

### Frontend API routing

The frontend uses relative `/api/*` endpoints, and Docker/nginx proxies `/api` to the backend.
Because of this, there should be no need to configure `VITE_API_BASE_URL` for production deployments.

## Docker Notes

Important: if React runs in the browser, `backend:5000` works only inside Docker network, not directly in user browser. Prefer nginx reverse proxy routing:

1) Reverse proxy (recommended):
- Expose frontend and backend on same domain
- Route `/api/*` to backend service (same-origin from the browser)

2) Separate public backend host:
- Expose backend as `https://api.your-domain.com`
- Set `VITE_API_BASE_URL=https://api.your-domain.com`
- Ensure `CORS_ORIGINS` includes frontend domain

## Quick Post-Deploy Validation

1. `GET /health` returns `{ "ok": true }`
2. Frontend careers page loads jobs (`GET /api/Jobs/public`)
3. Admin login returns token (`POST /api/Admin/login`)
4. Contact form submit works (`POST /api/Contact`)
5. Application submit + resume upload works (`POST /api/JobApplications`)

