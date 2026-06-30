# Deployment Guide

LastMinute AI deploys as two Cloud Run services: a FastAPI backend and a React/Nginx frontend.

## Required Services

- Google Cloud Run
- Cloud Build
- Artifact Registry or Container Registry
- Firebase Authentication
- Firestore
- Gemini API

## Backend Environment Variables

```text
GEMINI_API_KEY=your-gemini-key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
ALLOWED_ORIGINS=https://your-frontend-url,http://localhost:5173,http://127.0.0.1:5173
```

If these are omitted, the backend runs in documented demo mode with in-memory storage and deterministic AI fallback.

## Frontend Environment Variables

```text
VITE_API_URL=https://your-backend-url
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

If Firebase values are omitted, the frontend uses a demo user so judges can evaluate the product immediately.

## Cloud Build

Backend:

```bash
gcloud builds submit --config cloudbuild.backend.yaml --substitutions _REGION=us-central1
```

Frontend:

```bash
gcloud builds submit --config cloudbuild.frontend.yaml --substitutions _REGION=us-central1,_VITE_API_URL=https://YOUR_BACKEND_URL,_VITE_FIREBASE_API_KEY=KEY,_VITE_FIREBASE_AUTH_DOMAIN=DOMAIN,_VITE_FIREBASE_PROJECT_ID=PROJECT,_VITE_FIREBASE_APP_ID=APP
```

## Manual Docker Commands

```bash
docker build -t lastminute-ai-api ./backend
docker build -t lastminute-ai-web --build-arg VITE_API_URL=http://localhost:8000 --build-arg VITE_FIREBASE_API_KEY=KEY --build-arg VITE_FIREBASE_AUTH_DOMAIN=DOMAIN --build-arg VITE_FIREBASE_PROJECT_ID=PROJECT --build-arg VITE_FIREBASE_APP_ID=APP ./frontend
```

## Docker Compose

```bash
docker compose up --build
```

The compose file runs the backend on `http://localhost:8000` and the frontend on `http://localhost:5173`.

## Local Verification

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

cd frontend
npm install
npm run build
npm run dev -- --host 127.0.0.1
```
