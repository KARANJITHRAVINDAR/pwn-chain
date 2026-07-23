# Pwn-Chain

Two standalone projects in one repo:

## `platform/` — PWNDORA CTF Vulnerability Lab (React+JSX+FastAPI+MySQL)
- **Backend:** `cd platform/backend` → `uvicorn main:app --reload --port 8000`
- **Frontend:** `cd platform/frontend` → `npm run dev`
- **Startup:** `start.bat` (Windows) / `start.sh` (Linux) launch both
- **DB:** MySQL `mysql+pymysql://root:toor@localhost/pwnchain`
- **Auth:** JWT + bcrypt via python-jose, passlib
- **Tech:** React 19, Vite 8, JSX (not TypeScript), react-router-dom v6, oxlint
- **Routes:** `/login`, `/register`, `/dashboard`, `/profile`

## `InbaNaturals/` — E-commerce Site (React+TS+FastAPI+SQLite)
- **Backend:** `cd InbaNaturals/backend` → `uvicorn app.main:app --reload --port 8000`
- **Frontend:** `cd InbaNaturals/frontend` → `npm run dev`
- **Seed DB:** `cd InbaNaturals/backend && python seed.py` (creates admin/admin123, demo/demo123)
- **DB:** defaults to SQLite `./inbanaturals.db`. Override via `DATABASE_URL` in `InbaNaturals/.env`
- **Config:** `app/config.py` reads from `../.env` via pydantic-settings
- **API base:** `http://localhost:8000/api`
- **Frontend:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4, react-router-dom v7
- **Tailwind v4:** uses `@import "tailwindcss"` + `@theme` directive in `src/index.css` (no `tailwind.config`)
- **TypeScript:** `verbatimModuleSyntax: true` — use `import type` for type-only imports
- **Lint:** `npm run lint` (oxlint)
- **Typecheck:** `tsc -b` (or `npm run build` which runs `tsc -b && vite build`)
- **No test framework** configured (empty stubs only)

## Git
- `InbaNaturals/` was previously a submodule — now tracked normally. If it appears empty on remote, run `git rm --cached InbaNaturals && git add InbaNaturals/`
