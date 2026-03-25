# Backend Functions and Deployment API Changes

This document explains how the backend works and what API call updates are required when deploying in a new setup (especially Docker).

## Backend Overview

Backend path: `Pirnav/backend`

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

Use `Pirnav/backend/.env`:

- `PORT=5001`
- `ADMIN_JWT_SECRET=...`
- `ADMIN_EMAIL=admin@pirnav.com`
- `ADMIN_PASSWORD=admin1234`
- `CORS_ORIGINS=http://localhost:5173` (comma-separated for multiple origins)

## API Call Changes Needed for New Deployment

When moving to Docker, staging, or production, update frontend API base URLs so requests do not point to old domains.

### 1) Frontend environment base URL

File: `Pirnav/app/.env` (create from `.env.example`)

Use one of these:

- Local backend:
  - `VITE_API_BASE_URL=http://localhost:5001`
- Same domain deployment (recommended with reverse proxy):
  - `VITE_API_BASE_URL=https://your-domain.com`

Optional endpoint overrides:
- `VITE_JOB_APPLICATIONS_API_BASE=https://your-domain.com/api/JobApplications`
- `VITE_CANDIDATES_API_BASE=https://your-domain.com/api/candidates`
- `VITE_INTERVIEW_API_BASE=https://your-domain.com/api/interview`
- `VITE_INTERVIEWS_API_BASE=https://your-domain.com/api/interviews`

### 2) Frontend files with hardcoded API constants

These files currently contain hardcoded API URLs and should be updated to use `import.meta.env.VITE_API_BASE_URL` (or set your real domain there):

- `Pirnav/app/src/Components/Dashboard/Careers.jsx`
  - `const BASE_URL = "https://.../api"`
- `Pirnav/app/src/Components/Dashboard/JobDetails.jsx`
  - `const BASE_URL = "https://.../api"`
- `Pirnav/app/src/Components/Dashboard/Contact.jsx`
  - `fetch("https://.../api/Contact", ...)`
- `Pirnav/app/src/Components/Admin/AdminLogin.jsx`
  - `const API_BASE = "https://.../api/Admin/login"`
- `Pirnav/app/src/Components/Admin/AdminJobs.jsx`
  - `const API_BASE = "https://.../api/Jobs"`
- `Pirnav/app/src/Components/Admin/ContactMessages.jsx`
  - `const API_BASE = "https://.../api/Contact"`
- `Pirnav/app/src/Components/Admin/DashboardHome.jsx`
  - `const BASE_URL = "https://.../api/Admin"`

Note: `applicationStatus.js` and `interviewApi.js` already support env-based API bases with fallback logic.

## Docker Notes

Important: if React runs in the browser, `http://backend:5001` works only inside Docker network, not directly in user browser. Prefer one of:

1) Reverse proxy (recommended):
- Expose frontend and backend on same domain
- Route `/api/*` to backend service
- Set `VITE_API_BASE_URL=https://your-domain.com`

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

