import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, User as UserIcon } from "lucide-react";
import { selectCartCount, useCartStore } from "../../stores/cartStore";
import { useAuth } from "../../hooks/useAuth";

export function Navbar() {
  const count = useCartStore(selectCartCount);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

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

        <div className="flex items-center gap-1">
          <div className="relative" ref={menuRef}>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-charcoal-600 transition hover:bg-charcoal-100/60 hover:text-fairway-700"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user?.fullName.split(" ")[0] ?? "Account"}
                  </span>
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-12 w-48 overflow-hidden rounded-md border border-charcoal-100 bg-white shadow-lg"
                  >
                    <Link
                      to="/account"
                      role="menuitem"
                      className="block px-4 py-2.5 text-sm text-charcoal-700 hover:bg-cream-100"
                    >
                      My account
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-charcoal-700 hover:bg-cream-100"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      role="menuitem"
                      className="block w-full border-t border-charcoal-100 px-4 py-2.5 text-left text-sm text-charcoal-700 hover:bg-cream-100"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-charcoal-600 transition hover:bg-charcoal-100/60 hover:text-fairway-700"
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={openDrawer}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal-600 transition hover:bg-charcoal-100/60 hover:text-fairway-700"
            aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-fairway-700 px-1 text-[10px] font-semibold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
