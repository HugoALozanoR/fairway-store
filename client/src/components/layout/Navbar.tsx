import { Link, NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-charcoal-100/70 bg-cream-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl text-fairway-700">Fairway</span>
          <span className="text-xs uppercase tracking-[0.25em] text-charcoal-400">
            Store
          </span>
        </Link>

        <nav className="hidden gap-8 text-sm font-medium text-charcoal-600 sm:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "text-fairway-700" : "hover:text-fairway-700"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              isActive ? "text-fairway-700" : "hover:text-fairway-700"
            }
          >
            Shop
          </NavLink>
        </nav>

        <Link
          to="/cart"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal-600 transition hover:bg-charcoal-100/60 hover:text-fairway-700"
          aria-label="Cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {/* Cart badge wired in Phase 4 */}
        </Link>
      </div>
    </header>
  );
}
