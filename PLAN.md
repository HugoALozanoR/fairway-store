# Golf Tienda — Project Plan

## Context

Build a polished MVP for an elegant online golf store. The site must feel premium, modern, and clean. Customers can browse, filter, view, cart, and check out (mock). Admins can manage products and see a basic dashboard.

## Stack

- **Frontend:** React (Vite) + TypeScript + Tailwind CSS + shadcn/ui + React Router + TanStack Query + Zustand (cart)
- **Backend:** ASP.NET Core 8 Web API + Entity Framework Core + JWT auth + BCrypt
- **Database:** PostgreSQL (via EF Core / Npgsql)
- **Images:** Local `/public/products/` folder in the frontend (filename stored in DB)
- **Auth:** Role-based JWT (`User`, `Admin`)
- **Payments:** Mock checkout (no real processing)

## Folder Layout

```
golf_tienda/
├── client/         # React + Vite frontend
│   └── public/products/   # static product images
├── server/         # ASP.NET Core Web API
│   ├── Api/        # controllers, DTOs, middleware
│   ├── Domain/     # entities
│   ├── Infrastructure/  # EF DbContext, migrations
│   └── Application/     # services, auth
└── PLAN.md
```

---

## Phase 1 — Project Setup & Foundations

**Goal:** Get both projects scaffolded, talking to each other, and connected to Postgres.

**Tasks**
- `npm create vite@latest client -- --template react-ts`
- Install Tailwind, shadcn/ui, React Router, TanStack Query, Zustand, Axios
- `dotnet new webapi -n GolfTienda.Api` inside `server/`
- Add EF Core + Npgsql + BCrypt.Net packages
- Configure CORS in API to allow `http://localhost:5173`
- `appsettings.Development.json` with Postgres connection string
- Create `AppDbContext` and run a first migration (empty)
- Hit `/api/health` from React to confirm wiring

**Acceptance**
- Both apps start with one command each (`npm run dev`, `dotnet run`)
- React fetches `/api/health` and renders "OK"
- A Postgres database `golf_tienda` exists and migrations apply cleanly

---

## Phase 2 — Data Model & Backend API Foundation

**Goal:** Define the domain and expose read-only product endpoints.

**Entities**
- `Category` — `Id`, `Name`, `Slug` (Clubs, Balls, Gloves, Bags, Shoes, Apparel, Accessories)
- `Product` — `Id`, `Name`, `Slug`, `Description`, `Price`, `Stock`, `ImageFileName`, `CategoryId`, `IsActive`, `CreatedAt`
- `User` — `Id`, `Email`, `PasswordHash`, `FullName`, `Role` (`User` | `Admin`), `CreatedAt`
- `Order` — `Id`, `UserId?` (nullable for guests), `CustomerName`, `Email`, `ShippingAddress`, `Total`, `Status` (`Pending`, `Paid`, `Shipped`), `CreatedAt`
- `OrderItem` — `Id`, `OrderId`, `ProductId`, `UnitPrice`, `Quantity`

**Tasks**
- Define entities + EF configurations
- Initial migration + seed (~20 sample products, 7 categories, 1 admin user)
- `GET /api/categories`
- `GET /api/products` (supports `?category=`, `?minPrice=`, `?maxPrice=`, `?search=`, `?sort=`, `?page=`)
- `GET /api/products/{slug}`
- Pagination response wrapper: `{ items, total, page, pageSize }`

**Acceptance**
- Swagger lists product/category endpoints
- Filtering, sorting, and pagination return correct results
- Seeded data appears when hitting the API

---

## Phase 3 — Public Storefront (Browse + Detail)

**Goal:** Customer-facing product discovery, with a premium feel.

**Pages / Routes**
- `/` — Home: hero, featured products, category tiles
- `/shop` — Product listing with filter sidebar + sorted grid
- `/shop/:categorySlug` — Same listing, prefiltered
- `/product/:slug` — Product detail page

**Components**
- `Navbar` (logo, nav links, cart icon w/ count, account menu)
- `Footer`
- `ProductCard` (image, name, price, hover state)
- `ProductGrid`
- `FilterSidebar` (category checkboxes, price range, clear filters)
- `SortDropdown` (newest, price asc/desc)
- `Pagination`
- `Breadcrumbs`
- `Skeleton` loaders

**Tasks**
- Set up routing + layouts
- Build design system tokens (greens/cream/charcoal, refined typography — e.g., Playfair Display + Inter)
- Wire TanStack Query hooks: `useProducts`, `useProduct`, `useCategories`
- Implement URL-synced filters (query params)
- Empty / loading / error states

**Acceptance**
- Visiting `/shop` shows all products with working filters and sort
- `/product/:slug` shows full details, large image, "Add to cart"
- Responsive on mobile, tablet, desktop
- Lighthouse: no obvious accessibility errors, contrast passes

---

## Phase 4 — Cart & Mock Checkout

**Goal:** Customers can add to cart, review it, and "place" an order.

**Pages**
- `/cart` — Cart review with line items, qty controls, totals
- `/checkout` — Address + contact form, order summary
- `/checkout/success/:orderId` — Confirmation page

**Components**
- `CartDrawer` (slide-out from navbar)
- `CartLineItem`
- `OrderSummary`
- `CheckoutForm` (react-hook-form + Zod)

**Backend**
- `POST /api/orders` — accepts cart items + shipping info, validates stock, decrements stock, creates `Order` + `OrderItems`, returns order
- `GET /api/orders/{id}` — fetch single order (owner or admin)

**Tasks**
- Zustand store for cart, persisted to `localStorage`
- Validation: prevent zero-qty, prevent over-stock
- Mock payment: form just collects address; submission creates order with status `Pending` → immediately set to `Paid`
- Success page shows order number + items

**Acceptance**
- Adding/removing items updates badge and totals correctly
- Submitting checkout creates a real DB order and reduces stock
- Refreshing the page preserves the cart
- Cannot check out with empty cart or out-of-stock items

---

## Phase 5 — Authentication (Customer + Admin)

**Goal:** Role-based auth so admins can be gated and customers can have accounts.

**Pages**
- `/login`
- `/register`
- `/account` — profile + order history (customer)

**Backend**
- `POST /api/auth/register` — creates `User` with role `User`
- `POST /api/auth/login` — returns JWT (15 min) + refresh token (7 day) in httpOnly cookie
- `GET /api/auth/me`
- `[Authorize(Roles="Admin")]` attribute on admin endpoints
- Seed one admin: `admin@golftienda.com` / `Admin123!`

**Frontend**
- Auth context + `useAuth` hook
- `ProtectedRoute` and `AdminRoute` wrappers
- Attach JWT via Axios interceptor
- Auto-refresh on 401

**Acceptance**
- Customer can register, log in, and see their own orders at `/account`
- Admin login redirects to `/admin`
- Non-admin hitting `/admin/*` is redirected to `/login`
- Logout clears tokens

---

## Phase 6 — Admin Product Management

**Goal:** Admins can create, edit, delete, and organize products.

**Pages**
- `/admin` — layout shell with sidebar
- `/admin/products` — table with search, filter, pagination
- `/admin/products/new`
- `/admin/products/:id/edit`
- `/admin/categories` — simple CRUD

**Components**
- `AdminLayout` (sidebar: Dashboard, Products, Categories, Orders)
- `DataTable` (sortable columns, row actions)
- `ProductForm` (name, slug, description, price, stock, category, image filename dropdown, active toggle)
- `ConfirmDialog` (for deletes)
- `Toast` notifications

**Backend**
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}` (soft delete via `IsActive=false`)
- `GET/POST/PUT/DELETE /api/admin/categories`
- All under `[Authorize(Roles="Admin")]`

**Image handling**
- Images live in `client/public/products/`. Admin form has a text input or dropdown of existing filenames (e.g., `driver-titleist.jpg`). No upload UI for MVP.

**Acceptance**
- Admin can create a product and see it on `/shop` immediately
- Editing updates fields without breaking existing orders
- Deleting (soft) hides the product from storefront but preserves order history
- Form validation catches negative prices, missing required fields

---

## Phase 7 — Admin Dashboard & Order View

**Goal:** Give admins at-a-glance operational info and order management.

**Pages**
- `/admin` (dashboard home)
- `/admin/orders` — table of orders
- `/admin/orders/:id` — order detail

**Dashboard widgets**
- Total active products
- Total orders (all-time + last 7 days)
- Estimated sales (sum of `Order.Total` where status ≠ `Cancelled`)
- Low-stock list (products with `Stock <= 5`)
- Recent orders (last 5)

**Backend**
- `GET /api/admin/dashboard` — returns one aggregated payload
- `GET /api/admin/orders` (paginated, filter by status)
- `PUT /api/admin/orders/{id}/status`

**Components**
- `StatCard`
- `LowStockTable`
- `RecentOrdersTable`
- `OrderStatusBadge`

**Acceptance**
- Dashboard loads in one request and shows accurate counts
- Updating order status (Pending → Shipped) persists and reflects in customer's `/account`
- Low-stock list updates after a checkout reduces stock

---

## Phase 8 — Polish, Hardening & Handoff

**Goal:** Make it feel finished.

**Tasks**
- Global error boundary + 404 page
- Loading skeletons on all data-fetching views
- Empty states with helpful copy
- SEO: per-page `<title>`, meta description, OpenGraph defaults
- Favicon + brand assets
- Smooth transitions (Framer Motion on cart drawer, page fades)
- A11y pass: keyboard nav, focus rings, alt text, aria-labels
- Mobile QA on real device sizes
- README in `client/` and `server/` with run instructions
- `.env.example` files for both projects
- Basic backend tests: auth, order creation, stock decrement (xUnit)

**Acceptance**
- No console errors on any route
- All forms have validation feedback
- Site is fully usable on a 375px-wide viewport
- A fresh clone can be run end-to-end following the READMEs

---

## Out of Scope (MVP)

- Real payments / Stripe
- Email notifications
- Product reviews & ratings
- Wishlist / favorites
- Multi-image galleries per product
- Inventory variants (size/color)
- Shipping calculation
- Coupons / discount codes
- Image upload UI for admin
- Internationalization

These are good "Phase 9+" candidates once the MVP is validated.
