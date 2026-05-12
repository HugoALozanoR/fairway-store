# CLAUDE.md

## Project Overview

This project is called "Fairway Store".

It is a polished fullstack web app for an elegant online golf store. The goal is to build a clean, premium, modern ecommerce experience where users can browse golf products, filter products, view product details, add items to a cart, and complete a mock checkout.

The app also includes an admin area where products can be created, edited, deleted, organized, and reviewed through a simple dashboard.

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