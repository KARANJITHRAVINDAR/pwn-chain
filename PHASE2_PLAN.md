# Phase 2 — Frontend Rebuild: Detailed Plan

## Overview

Connect the InbaNaturals frontend to the fully-built backend API. All pages currently use static mock data — replace with live API calls and add missing auth/cart/wallet/checkout/admin flows.

**Backend API base:** `http://localhost:8000/api`  
**Auth:** JWT Bearer token via `Authorization: Bearer <token>` header  
**Config:** `InbaNaturals/.env` — `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`

---

## Step 8 — UI Component Library

Build reusable UI primitives under `src/components/ui/` to avoid repeated markup across pages.

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/ui/Button.tsx` | Reusable button |
| `src/components/ui/Input.tsx` | Form input with label + error |
| `src/components/ui/Card.tsx` | Generic card container |
| `src/components/ui/Modal.tsx` | Overlay modal with backdrop |
| `src/components/ui/Spinner.tsx` | Loading spinner |
| `src/components/ui/Toast.tsx` | Toast notification system |
| `src/components/ui/Badge.tsx` | Status badge with color map |
| `src/components/layout/ProtectedRoute.tsx` | Auth guard — redirects to `/login` |
| `src/components/layout/AdminRoute.tsx` | Admin guard — redirects to `/` |
| `src/components/layout/AdminSidebar.tsx` | Admin nav sidebar |

### Component Details

#### `Button.tsx`
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  children: ReactNode;
  className?: string;
}
```
- `primary`: bg-sage text-white
- `secondary`: border border-sage text-sage hover:bg-sage hover:text-white
- `ghost`: no bg/border, hover:bg-ivory-dark
- `danger`: bg-terracotta text-white
- When `loading` is true, show Spinner inside and disable click

#### `Input.tsx`
```tsx
interface InputProps {
  label?: string;
  error?: string;
  icon?: ReactNode;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}
```
- Renders label above input if provided
- Shows error text in red below if provided
- Icon rendered inside input (left padding adjusted)

#### `Card.tsx`
```tsx
interface CardProps {
  title?: string;
  padding?: boolean;
  hover?: boolean;
  className?: string;
  children: ReactNode;
}
```
- White bg, rounded-2xl, border, shadow-sm
- Optional title with border-bottom

#### `Modal.tsx`
```tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}
```
- Fixed overlay with dark backdrop (click to close)
- Panel slides in from right (`animate-slide-in`)
- Close button in header
- Trap focus inside modal when open

#### `Spinner.tsx`
- CSS-only spinner using Tailwind `border-*` + `animate-spin`
- Accepts `size?: 'sm' | 'md' | 'lg'`

#### `Toast.tsx`
- **Context-based** — wrap app in `<ToastProvider>`
- Hook: `useToast()` returns `{ showToast: (message, type) => void }`
- Type: `'success' | 'error' | 'info'`
- Auto-dismiss after 3s
- Renders as fixed bottom-right stack of toast notifications
- Animations via `animate-fade-in` + `animate-slide-in` (already defined in `index.css`)

#### `Badge.tsx`
```tsx
interface BadgeProps {
  status: string; // 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'pending'
}
```
- Color map:
  - confirmed → bg-sage/10 text-sage
  - shipped → bg-blue-100 text-blue-700
  - delivered → bg-green-100 text-green-700
  - cancelled → bg-red-100 text-red-700
  - pending → bg-yellow-100 text-yellow-700

#### `ProtectedRoute.tsx`
```tsx
// Wraps routes. Uses AuthContext.
// If not authenticated → <Navigate to="/login" replace />
// If loading → <Spinner />
// Else → <Outlet />
```

#### `AdminRoute.tsx`
```tsx
// Same as ProtectedRoute but also checks user.role === 'admin'
// If not admin → <Navigate to="/" replace />
```

#### `AdminSidebar.tsx`
- Fixed left sidebar (w-64) with links:
  - Dashboard (`/admin`)
  - Products (`/admin/products`)
  - Orders (`/admin/orders`)
  - Users (`/admin/users`)
  - Reviews (`/admin/reviews`)
- Active link highlighted with bg-sage/10 text-sage
- Logout button at bottom

---

## Step 9 — API Client + AuthContext + Login/Register

### Files to Create

| File | Purpose |
|------|---------|
| `src/api/client.ts` | Axios instance with interceptors |
| `src/types.ts` | Shared TypeScript interfaces for API responses |
| `src/context/AuthContext.tsx` | Auth state provider |
| `src/pages/auth/LoginPage.tsx` | Login form page |
| `src/pages/auth/RegisterPage.tsx` | Registration form page |

### `src/api/client.ts`
```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: on 401, clear token + redirect to /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

### `src/types.ts` — All API Response Types

```ts
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  wallet_balance: number;
  is_verified: boolean;
  created_at: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  sizes: string;        // JSON array string e.g. '["50ml","100ml"]'
  ingredients: string;
  how_to_use: string;
  image_url: string;
  in_stock: boolean;
  stock_quantity: number;
  is_featured: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string;
  in_stock: boolean;
  is_featured: boolean;
  created_at: string | null;
}

export interface CartItem {
  id: number;
  product_id: number;
  size: number;
  quantity: number;
  product_name: string;
  product_slug: string;
  product_price: number;
  product_original_price: number | null;
  product_image: string;
  product_category: string;
  size_label: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface OrderListItem {
  id: number;
  order_number: string;
  total: number;
  status: string;
  created_at: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  items: string;          // JSON string
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  notes: string;
  created_at: string | null;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  username: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string | null;
}

export interface WalletTransaction {
  id: number;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  balance_after: number;
  created_at: string | null;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  pending_reviews: number;
}
```

### `src/context/AuthContext.tsx`

```
State:
  user: User | null
  token: string | null
  isLoading: boolean

On mount:
  - Read token from localStorage
  - If token exists → GET /api/auth/me → set user
  - If fails → clear token, set user = null

Methods:
  login(username, password):
    POST /api/auth/login { username, password }
    → response: { access_token, token_type }
    → store token in localStorage
    → set token in state
    → GET /api/auth/me → set user
    → return success

  register(data: { username, email, password, full_name }):
    POST /api/auth/register { username, email, password, full_name }
    → response: User
    → auto-login with username/password

  logout():
    → clear localStorage token
    → set user = null, token = null
    → redirect to /

  loginAsGuest():   (optional — skip email verification)
    → navigate to /login

Exposes:
  <AuthProvider> wraps app
  useAuth() → { user, token, isLoading, login, register, logout }
```

### `src/pages/auth/LoginPage.tsx`
- Route: `/login`
- Design: Match InbaNaturals brand (ivory bg, sage accents) — NOT the terminal theme from platform
- Fields:
  - Username (required)
  - Password (required, type=password)
  - "Remember me" checkbox (optional, just UI)
- Buttons:
  - "Sign In" submit button (primary/sage, full width)
  - "Don't have an account? Register" link below
- On submit:
  - Call `login()` from AuthContext
  - Show Toast on error (invalid creds, unverified email)
  - On success: redirect to `/` or to the page they were trying to visit (stored in `location.state.from`)
- States: loading spinner on button while authenticating, disabled inputs

### `src/pages/auth/RegisterPage.tsx`
- Route: `/register`
- Fields:
  - Full Name (optional)
  - Username (required, min 3 chars)
  - Email (required, email format)
  - Password (required, min 6 chars)
  - Confirm Password (required, must match password)
- Validation (client-side):
  - Username min 3 characters
  - Password min 6 characters
  - Passwords match
  - Valid email format
- On submit:
  - Call `register()` from AuthContext
  - Show inline field errors for validation failures
  - Show Toast on API error (username/email already exists)
  - On success: auto-login and redirect to `/`
- "Already have an account? Sign In" link

### Modify: `src/App.tsx`
- Wrap everything in `<AuthProvider>` outside `<CartProvider>`
- Add routes:
  ```tsx
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  ```

### Modify: `src/components/Navbar.tsx`
- If user is authenticated:
  - Show user avatar circle (first letter of username) with dropdown:
    - My Orders → `/orders`
    - Wallet → `/wallet`
    - (if admin) Admin → `/admin`
    - Logout
  - Cart icon remains
- If not authenticated:
  - Show "Login" button (navigates to `/login`)
  - "Register" button (navigates to `/register`)
  - Cart icon remains

---

## Step 10 — Replace Static Product Data with API Calls

### API Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/products?category=&search=&sort=&page=&page_size=` | GET | List products with filters |
| `/api/products?featured=true` | GET | Featured products for homepage |
| `/api/products/slug/{slug}` | GET | Single product detail (by slug) |

### Modify: `src/pages/ShopPage.tsx`
- Remove: `import { products } from '../data/products'`
- Add state: `products: ProductListItem[]`, `loading: boolean`, `total: number`
- Add `useEffect` that fetches on mount + when filter/sort/search change:
  ```ts
  const fetchProducts = async () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filter !== 'all') params.category = filter;
    if (sort !== 'default') params.sort = sort.replace('-', '_');
    if (search) params.search = search;
    params.page = '1';
    params.page_size = '50';
    const res = await api.get('/products', { params });
    setProducts(res.data);
    setTotal(res.data.length);
    setLoading(false);
  };
  ```
- Show `<Spinner />` while loading
- Empty state unchanged
- **Price display change:** `product.price` is now a number (int), not a string like `"₹499"`. Format as: `₹{product.price.toLocaleString('en-IN')}`

### Modify: `src/pages/HomePage.tsx`
- Remove: `import { products } from '../data/products'`
- Add `useEffect` to fetch featured products:
  ```ts
  const [featuredProducts, setFeaturedProducts] = useState<ProductListItem[]>([]);
  useEffect(() => {
    api.get('/products', { params: { featured: 'true' } }).then(r => setFeaturedProducts(r.data));
  }, []);
  ```
- Replace `products.map(...)` with `featuredProducts.map(...)`
- Pass `featuredProducts` to ProductCard
- Keep placeholder hero section, testimonials, combos, FAQ, Instagram, newsletter (those stay static)

### Modify: `src/pages/ProductDetailPage.tsx`
- Remove: `import { products } from '../data/products'`
- Add state: `product: Product | null`, `loading: boolean`
- Add `useEffect`:
  ```ts
  useEffect(() => {
    api.get(`/products/slug/${id}`).then(r => setProduct(r.data)).catch(() => setProduct(null));
  }, [id]);
  ```
- **Product type migration:**
  - `product.price` → number, display as `₹{price}`
  - `product.originalPrice` → `product.original_price`
  - `product.image` → `product.image_url`
  - `product.sizes` → parse JSON string: `JSON.parse(product.sizes)`
  - `product.howToUse` → `product.how_to_use`
- **Related products:** Fetch from API with category filter or just show first 3 from all products
- Show `<Spinner />` while loading

### Modify: `src/components/ProductCard.tsx`
- Update `ProductCardProps` to use `ProductListItem` from types.ts
- Price: `₹{product.price.toLocaleString('en-IN')}` (was string)
- Original price: `product.original_price` (was `product.originalPrice`)
- Image: `product.image_url` (was `product.image`)
- Parse sizes for first size:
  ```ts
  const firstSize = (() => { try { return JSON.parse(product.sizes || '[]')[0] || 'Standard'; } catch { return 'Standard'; } })();
  ```
- Create internal `Product` interface instead of importing from `data/products.ts`:
  ```ts
  import type { ProductListItem } from '../types';
  ```

### Modify: `src/pages/CombosPage.tsx`
- This page stays largely static (combos are marketing constructs, not API entities)
- But update product thumbnail links/prices to use API where relevant
- Optional enhancement: fetch products for combo building

---

## Step 11 — Cart Page + CartContext Synced with Backend

### API Endpoints Used

| Endpoint | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/api/cart` | GET | Yes | — | `CartOut` |
| `/api/cart` | POST | Yes | `{product_id, size, quantity}` | `CartOut` |
| `/api/cart/{item_id}` | PUT | Yes | `{quantity}` | `CartOut` |
| `/api/cart/{item_id}` | DELETE | Yes | — | `CartOut` |

### Modify: `src/context/CartContext.tsx`

**Rewrite to support two modes: local (unauthenticated) + synced (authenticated)**

```ts
interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: number, size: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
}
```

**Behavior:**
- When user is NOT authenticated:
  - Store cart in local state (same as current behavior, but using new types)
  - No API calls
- When user IS authenticated:
  - On mount / login: `GET /api/cart` → populate state
  - `addToCart`: `POST /api/cart` → update state from response
  - `updateQuantity`: `PUT /api/cart/{id}` → update state from response
  - `removeFromCart`: `DELETE /api/cart/{id}` → update state from response
  - `clearCart`: remove all items via API sequentially, then clear local

**CartItem type in context (internal):**
```ts
interface CartItemDisplay {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  image: string;
  size_index: number;
  size_label: string;
  quantity: number;
}
```

**Key mapping from API response (`CartItemOut`) to display item:**
```ts
{
  id: item.id,
  product_id: item.product_id,
  name: item.product_name,
  slug: item.product_slug,
  price: item.product_price,
  original_price: item.product_original_price,
  image: item.product_image,
  size_index: item.size,
  size_label: item.size_label,
  quantity: item.quantity,
}
```

**Add to cart flow for unauthenticated users:**
- Currently `addToCart` accepts `{id, name, price, size, image}` — simplified local version
- Keep parity: store items locally with a temp ID, no API calls
- When user logs in, optionally merge local cart into API cart (can be a future enhancement — for now, just clear local and fetch from API)

### New Page: `src/pages/CartPage.tsx`
- Route: `/cart`
- If not authenticated: show message "Please login to use cart" with link to `/login`
- If authenticated + empty: "Your cart is empty" with link to `/shop`
- List of cart items:
  | Image | Product Name + Size | Quantity (+/-) | Price | Subtotal | Remove |
  |-------|--------------------|-----------------|-------|----------|--------|
- Quantity controls: decrement (min 1), increment. On change → `updateQuantity(id, newQty)`
- Remove button → `removeFromCart(id)` with confirmation
- Cart summary:
  - Subtotal: `₹{total}`
  - "Proceed to Checkout" button → `/checkout`
- Spinner overlay when loading

### Modify: `src/App.tsx`
- Add route: `<Route path="/cart" element={<CartPage />} />`

### Modify: `src/components/Navbar.tsx`
- Cart icon already links to nowhere (just a button). Change to `<Link to="/cart">` or `onClick` → navigate to `/cart`
- Cart count badge already works

---

## Step 12 — Wallet Page + Add Funds

### API Endpoints Used

| Endpoint | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/api/wallet` | GET | Yes | — | `{balance, transactions}` |
| `/api/wallet/add-funds` | POST | Yes | `{amount, description?}` | `{balance, transactions}` |

### New Page: `src/pages/WalletPage.tsx`
- Route: `/wallet` (protected — wrapped in `<ProtectedRoute>`)
- **Balance card:**
  - Large centered display: `₹{balance.toLocaleString('en-IN')}`
  - Background gradient (sage green)
  - "Available Balance" label
- **Add Funds form:**
  - Amount input (number, min 1)
  - Optional description input (placeholder: "e.g. Birthday money")
  - "Add Funds" button (primary/sage)
  - On submit: `POST /api/wallet/add-funds` → refresh balance + transactions
  - Show success Toast
- **Transaction History table:**
  - Columns: Date, Type (credit/debit badge), Amount, Description, Balance After
  - Credits in green (text-green-600), debits in red (text-red-600)
  - Empty state if no transactions
  - Sorted newest first (API already orders by created_at desc)
- Loading spinner while fetching

### Modify: `src/App.tsx`
- Add route: `<Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />`

---

## Step 13 — Checkout Flow + Orders Page

### API Endpoints Used

| Endpoint | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/api/orders` | POST | Yes | `{shipping_name, shipping_phone, shipping_address, notes?}` | `OrderOut` |
| `/api/orders` | GET | Yes | — | `[OrderListOut]` |
| `/api/orders/{id}` | GET | Yes | — | `OrderOut` |

### New Page: `src/pages/CheckoutPage.tsx`
- Route: `/checkout` (protected)
- **Cart Summary** (read-only):
  - List of items: name, size, quantity, unit price, subtotal
  - Total displayed at bottom
  - "Wallet Balance: ₹{balance}" displayed
- **Shipping Form:**
  - Full Name (required)
  - Phone (required)
  - Address (required, textarea)
  - Order Notes (optional, textarea)
- **Order Summary:**
  - Subtotal: ₹{cart.total}
  - Wallet Balance: ₹{balance}
  - Remaining after order: ₹{balance - cart.total}
  - If balance < total: show error "Insufficient wallet balance. Please add funds." with link to `/wallet`
- **Place Order button:**
  - Validate form fields
  - `POST /api/orders` with shipping info
  - On success: show success Toast with order number, clear cart, navigate to `/orders/{id}`
  - On error: show error Toast
- Loading state on submit (button shows spinner, disabled)

### New Page: `src/pages/OrdersPage.tsx`
- Route: `/orders` (protected)
- List of orders:
  - Card per order: order number, date, total (₹{total}), status badge
  - Click card → navigate to `/orders/{id}`
- Empty state: "No orders yet" with link to `/shop`
- Fetch on mount: `GET /api/orders`

### New Page: `src/pages/OrderDetailPage.tsx`
- Route: `/orders/:id` (protected)
- **Order Header:**
  - Order number (large)
  - Status badge (colored)
  - Date placed
- **Shipping Info:**
  - Name, phone, address
- **Items table:**
  | Product | Size | Qty | Unit Price | Subtotal |
  |---------|------|-----|------------|----------|
- **Totals:**
  - Subtotal, Discount, Total
- Back to orders link
- Loading spinner while fetching

### Modify: `src/App.tsx`
- Add routes:
  ```tsx
  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
  <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
  ```

---

## Step 14 — Review Submission via API

### API Endpoints Used

| Endpoint | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/api/products/{id}/reviews` | GET | No | — | `[ReviewOut]` |
| `/api/products/{id}/reviews` | POST | Yes | `{rating, comment}` | `ReviewOut` |

### Modify: `src/pages/ProductDetailPage.tsx`

**Replace hardcoded reviews with API data:**

```ts
// State
const [reviews, setReviews] = useState<Review[]>([]);
const [reviewsLoading, setReviewsLoading] = useState(true);

// Fetch on mount
useEffect(() => {
  if (!product) return;
  api.get(`/products/${product.id}/reviews`)
    .then(r => setReviews(r.data))
    .catch(() => {})
    .finally(() => setReviewsLoading(false));
}, [product]);
```

**Remove `defaultReviews` object** and related initial state.

**Update "Write a Review" form:**
- Remove `reviewerName` field entirely (backend uses `current_user.username`)
- Pre-fill from AuthContext: `const { user } = useAuth();`
- If not logged in, show "Please login to write a review" with link to `/login`
- Rating selector: use existing `StarRating` (`interactive`, `onRatingChange`)
- Comment textarea
- On submit:
  ```ts
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/products/${product!.id}/reviews`, {
        rating: reviewerRating,
        comment: reviewerComment,
      });
      setReviews(prev => [res.data, ...prev]);
      setReviewerRating(5);
      setReviewerComment('');
      showToast('Review submitted! Awaiting approval.', 'success');
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast('You have already reviewed this product.', 'error');
      } else {
        showToast('Failed to submit review.', 'error');
      }
    }
  };
  ```
- Note: submitted reviews with `is_approved: false` won't appear in GET until admin approves. Show them optimistically in the UI anyway.

---

## Step 15 — Admin Dashboard Pages

### API Endpoints Used

| Endpoint | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/api/admin/dashboard` | GET | Admin | — | `DashboardStats` |
| `/api/admin/products` | POST | Admin | `ProductCreate` | `ProductOut` |
| `/api/admin/products/{id}` | PUT | Admin | `ProductUpdate` | `ProductOut` |
| `/api/admin/products/{id}` | DELETE | Admin | — | 204 |
| `/api/admin/orders?status=` | GET | Admin | — | `[OrderOut]` |
| `/api/admin/orders/{id}/status?status=` | PUT | Admin | — | `OrderOut` |
| `/api/admin/users` | GET | Admin | — | `[UserOut]` |
| `/api/admin/users/{id}/role` | PUT | Admin | `{role}` | `UserOut` |
| `/api/admin/reviews?approved=` | GET | Admin | — | `[ReviewOut]` |
| `/api/admin/reviews/{id}/approve` | PUT | Admin | `{is_approved}` | `ReviewOut` |
| `/api/admin/reviews/{id}` | DELETE | Admin | — | 204 |

### Admin Layout
All admin pages share the admin sidebar + a top bar with page title. Wrap in:
```tsx
<div className="flex min-h-screen bg-ivory">
  <AdminSidebar />
  <main className="flex-1 p-8">
    {children}
  </main>
</div>
```

### New Page: `src/pages/admin/AdminDashboard.tsx`
- Route: `/admin`
- Fetch: `GET /api/admin/dashboard`
- Stats cards in a 5-column grid:
  - Total Users (icon: Users)
  - Total Products (icon: Package)
  - Total Orders (icon: ShoppingCart)
  - Total Revenue (icon: DollarSign, formatted as ₹)
  - Pending Reviews (icon: MessageSquare)
- Each card: bg-white, rounded-2xl, shadow-sm, icon + number + label

### New Page: `src/pages/admin/AdminProducts.tsx`
- Route: `/admin/products`
- **Table:**
  | ID | Image | Name | Category | Price | Stock | Featured | Actions |
  |----|-------|------|----------|-------|-------|----------|---------|
- **Actions per row:** Edit (icon), Delete (icon with confirm modal)
- **Add Product button:** Opens modal with form:
  - Name, Slug (auto-generate from name), Tagline, Description (textarea)
  - Price (number), Original Price (number)
  - Category (select: hair/face)
  - Sizes (comma-separated, convert to JSON)
  - Ingredients, How to Use (textarea)
  - Image URL, In Stock (checkbox), Stock Quantity, Is Featured (checkbox)
- **Edit:** Same modal, pre-filled
- **Delete:** Confirm modal → `DELETE /api/admin/products/{id}`
- Table refreshes after any mutation

### New Page: `src/pages/admin/AdminOrders.tsx`
- Route: `/admin/orders`
- Status filter pills: All | Confirmed | Shipped | Delivered | Cancelled
- **Table:**
  | Order # | Customer ID | Items | Total | Status | Date | Actions |
  |---------|-------------|-------|-------|--------|------|---------|
- **Actions:** Status dropdown to update: confirmed → shipped → delivered (or cancelled)
- Click row: expand/collapse to show items JSON parsed as mini table

### New Page: `src/pages/admin/AdminUsers.tsx`
- Route: `/admin/users`
- **Table:**
  | ID | Username | Email | Full Name | Role | Verified | Wallet | Joined |
  |----|----------|-------|-----------|------|----------|--------|--------|
- **Actions:** Toggle role (user ↔ admin) with confirmation modal
- Search bar to filter by username/email

### New Page: `src/pages/admin/AdminReviews.tsx`
- Route: `/admin/reviews`
- Filter pills: All | Pending (is_approved=false) | Approved (is_approved=true)
- **Table:**
  | ID | Product | User | Rating | Comment | Status | Date | Actions |
  |----|---------|------|--------|---------|--------|------|---------|
- **Actions per row:**
  - Approve (if pending): `PUT /api/admin/reviews/{id}/approve {is_approved: true}`
  - Reject/Unapprove (if approved): `PUT /api/admin/reviews/{id}/approve {is_approved: false}`
  - Delete: Confirm → `DELETE /api/admin/reviews/{id}`

### Modify: `src/App.tsx`
- Add admin routes wrapped in `<AdminRoute>`:
  ```tsx
  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
  <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
  <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />
  ```

---

## Full Route Table (final `App.tsx`)

| Route | Component | Auth | Admin |
|---|---|---|---|
| `/` | HomePage | — | — |
| `/shop` | ShopPage | — | — |
| `/product/:id` | ProductDetailPage | — | — |
| `/cart` | CartPage | — | — |
| `/checkout` | CheckoutPage | ✅ | — |
| `/orders` | OrdersPage | ✅ | — |
| `/orders/:id` | OrderDetailPage | ✅ | — |
| `/wallet` | WalletPage | ✅ | — |
| `/login` | LoginPage | — | — |
| `/register` | RegisterPage | — | — |
| `/about` | AboutPage | — | — |
| `/testimonials` | TestimonialsPage | — | — |
| `/contact` | ContactPage | — | — |
| `/combos` | CombosPage | — | — |
| `/faq` | FAQPage | — | — |
| `/blog` | BlogListingPage | — | — |
| `/blog/:id` | BlogPostDetailPage | — | — |
| `/shipping` | PolicyPage | — | — |
| `/returns` | PolicyPage | — | — |
| `/privacy` | PolicyPage | — | — |
| `/terms` | PolicyPage | — | — |
| `/admin` | AdminDashboard | ✅ | ✅ |
| `/admin/products` | AdminProducts | ✅ | ✅ |
| `/admin/orders` | AdminOrders | ✅ | ✅ |
| `/admin/users` | AdminUsers | ✅ | ✅ |
| `/admin/reviews` | AdminReviews | ✅ | ✅ |
| `*` | 404 page | — | — |

---

## File Summary

### New Files to Create (30 files)

```
src/api/client.ts
src/types.ts
src/context/AuthContext.tsx
src/context/ToastContext.tsx
src/components/ui/Button.tsx
src/components/ui/Input.tsx
src/components/ui/Card.tsx
src/components/ui/Modal.tsx
src/components/ui/Spinner.tsx
src/components/ui/Toast.tsx
src/components/ui/Badge.tsx
src/components/layout/ProtectedRoute.tsx
src/components/layout/AdminRoute.tsx
src/components/layout/AdminSidebar.tsx
src/pages/auth/LoginPage.tsx
src/pages/auth/RegisterPage.tsx
src/pages/CartPage.tsx
src/pages/CheckoutPage.tsx
src/pages/OrdersPage.tsx
src/pages/OrderDetailPage.tsx
src/pages/WalletPage.tsx
src/pages/admin/AdminDashboard.tsx
src/pages/admin/AdminProducts.tsx
src/pages/admin/AdminOrders.tsx
src/pages/admin/AdminUsers.tsx
src/pages/admin/AdminReviews.tsx
```

### Existing Files to Modify (12 files)

```
src/App.tsx                       — add providers and all new routes
src/index.css                     — add toast animation keyframes if missing
src/components/Navbar.tsx         — auth-aware nav with user dropdown
src/components/ProductCard.tsx    — use new ProductListItem type, format price as number
src/context/CartContext.tsx        — add API sync for authenticated users
src/pages/HomePage.tsx            — fetch featured products from API
src/pages/ShopPage.tsx            — fetch products from API with filter/sort/search
src/pages/ProductDetailPage.tsx   — fetch product from API, fetch/submit reviews via API
src/pages/CombosPage.tsx          — update price formatting to use numbers
src/data/products.ts              — (optional) keep as fallback or remove imports
src/config.ts                     — may need API base URL export
package.json                      — add "axios" dependency
```

---

## Installation

```bash
cd InbaNaturals/frontend
npm install axios
```
