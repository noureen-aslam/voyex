# VOYEX - Smart Trip Planner

VOYEX is a full-stack travel planning and booking application. Users can explore curated packages, plan custom trips in a multi-step wizard, create bookings, complete payment, and manage trips from a dashboard-style UI.

## What This App Does

- User authentication (register and login)
- Curated package browsing
- Custom trip planning flow (`/plan`)
- Booking confirmation with generated booking ID
- Payment confirmation flow
- "My Trips" dashboard for active and past trips
- Ticket export options (PDF and image) on confirmation

## Tech Stack

### Frontend

- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- `jspdf` and `canvas-confetti`

### Backend

- Java 17
- Jakarta Servlet API (WAR deployment)
- Maven
- MySQL
- Gson
- jBCrypt

## High-Level Architecture

- Frontend lives in `frontend/` and calls backend APIs under `/api/*`.
- During local frontend dev, Vite proxies `/api` to `http://localhost:8080`.
- Backend is a servlet-based WAR app in `backend/`.
- Data is stored in MySQL (`users`, `travel_packages`, `trips`).
- Session + token-like flow:
  - Backend creates HTTP session on login.
  - Frontend stores returned `token` and user data in `localStorage`.
  - Requests include `credentials: include` and `Authorization` header when token exists.

## Project Structure

- `frontend/` - React app
  - `src/pages/` - screens (`Home`, `TripWizard`, `Packages`, `Payment`, `MyTrips`, etc.)
  - `src/lib/api.ts` - API client + endpoint wrappers
  - `src/context/TripContext.tsx` - app-wide trip and user state
- `backend/` - Java servlet application
  - `src/main/java/com/voyex/servlet/` - API servlets
  - `src/main/java/com/voyex/dao/` - database access layer
  - `src/main/java/com/voyex/filter/` - CORS/session filters
  - `src/main/resources/schema.sql` - database schema
- `Dockerfile` - backend container build/run (Tomcat + WAR)

## Frontend Routes

- `/` - landing page
- `/packages` - package listing
- `/login` - login
- `/register` - register
- `/plan` - trip wizard
- `/confirmation` - booking confirmation and ticket generation
- `/payment` - payment confirmation screen
- `/dashboard` - user dashboard
- `/my-trips` - active and past trips

## Backend API Endpoints

- `POST /api/auth/register` - create account
- `POST /api/auth/login` - login and session creation
- `GET /api/packages` - list travel packages
- `GET /api/trips?userId=<id>` - list trips for user
- `POST /api/trips` - create trip booking
- `POST /api/payments/confirm` - confirm booking payment

## Prerequisites

- Node.js 18+ and npm
- Java 17
- Maven 3.9+
- MySQL 8+
- (Optional) Docker

## Local Setup

## 1) Clone and install frontend dependencies

```bash
git clone <your-repo-url>
cd voyex
npm install
cd frontend
npm install
```

## 2) Configure database

Create a MySQL database and run:

```sql
backend/src/main/resources/schema.sql
```

By default backend reads:

- `MYSQL_PUBLIC_URL` (example: `mysql://user:password@localhost:3306/voyex`)

If not set, backend fallback is:

- `mysql://root:password@localhost:3306/railway`

Set your own environment variable before starting backend.

## 3) Start backend (Servlet WAR)

This backend is packaged as a WAR and expected to run on Tomcat.

### Option A: Build WAR and deploy to local Tomcat

```bash
cd backend
mvn clean package
```

Then deploy `backend/target/ROOT.war` to your Tomcat `webapps/` directory and run Tomcat on port `8080`.

### Option B: Run backend with Docker

From repo root:

```bash
docker build -t voyex-backend .
docker run --rm -p 8080:8080 -e MYSQL_PUBLIC_URL="mysql://user:password@host:3306/voyex" voyex-backend
```

## 4) Start frontend

From repo root:

```bash
npm run dev
```

This runs Vite on `http://localhost:5173` and proxies `/api` to `http://localhost:8080`.

## Environment Variables

### Frontend

- `VITE_API_BASE_URL` (optional)
  - Default: `https://voyex.onrender.com`
  - For local development, proxy handles `/api` calls, so this is usually not needed.

### Backend

- `MYSQL_PUBLIC_URL` (recommended)
  - Format: `mysql://<user>:<password>@<host>:<port>/<database>`

## Key Functional Notes

- Booking IDs are shown to users as `VOYEX<id>`.
- Payment endpoint strips `VOYEX` prefix and confirms DB payment status.
- Confirmation page supports:
  - Ticket PDF download
  - Canvas ticket image generation/download
  - Share intent (Web Share API or clipboard fallback)
- Trip state and active booking are persisted in `localStorage` via `TripContext`.

## Deployment Notes

- Frontend appears configured for Vercel (`frontend/vercel.json` and `.vercel/`).
- Backend is containerized with Tomcat and WAR deployment (`Dockerfile`).
- CORS currently allows:
  - `https://voyex-bay.vercel.app`
  Update `CORSFilter` if you need additional origins.

## Common Scripts

From repository root:

- `npm run dev` - start frontend dev server
- `npm run build` - frontend production build
- `npm run lint` - run ESLint
- `npm run preview` - preview frontend build
- `npm run typecheck` - run TypeScript checks

From `backend/`:

- `mvn clean package` - build backend WAR

## Future Improvements (Suggested)

- Add backend automated tests (DAO + servlet integration tests)
- Add frontend unit/component tests
- Replace localStorage token strategy with stricter auth/session handling
- Add API rate limiting and stronger request validation
- Add CI pipeline for lint/build/test before deploy

---

