# InbaNaturals — Full Project Blueprint

## What We're Building

A production-grade e-commerce web app (React + FastAPI) for a natural beauty brand. Later extended with CTF vulnerabilities.

---

## What's Dynamic (Needs Backend)

| Feature | Description |
|---------|-------------|
| **Products** | Admin CRUD, stock tracking, categories |
| **User Auth** | Register, email verification (SMTP), login, JWT |
| **Cart** | Server-persisted per user (not in-memory) |
| **Orders** | Checkout, wallet deduction, order history |
| **Wallet** | Fake funds (add money, spend on orders) |
| **Reviews** | Users submit reviews on product pages |
| **Admin** | Dashboard stats, manage products/orders/users |

## What Stays Static (No Backend)

Blog, FAQ, About, Contact form, Footer/Navbar, Policy pages, Combos page, Testimonials page

---

## Database Tables

```
users          — id, username, email, password_hash, full_name, role, wallet_balance, is_verified
products       — id, name, slug, tagline, description, price, original_price, category, sizes,
                 ingredients, how_to_use, image_url, in_stock, stock_quantity
cart_items     — id, user_id, product_id, size, quantity
orders         — id, order_number, user_id, items(JSON), subtotal, discount, total, status
order_items    — id, order_id, product_id, product_name, size, quantity, unit_price
wallet_txns    — id, user_id, amount, type(credit/debit), description, balance_after
reviews        — id, product_id, user_id, rating, comment, is_approved
email_tokens   — id, user_id, token, expires_at, used
```

## API Endpoints

### Public
- `GET /api/products` — List (?category=&search=&sort=)
- `GET /api/products/{slug}` — Single product
- `GET /api/products/{slug}/reviews` — Product reviews

### Auth
- `POST /api/auth/register` — Register (sends verification email)
- `POST /api/auth/verify-email` — Verify (?token=)
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Current user

### Authenticated
- `GET/POST /api/cart` — Read, add items
- `PUT/DELETE /api/cart/{id}` — Update qty, remove item
- `POST /api/orders/checkout` — Place order
- `GET /api/orders` — My orders
- `GET /api/orders/{id}` — Order detail
- `GET /api/wallet` — Balance + transactions
- `POST /api/wallet/add-funds` — Add fake money
- `POST /api/products/{slug}/reviews` — Submit review

### Admin
- `GET /api/admin/dashboard` — Stats
- Full CRUD: `/api/admin/products`
- List + status update: `/api/admin/orders`
- List: `/api/admin/users`
- Approve/delete: `/api/admin/reviews`

---

## Backend Structure

```
backend/app/
├── main.py              # FastAPI app + CORS
├── config.py            # Env-based settings
├── database.py          # SQLAlchemy engine
├── models/              # SQLAlchemy models (one file per entity)
├── schemas/             # Pydantic request/response
├── routers/             # API routes
├── services/            # Business logic (email, wallet, stats)
└── utils/               # JWT, password hashing, dependencies
```

## Frontend Structure

```
src/
├── api/client.ts        # Axios + interceptors
├── context/
│   ├── AuthContext.tsx   # User, token, login/logout/register
│   └── CartContext.tsx   # Cart (synced with backend)
├── components/ui/       # Reusable: Button, Input, Card, Modal, Badge, Spinner, Toast
├── components/layout/   # Navbar, Footer, ProtectedRoute, AdminRoute, AdminSidebar
└── pages/
    ├── HomePage, ShopPage, ProductDetailPage (modify)
    ├── auth/LoginPage, RegisterPage (new)
    ├── CartPage, CheckoutPage, OrdersPage, WalletPage (new)
    └── admin/Dashboard, Products, Orders, Users (new)
```

## Build Order

```
Phase 1: Backend
  Step 1 — Config, database, security utils, dependencies
  Step 2 — User model + Auth API (register, verify, login, /me)
  Step 3 — Product model + Product API (list, detail, admin CRUD)
  Step 4 — Cart model + Cart API
  Step 5 — Order + Wallet models + Checkout + Add-funds APIs
  Step 6 — Review model + Review API
  Step 7 — Admin stats endpoint

Phase 2: Frontend
  Step 8  — UI component library (Button, Input, Card, Modal, etc.)
  Step 9  — API client + AuthContext + Login/Register pages
  Step 10 — Replace static product data with API calls
  Step 11 — Cart page + CartContext synced with backend
  Step 12 — Wallet page + Add funds form
  Step 13 — Checkout flow + Orders page
  Step 14 — Review submission on product page
  Step 15 — Admin dashboard pages

Phase 3: Polish
  Step 16 — Dockerfile + docker-compose
  Step 17 — End-to-end verification
```
