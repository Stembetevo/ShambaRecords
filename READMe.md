# Shamba Records

Shamba Records is a farm records management application with a Django REST API backend and a React + Vite frontend. The system supports two user roles:

- Admins manage fields, assign agents, and view overall dashboard metrics.
- Agents view only their assigned fields and update field progress.

## Project Structure

- `backend/shambarecords/` - Django project and REST API
- `frontend/` - React application built with Vite

## Requirements

- Python 3.11+ recommended
- Node.js 20+ recommended
- `pnpm` for the frontend
- PostgreSQL for production

## Local Setup

### 1. Backend

From the backend directory:

```bash
cd backend/shambarecords
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed
python manage.py runserver
```

If you do not want seeded demo data, skip `python manage.py seed`.

Backend environment variables:

- `SECRET_KEY` - required
- `DEBUG` - set to `True` locally, `False` in production
- `ALLOWED_HOSTS` - comma-separated host names
- `DATABASE_URL` - optional locally, required for production if you are not using SQLite
- `CORS_ALLOWED_ORIGINS` - comma-separated frontend origins

When `DATABASE_URL` is not set, the backend uses the local SQLite database at `backend/shambarecords/db.sqlite3`.

### 2. Frontend

From the frontend directory:

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend environment variables:

- `VITE_API_URL` - backend API base URL, for example `http://localhost:8000`

The frontend code appends `/api` automatically, so the value should be the backend origin, not the full API path.

### 3. Verify the app locally

- Backend API: `http://localhost:8000/api/`
- Frontend: `http://localhost:5173/`

## Deployment on Vercel

This project is deployed as two separate Vercel projects.

### Backend project

- Root directory: `backend/shambarecords`
- Runtime: Python
- Entry point: `backend/shambarecords/index.py`

Set these environment variables in Vercel:

- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `DATABASE_URL`

Use a managed PostgreSQL database for production. SQLite is fine for local development but not for Vercel persistence.

### Frontend project

- Root directory: `frontend`
- Framework: Vite / React

Set this environment variable in Vercel:

- `VITE_API_URL` - backend Vercel URL

## API Overview

Main backend endpoints:

- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/register/`
- `GET /api/me/`
- `GET /api/agents/`
- `GET /api/fields/`
- `POST /api/fields/`
- `GET /api/fields/<id>/`
- `POST /api/fields/<id>/updates/`
- `GET /api/dashboard/`

## Design Decisions

- The frontend and backend are deployed separately so each can scale and deploy independently.
- Authentication uses JWT tokens through Django REST Framework SimpleJWT.
- The frontend stores access and refresh tokens in `localStorage` to keep the implementation simple.
- Field records use a `public_id` UUID for lookup instead of exposing sequential primary keys.
- Role-based permissions are enforced on the backend, not just in the UI.
- Django is used as an API-only backend, while Vercel serves the React frontend as a static app.
- Backend database access is driven through `DATABASE_URL` so the same code works locally and in production.

## Assumptions Made

- Production deployments use Vercel for hosting and a managed PostgreSQL database.
- The backend does not need long-running background workers, websockets, or file storage beyond the API itself.
- The app is intended to be used by authenticated users only.
- Admin users are created separately, either through Django admin, a seed command, or direct database setup.
- Frontend routes are handled client-side, so a fallback rewrite is required in production.

## Notes

- If the backend root URL shows a simple JSON response, that is expected and indicates the server is healthy.
- If you change the frontend API domain, update `VITE_API_URL` and redeploy the frontend.
