# Pirnav Website (Full-Stack)

React (Vite) frontend + a production-ready backend (Express API) deployed with Docker on Linux (EC2).

Key design points:
- No secrets in source code. Configure via environment variables (`.env`).
- Frontend uses relative `/api/*` calls, and nginx proxies `/api` to the backend.
- Backend is not exposed directly from the host; only port `80` is published.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express (REST API)
- Auth: Admin JWT (`Authorization: Bearer <token>`)
- Storage: JSON file persistence (for production you may replace with a real DB)
- Reverse proxy: nginx (SPA routing + `/api` proxy)

## Local Development

### 1) Frontend
From repo root:
```bash
npm install
npm run dev
```

### 2) Backend (API)
```bash
cd backend
npm install
npm run dev
```

Backend default port (in this repo) is `5000`.

Note for local dev: the frontend calls relative `/api/*` routes. Vite proxies `/api` to the backend via `vite.config.js`. If your backend is running on a different port, set `VITE_API_PROXY_TARGET` in your local `.env`.

## Production Deployment (Docker Compose)

### 1) Configure environment
1. Copy `.env.example` to `.env` (do not commit `.env`):
   ```bash
   cp .env.example .env
   ```
2. Update at least these values:
   - `ADMIN_JWT_SECRET`
   - `ADMIN_PASSWORD`

### 2) Build and start
From repo root:
```bash
docker compose up -d --build
```

### 3) What ports are exposed?
- Frontend: `http://<server-ip>:80`
- Backend: available only inside Docker network (`backend:5000`), not published to the host.

## Docker Files
- `backend/Dockerfile`: Node/Express API container (port `5000`)
- `frontend/Dockerfile`: Vite build + nginx container (port `80`)
- `nginx.conf`: proxies `/api/` to `http://backend:5000`
- `docker-compose.yml`: orchestrates frontend + backend

## EC2 (Ubuntu) Deployment Steps

### 1) Launch EC2
- Choose Ubuntu Server (any recent LTS).
- Attach a Security Group that allows:
  - Inbound `80/tcp` from your IP (or `0.0.0.0/0` if you must)
  - Inbound `22/tcp` from your IP
- Do NOT open `5000` to the public Internet (backend is behind nginx in Docker).

### 2) Install Docker + Docker Compose
On the EC2 instance:
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
```
Verify:
```bash
docker --version
docker compose version
```

### 3) Clone the repository
```bash
git clone <YOUR_REPO_URL>
cd <YOUR_REPO_FOLDER>
```

### 4) Create `.env`
```bash
cp .env.example .env
# edit .env with a strong ADMIN_JWT_SECRET + ADMIN_PASSWORD
```

### 5) Run Docker Compose
```bash
docker compose up -d --build
```

### 6) View logs
```bash
docker compose logs -f
```

## Troubleshooting
1. **Frontend loads but API calls fail**
   - Confirm nginx is proxying `/api/` to `backend:5000`
   - Check backend logs: `docker compose logs backend`
2. **Admin login fails (401)**
   - Ensure `ADMIN_JWT_SECRET` and `ADMIN_PASSWORD` match what’s in `.env`
3. **Resume downloads fail**
   - Verify volume permissions for `backend/uploads` (resumes)
4. **CORS issues**
   - With nginx same-origin routing, CORS should not be needed for browsers.
   - If you call backend from another origin, set `CORS_ORIGINS` in `.env`.

