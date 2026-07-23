# Pwn-Chain Project Summary: Architecture & Features

This document provides a highly detailed overview of the entire **Pwn-Chain** codebase, consisting of two standalone projects in a single repository:

1. **`platform/`** — PWNDORA CTF Vulnerability Lab (React/JSX + FastAPI + MySQL)
2. **`InbaNaturals/`** — Deliberately vulnerable E-commerce application (React/TS + FastAPI + SQLite)

---

## 1. Platform (`platform/`)

The platform serves as the **CTF Vulnerability Lab Coordinator**. It manages user authentication, lab sessions, hints, stage-gate progression, and scoreboard/points validation.

```
platform/
├── backend/
│   ├── database.py       # DB connection (MySQL/PyMySQL)
│   ├── main.py           # FastAPI entrypoint, middleware, router registry
│   ├── models.py         # SQLAlchemy schemas (users, sessions, completions, logs)
│   ├── utils.py          # Security utilities (bcrypt password hashing, JWT signing)
│   ├── requirements.txt  # Python packages list
│   └── routes/           # REST endpoints
│       ├── auth.py       # Registration, login, profile editing
│       ├── hint.py       # Deducts points and serves progressive hints
│       ├── session.py    # Session lifecycle (start, progress, active check)
│       └── webhook.py    # HMAC-SHA256 verified CTF stage validation
└── frontend/
    ├── index.html        # SPA root HTML
    ├── package.json      # React dependencies and scripts
    ├── vite.config.js    # Bundler settings
    └── src/
        ├── main.jsx      # React DOM hydration
        ├── App.jsx       # App router and session authorization check
        ├── App.css       # Global styling rules
        ├── index.css     # CSS custom variables and styling definitions
        ├── components/   # Interactive background, buttons, cards
        ├── utils/
        │   └── api.js    # Axios setup with interceptors (Bearer token attachment)
        └── pages/        # Login, registration, dashboard, profile
```

### 1.1 Platform Backend

#### Config & Database (`platform/backend/database.py`)
- Loads environment variables using `python-dotenv`.
- Establishes a SQLAlchemy connection utilizing the standard `pymysql` driver.
- Formulates the connection string as: `mysql+pymysql://{db_user}:{encoded_password}@{db_host}/{db_name}` where password parameters are safely escaped with `urllib.parse.quote_plus`.
- Generates a threat-safe session generator `get_db()` with `SessionLocal`.

#### Models (`platform/backend/models.py`)
- **`User`**:
  - `id` (Integer primary key, auto-incremented)
  - `username` (String 50, unique index, non-nullable)
  - `email` (String 255, unique index, non-nullable)
  - `password_hash` (String 255, non-nullable)
  - `created_at` (DateTime, automatic default to database time)
- **`LabSession`**:
  - `id` (String 64, primary key, stores opaque token)
  - `user_id` (Integer ForeignKey to `users.id`)
  - `mode` (Enum: `story` or `realtime`)
  - `max_unlocked_stage` (Integer, defaults to `1`, tracks active step)
  - `total_points` (Integer, defaults to `0`)
  - `hints_used_stage1` to `hints_used_stage4` (Integer counters for hints requested)
  - `started_at` (DateTime, defaults to current timestamp)
  - `completed_at` (DateTime, nullable, populated upon finishing)
- **`StageCompletion`**:
  - `id` (Integer primary key, auto-incremented)
  - `session_id` (String 64 ForeignKey to `lab_sessions.id`)
  - `stage` (Integer stage number)
  - `points_awarded` (Integer)
  - `completed_at` (DateTime, defaults to current timestamp)
- **`WebhookLog`**:
  - `id` (Integer primary key, auto-incremented)
  - `session_id` (String 64, non-nullable)
  - `stage` (Integer stage number)
  - `payload` (JSON object of payload)
  - `verified` (Boolean)
  - `received_at` (DateTime, defaults to current timestamp)

#### Security & Auth Services (`platform/backend/utils.py` & `routes/auth.py`)
- Employs `bcrypt` for secure, salted password hashing and validation (`bcrypt.hashpw` / `bcrypt.checkpw`).
- Uses `python-jose` for JSON Web Token creation (`HS256`, 24-hour expiration) and token signature validation.
- Routes:
  - `POST /api/auth/register` — Validates unique usernames/emails, inserts the hashed credential, and registers the user.
  - `POST /api/auth/login` — Returns a Bearer JWT on correct credentials.
  - `GET /api/auth/me` — Fetches current authenticated user data.
  - `PUT /api/auth/profile/username` — Modifies username, issues a renewed JWT token with updated username claim.
  - `PUT /api/auth/profile/password` — Validates old password and hashes the new one.

#### Session Lifecycle (`platform/backend/routes/session.py`)
- `POST /api/session/start` — Starts a new lab instance. Creates a `LabSession` with a 32-byte hexadecimal random token (`secrets.token_hex(32)`), returning a direct connection link like `http://localhost:5174/?session={session_id}`.
- `GET /api/session/current` — Returns the current user's active, incomplete session details (used for real-time dashboard progress overlays).
- `GET /api/session/{session_id}/progress` — Fetches progression stats for a given session.

#### progressive Hint Engine (`platform/backend/routes/hint.py`)
- Implements a cost-based hint dispenser.
- Imposes constraints: Users can only query hints for their current, active stage. Max of 3 hints per stage.
- Deducts 10 points per request (`session.total_points -= 10`).
- Returns pre-set hint messages:
  - **Stage 1 (Auth Bypass):** Focuses on viewing HTML source codes, checking the endpoint `/api/v1/health` for hidden keys, and targeting legacy API version roots.
  - **Stage 2 (JWT Forge):** Points to guessable token signature keys, JWT payload structure modifications, and altering the username claim to hijack `admin` access.
  - **Stage 3 (SQL Injection):** Mentions checking text input query fields with quotes and executing union-based extractions.
  - **Stage 4 (RCE via Upload):** Highlights checking upload configurations, testing `.php` uploads, and finding where uploads are stored to trigger execution.

#### Webhook Validation (`platform/backend/routes/webhook.py`)
- `POST /api/webhook/stage-complete` — Stage completion validation endpoint.
- Verifies integrity via an **HMAC-SHA256 signature** sent through the `x-signature` header, hashed using a pre-shared secret `WEBHOOK_SECRET = "super-secret-webhook-key-12345"`.
- Prevents progression bypass by comparing the submitted payload stage against the DB session record (`payload.stage == session.max_unlocked_stage`).
- Enforces completion idempotency.
- Adds `100` points per stage, updates `max_unlocked_stage` in DB, and stamps `completed_at` when stage 4 is cleared.
- Inserts audit logs in `webhook_log` for both verified and unverified payloads.

### 1.2 Platform Frontend

- Implements a themed UI styled with modern CSS variables, cybernetic matrix/terminal glows, and a dark slate palette.
- **`ParticleBackground.jsx`**: Canvas-driven interactive particle effect.
- **`GlassCard.jsx` / `GlowingButton.jsx`**: Custom styled structural components.
- **`Dashboard.jsx`**: Performs polling against `/session/current` every 5 seconds to update point scorecards, and maps current stage unlocked status (`unlocked` vs `locked` vs `completed`) on a timeline. Features an active Hint box with cost deductions.

---

## 2. InbaNaturals E-Commerce (`InbaNaturals/`)

A functional, modern organic beauty shop designed to act as the targets for CTF operations. Built using TSX, Tailwind v4, and SQLite.

```
InbaNaturals/
├── backend/
│   ├── seed.py           # Populates SQlite with products and default accounts
│   ├── requirements.txt  # Python packages list
│   └── app/
│       ├── main.py       # FastAPI init, CORS configs, and startup hooks
│       ├── config.py     # Pydantic-settings config (reads .env variables)
│       ├── database.py   # SQLite connection generator
│       ├── models/       # Database schemas
│       │   ├── user.py
│       │   ├── product.py
│       │   ├── cart.py
│       │   ├── order.py
│       │   ├── review.py
│       │   └── wallet.py
│       ├── routers/      # Shop REST APIs
│       │   ├── auth.py
│       │   ├── products.py
│       │   ├── cart.py
│       │   ├── wallet.py
│       │   ├── orders.py
│       │   ├── reviews.py
│       │   └── admin.py
│       ├── schemas/      # Pydantic payloads for requests/responses
│       ├── services/
│       │   └── email.py  # Mock/Real verification email dispatcher
│       └── utils/
│           ├── security.py
│           └── dependencies.py
└── frontend/
    ├── package.json      # Vite, React 19, TypeScript 6, and Tailwind 4 config
    ├── tsconfig.json     # Compiler directives
    ├── vite.config.ts    # Build bundler configs
    └── src/
        ├── main.tsx
        ├── App.tsx       # Core navigation mapping
        ├── types.ts      # Shared interface definitions
        ├── config.ts     # Global URL constants
        ├── context/      # Context providers (AuthContext, CartContext)
        ├── data/         # Mock blogs
        ├── components/   # Primative components and layouts
        └── pages/        # E-commerce screens (auth, shop, cart, checkout, wallet, admin)
```

### 2.1 InbaNaturals Backend

#### Configuration & Core Hooks (`InbaNaturals/backend/app/config.py` & `main.py`)
- Employs `pydantic-settings` to bind a custom configuration class (`Settings`) to `.env` fields. Default settings define standard SQLite path (`sqlite:///./inbanaturals.db`), HS256 secret keys, file upload folders, and SMTP hosts.
- `on_startup` hook creates all database tables directly on app startup using SQLAlchemy's metadata bind.

#### Schemas & Pydantic Validation (`InbaNaturals/backend/app/schemas/`)
Separates inputs/outputs to prevent sensitive field exposures (like password hashes). Example classes:
- `RegisterRequest`, `LoginRequest`, `UserOut`, `TokenResponse`, `MessageResponse`
- `ProductCreate`, `ProductUpdate`, `ProductOut`, `ProductListOut`
- `CartItemCreate`, `CartItemUpdate`, `CartItemOut`, `CartOut`
- `CreateOrderRequest`, `OrderOut`, `OrderListOut`
- `AddFundsRequest`, `WalletOut`
- `ReviewCreate`, `ReviewApprove`, `ReviewOut`
- `DashboardStats`, `RoleUpdate`

#### Database Models (`InbaNaturals/backend/app/models/`)
- **`User`** (`user.py`): Tracks roles (`user` or `admin`), `wallet_balance` (stored as integer cents/rupees), and email verify status `is_verified`.
- **`Product`** (`product.py`): Features parameters like stock quantity tracking (`stock_quantity`), `sizes` (serialized JSON array string like `'["100ml", "200ml"]'`), categorization (`hair`, `face`, etc.), and feature toggles (`is_featured`).
- **`CartItem`** (`cart.py`): Maps `user_id`, `product_id`, product `size` index, and `quantity`.
- **`Order`** & **`OrderItem`** (`order.py`): Represents customer checkouts. Items are archived twice (once as a static JSON snapshot string inside the main `Order` row to guarantee record integrity, and once split out as individual relational `OrderItem` records).
- **`WalletTransaction`** (`wallet.py`): Tracks ledger transactions (`credit` or `debit`) with descriptions, amounts, and post-transaction balance states.
- **`Review`** (`review.py`): Stores user ratings (1-5), comments, and an admin verification flag `is_approved`.

#### Authentication Services (`InbaNaturals/backend/app/routers/auth.py` & `services/email.py`)
- Includes email verification logic.
- `POST /api/auth/register` — Creates unverified accounts, encodes a verification JWT with `purpose="email_verify"`, and triggers the mock email sender.
- `services/email.py` — If SMTP settings are missing, prints the activation link `http://localhost:5173/verify-email?token=<jwt>` to the terminal console. If SMTP is configured, dispatches an actual HTML email.
- `GET /api/auth/verify-email` — Decodes token and switches `User.is_verified` to `True`.
- `POST /api/auth/login` — Restricts access: returns a JWT token only if both username/password match and the email verification flag is `True`.

#### Shopping Operations APIs (`InbaNaturals/backend/app/routers/`)
- **`products.py`**: Supports dynamic lists. Handles categorization filters, text searches (matching product names and taglines via SQL `ILIKE`), sort filters (`price_asc`, `price_desc`, `name`, `newest`), and offset pagination.
- **`cart.py`**: Standard CRUD for user cart items. Synchronizes immediately with database rows. Resolves sizes from indexed arrays to readable labels (e.g. `size = 0` translates to `100ml`).
- **`wallet.py`**: Fetches transaction lists and balances. Supports adding mock balance amounts.
- **`orders.py`**: Evaluates orders at checkout. Confirms cart items, verifies wallet balance, adjusts user wallet totals, logs a debit ledger transaction, empties the cart, and returns the generated receipt details.

#### Admin Moderation Suite (`InbaNaturals/backend/app/routers/admin.py`)
Shielded by the `get_admin_user` dependency (verifies JWT role is `admin`).
- **Product Operations**: full CRUD (`/products` creation, update, and deletion).
- **Orders Manager**: lets admins query all system orders and adjust statuses (Confirmed, Shipped, Delivered, Cancelled).
- **Review Moderation**: allows admins to query, approve (changing `is_approved` to true), or delete reviews.
- **User Manager**: retrieves all accounts and lets admins edit user roles (`admin` or `user`).
- **Dashboard Stats**: calculates totals for users, products, orders, total revenue, and counts pending reviews.

#### Seeding Script (`InbaNaturals/backend/seed.py`)
- Employs SQLAlchemy to rebuild clean tables.
- Seeds an admin account: `admin` / `admin123` (already verified).
- Seeds a demo user account: `demo` / `demo123` (already verified, starts with ₹5000 wallet balance).
- Seeds four beauty products:
  1. *Abha Herbal Hair Oil* (Amla-infused cold-pressed hair oil, ₹499)
  2. *Clear Scalp Anti-Dandruff Hair Pack* (Fenugreek & Neem scalp mask, ₹399)
  3. *Vitamin C Glow Face Pack* (Brightening clay mask, ₹349)
  4. *Botanical Radiance Face Serum* (Niacinamide & Rosehip serum, ₹599)

### 2.2 InbaNaturals Frontend

#### Context Providers (`InbaNaturals/frontend/src/context/`)
- **`AuthContext.tsx`**: Loads token from `localStorage` on init, calls `/auth/me` to set user state. Provides `login()`, `register()`, and `logout()` functions.
- **`CartContext.tsx`**: Operates in two modes:
  - *Guest Mode (Unauthenticated)*: Saves cart items to React state.
  - *User Mode (Authenticated)*: Performs backend API synchronizations for add, update, delete, and clear actions.

#### UI Primitives (`InbaNaturals/frontend/src/components/ui/`)
- Reusable elements styled to match the organic brand:
  - **`Button.tsx`**: Standard button styled with Sage-Green, Ivory, and Terracotta colors. Shows a loading spinner and handles disable states.
  - **`Input.tsx`**: Form inputs with icon placements, custom labels, and validation errors.
  - **`Card.tsx`**: Simple content card containers.
  - **`Modal.tsx`**: Overlay modal that handles key focuses and body scroll locks.
  - **`Spinner.tsx` / `Badge.tsx`**: Status indicator tags and load indicators.
  - **`Toast.tsx`**: Context-based toast notification stack with 3-second timeouts.

#### E-Commerce Interface screens (`InbaNaturals/frontend/src/pages/`)
- **`HomePage.tsx`** & **`ShopPage.tsx`**: Displays featured slides, blog listings, categories, search inputs, and product listings.
- **`ProductDetailPage.tsx`**: Displays product image slides, details, interactive size grids, product review listings, and review creation forms.
- **`CartPage.tsx`**: Lists items, prices, and quantities.
- **`CheckoutPage.tsx`**: Handles billing details, validates wallet balances, and triggers order creation.
- **`OrdersPage.tsx` & `OrderDetailPage.tsx`**: User order histories and detailed receipt screens.
- **`WalletPage.tsx`**: Displays wallet balances with sage gradients and lists credit/debit transaction tables.
- **`VerifyEmailPage.tsx`**: Direct link landing page to check verification state.
- **`LoginPage.tsx` & `RegisterPage.tsx`**: Beautiful, brand-aligned login and sign-up interfaces.

#### Admin Interfaces (`InbaNaturals/frontend/src/pages/admin/`)
- **`AdminDashboard.tsx`**: Shows a dashboard grid with total users, products, orders, revenue, and pending reviews.
- **`AdminProducts.tsx`**: Core product editor with creation and edit modals.
- **`AdminOrders.tsx`**: Admin order tracker with dropdown status selectors.
- **`AdminReviews.tsx`**: Admin review moderation screen.
- **`AdminUsers.tsx`**: User role editor list.
