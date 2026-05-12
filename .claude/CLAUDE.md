# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This project is called "Fairway Store".

It is a polished fullstack web app for an elegant online golf store. The goal is to build a clean, premium, modern ecommerce experience where users can browse golf products, filter products, view product details, add items to a cart, and complete a mock checkout.

The app also includes an admin area where products can be created, edited, deleted, organized, and reviewed through a simple dashboard.

The canonical phased roadmap lives in [PLAN.md](../PLAN.md). Always identify the current phase there before starting a feature.

## Run & Build

This is a two-process app — frontend and backend run independently.

### Backend (`server/`, ASP.NET Core, `net10.0`, EF Core + SQLite)

```bash
cd server
dotnet restore
dotnet run --launch-profile http      # http://localhost:5080
dotnet build                          # compile only
```

- `Program.cs` calls `DataSeeder.SeedAsync` on startup, which runs `db.Database.MigrateAsync()` and then idempotently seeds categories, ~20 products, and one admin user (`admin@golftienda.com` / `Admin123!`). No manual `dotnet ef database update` needed for normal dev — just `dotnet run`.
- To add a schema change: `dotnet ef migrations add <Name>` from `server/`, then restart the API.
- The SQLite file (`server/golf_tienda.db`) is created on first run. Delete it to reseed from scratch.
- No test project exists yet (Phase 8 will add xUnit tests for auth, order creation, stock decrement).

### Frontend (`client/`, Vite + React 19 + TypeScript)

```bash
cd client
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint       # ESLint
npm run preview    # serve the built bundle
```

- Backend URL comes from `VITE_API_URL` (default `http://localhost:5080`); see `client/.env.example`.
- No test runner is wired up.

### Local dev loop

Run the API (`dotnet run`) and the Vite dev server (`npm run dev`) in separate terminals. The API's CORS policy (`AllowFrontend` in `Program.cs`) whitelists `http://localhost:5173` only — if you change the frontend port, update that list.

## Architecture

### Backend (`server/`)

Four-folder layered layout under one `GolfTienda.Api` project:

- `Domain/` — POCO entities (`Category`, `Product`, `User`, `Order`, `OrderItem`). Status strings live as constants on `OrderStatus`.
- `Infrastructure/` — `AppDbContext` (Fluent API config for all entities and indexes) and `DataSeeder` (idempotent migrate + seed).
- `Application/` — `Dtos/` request/response shapes; `Common/PagedResult.cs` is the standard `{ items, total, page, pageSize }` wrapper for paginated lists.
- `Controllers/` — thin REST controllers under `[Route("api/[controller]")]`. There is no service layer; controllers project EF queries directly into DTOs.

Notable invariants:

- **Order creation is transactional.** `OrdersController.Create` opens an EF transaction, consolidates duplicate `productId`s in the request, validates each product is `IsActive` and has enough stock, decrements stock, and computes the total from **DB-side** prices (never trusting client-supplied prices). Mock checkout sets status to `Paid` immediately.
- **Slugs are unique.** Both `Category.Slug` and `Product.Slug` have unique indexes; the public storefront fetches products by slug, not id.
- Public read endpoints: `GET /api/health`, `/api/categories`, `/api/products?category=&minPrice=&maxPrice=&search=&sort=&page=&pageSize=`, `/api/products/{slug}`. Customer write endpoints: `POST /api/orders` (anonymous allowed; if `Authorization: Bearer` is present, `Order.UserId` is captured from the JWT). `GET /api/orders/{id}` is owner-or-admin when the order has a `UserId`, otherwise public (so guest success pages still work). `GET /api/orders/me` requires auth.
- **Auth.** JWT bearer access tokens (15 min, signed HS256 with `Jwt:Key` from config) plus a 7-day refresh token stored as a row in `RefreshTokens` and mirrored to an `httpOnly` cookie scoped to `/api/auth` named `fairway_refresh`. `AuthController` exposes `register`, `login`, `refresh`, `logout`, and `[Authorize] me`. Refresh tokens are single-use — `refresh` revokes the presented token and issues a new one.
- CORS is configured with `AllowCredentials()` so the refresh cookie flows; the frontend Axios client must keep `withCredentials: true`.
- Seeded admin: `admin@golftienda.com` / `Admin123!`. Admin endpoints + dashboard land in Phases 6–7.

### Frontend (`client/src/`)

- `pages/` — one component per route; routes are declared in `App.tsx` under a single `Layout` route that mounts `Navbar`, `<Outlet/>`, `Footer`, and `CartDrawer`.
- `components/{layout,product,shop,cart,checkout,ui}/` — small composable pieces grouped by feature area.
- `hooks/` — TanStack Query hooks (`useProducts`, `useProduct`, `useCategories`, `useOrder`) plus the `useCreateOrder` mutation. Each hook wraps a single endpoint and owns its query key.
- `stores/cartStore.ts` — Zustand store. **Only `items` is persisted to `localStorage`** (key: `fairway-cart`); drawer open/close state is in-memory and resets per session. The store caps quantities to `stock`, drops adds on out-of-stock items, and exposes the `selectCartCount` / `selectCartSubtotal` selectors used by the navbar badge and summaries.
- `stores/authStore.ts` — Zustand store persisting `accessToken` + `user` to `localStorage` (key: `fairway-auth`). The refresh token is **not** stored here — it lives in the httpOnly cookie. The Axios client in `lib/api.ts` attaches `Authorization: Bearer` from this store on every request and, on `401`, calls `/api/auth/refresh` exactly once (deduped via an in-flight promise) before retrying the original request; on refresh failure the store is cleared. Don't add a second refresh path — use this one.
- `components/auth/ProtectedRoute.tsx` requires any authenticated user; `AdminRoute.tsx` requires `role === "Admin"`. Both stash the attempted path in `location.state.from` and `/login` honors it on success.
- `lib/` — `api.ts` (Axios instance reading `VITE_API_URL`), `queryClient.ts` (shared React Query client), `format.ts` (currency formatter — always use this for prices).
- `types/catalog.ts` and `types/order.ts` mirror the backend DTOs. Keep them in sync when changing the API.

### Styling

- Tailwind tokens are defined in `client/tailwind.config.js`: color palettes `fairway` (greens), `cream`, `charcoal`, `gold`; fonts `font-display` (Playfair Display) for headings and `font-sans` (Inter) for body. **Use these tokens instead of raw hex values** to preserve the visual identity.
- The shared box-shadow utility is `shadow-card`.

### Product images

- Files live in `client/public/products/<filename>` and are referenced by `Product.ImageFileName` in the DB (filename only, no path).
- The shared `ProductImage` component renders the gradient placeholder fallback if the file is missing or fails to load — prefer it over raw `<img>` so the fallback is consistent.
- Phase 6 admin product creation uses a filename input/dropdown; there is no upload UI by design.

### Frontend ↔ Backend contract

Both sides share the paginated list shape (`{ items, total, page, pageSize }`), the product summary/detail shapes, and the order shapes. When adding fields, change the C# DTO in `server/Application/Dtos/` and the TypeScript type in `client/src/types/` together.

## Product Style

The site should feel:

- Premium
- Elegant
- Modern
- Clean
- Professional
- Easy to use

The visual identity should use refined golf-inspired colors like deep green, cream, charcoal, white, and subtle gold accents.

## Main Features

### Public Store

- Home page
- Product catalog
- Category filtering
- Price filtering
- Product detail page
- Shopping cart
- Mock checkout
- Checkout success page

### Admin Area

- Admin dashboard
- Product management
- Create product
- Edit product
- Delete product
- View recent orders
- View low-stock products

## Current Priority

Build the MVP in phases.

Do not overcomplicate the project. Prioritize a polished working version over adding too many features.

The most important flows are:

1. User can browse products.
2. User can view a product.
3. User can add products to cart.
4. User can complete a mock checkout.
5. Admin can manage products.
6. Admin can see a simple dashboard.

## Scope Control

Avoid adding these features unless explicitly requested:

- Real payments
- Stripe
- Email notifications
- Product reviews
- Wishlist
- Multi-image product galleries
- Shipping calculation
- Coupons
- Internationalization
- Image upload UI

## Development Rules

Before implementing a feature:

1. Read PLAN.md.
2. Identify the current phase.
3. Create a short implementation checklist.
4. Work only on the selected phase.
5. Keep the implementation simple and maintainable.

While coding:

1. Use clear file names.
2. Keep components small.
3. Avoid duplicated logic.
4. Use TypeScript properly.
5. Keep the UI responsive.
6. Add useful loading and empty states.
7. Do not add unnecessary abstractions.

After coding:

1. Review the changed files.
2. Check for errors.
3. Make sure the feature works from the user perspective.
4. Summarize what changed.
5. Mention any remaining issues.

## Quality Expectations

The app should be clean enough to demo.

Every completed phase should have:

- Working UI
- Responsive layout
- No obvious console errors
- Clear user flow
- Basic validation where needed
- Simple and readable code

## Git Commit Style

Use small and clear commits.

Examples:

- feat: add project setup
- feat: add product catalog
- feat: add cart flow
- feat: add mock checkout
- feat: add admin product management
- fix: resolve product filter issue
- refactor: simplify product card component