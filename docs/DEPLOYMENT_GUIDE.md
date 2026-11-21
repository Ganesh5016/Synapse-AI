# Deployment Guide — Synapse Platform

This guide outlines setup, containerization, and production deployment procedures for the Synapse Learning Intelligence Platform.

---

## 1. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Example / Default |
|----------|-------------|-------------------|
| `ENVIRONMENT` | Runtime mode (`development`, `staging`, `production`) | `production` |
| `PORT` | HTTP port for Uvicorn | `8000` |
| `HOST` | Bind address | `0.0.0.0` |
| `LOG_LEVEL` | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`) | `INFO` |
| `SUPABASE_URL` | Supabase project REST URL | `https://xyzcompany.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase privileged service role API key | `eyJhbGciOi...` |
| `SUPABASE_JWT_SECRET` | Supabase JWT secret used to verify Bearer tokens | `super-secret-jwt-token-string` |
| `HF_API_TOKEN` | Hugging Face inference API token | `hf_xxxxxxxxxxxxxxxxxxxxxxxx` |
| `CORS_ORIGINS` | Comma-delimited origins allowed for CORS | `https://synapse.edu,http://localhost:3000` |

### Frontend (`frontend/.env`)

| Variable | Description | Example / Default |
|----------|-------------|-------------------|
| `VITE_API_URL` | Base URL of the Synapse FastAPI backend | `https://api.synapse.edu` or `http://localhost:8000` |
| `VITE_SUPABASE_URL` | Supabase project URL for GoTrue Auth | `https://xyzcompany.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anonymous API key | `eyJhbGciOi...` |

---

## 2. Local Development Setup

### 2.1 Backend Setup
```bash
cd backend
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend Swagger interactive documentation is accessible at `http://localhost:8000/docs`.

### 2.2 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend development server is accessible at `http://localhost:5173`.

---

## 3. Multi-Container Orchestration (Docker Compose)

For local testing with full container parity:

```bash
# Build and run backend and frontend containers
docker compose up --build

# Run in background detached mode
docker compose up -d

# Check service health status
docker compose ps
```
- Frontend: `http://localhost:3000`
- Backend Health: `http://localhost:8000/api/v1/health`

---

## 4. Production Cloud Deployment

### 4.1 Supabase Database & Auth Provisioning
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Under **Project Settings > Database**, enable the `vector` extension (`CREATE EXTENSION IF NOT EXISTS vector;`).
3. Under **SQL Editor**, execute the migration script in `supabase/migrations/` to initialize all 30 tables and RLS security policies.
4. Copy the Project URL, Anon Key, Service Role Key, and JWT Secret from **Project Settings > API**.

### 4.2 Backend API Deployment on Render
1. Connect your repository to Render.
2. Select **Blueprint** and point to `render.yaml`, or create a new **Web Service**:
   - **Environment**: Python
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers`
   - **Health Check Path**: `/api/v1/health`
3. Configure environment variables in the Render dashboard (`SUPABASE_URL`, `SUPABASE_JWT_SECRET`, `HF_API_TOKEN`).

### 4.3 Frontend SPA Deployment on Vercel
1. Import the project repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Supply environment variables (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
6. Deploy. The committed `vercel.json` ensures all client-side routes fallback to `index.html`.

---

## 5. Automated Verification & Testing

Verify system readiness prior to release:

```bash
# 1. Run all backend unit, integration, and security tests
cd backend
python -m pytest tests/

# 2. Run frontend typecheck and production build
cd frontend
npm run build
```

