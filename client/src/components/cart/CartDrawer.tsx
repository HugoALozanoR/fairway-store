import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";
import {
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "../../stores/cartStore";
import { CartLineItem } from "./CartLineItem";
import { formatPrice } from "../../lib/format";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const close = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const location = useLocation();

  useEffect(() => {
    close();
  }, [location.pathname, close]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-charcoal-900/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-charcoal-100 bg-cream-50 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-charcoal-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-fairway-700" />
            <h2 className="font-display text-lg text-charcoal-900">
              Your cart
            </h2>
            <span className="text-xs text-charcoal-400">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full p-1.5 text-charcoal-500 transition hover:bg-charcoal-100/60 hover:text-fairway-700"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-10 w-10 text-charcoal-300" strokeWidth={1.4} />
              <p className="mt-4 font-display text-lg text-charcoal-800">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-charcoal-500">
                Browse the shop to find your next favorite club.
              </p>
              <Link
                to="/shop"
                onClick={close}
                className="mt-6 inline-flex rounded-md bg-fairway-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fairway-800"
              >
                Shop products
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-charcoal-100">
              {items.map((item) => (
                <li key={item.productId}>
                  <CartLineItem item={item} compact onNavigate={close} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t border-charcoal-100 bg-white px-5 py-4">
            <div className="flex items-center justify-between text-sm text-charcoal-600">
              <span>Subtotal</span>
              <span className="font-display text-lg text-fairway-700">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-charcoal-400">
              Shipping and totals calculated at checkout.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={close}
                className="inline-flex h-11 items-center justify-center rounded-md border border-charcoal-200 bg-white text-sm font-medium text-charcoal-700 transition hover:border-fairway-300 hover:text-fairway-700"
              >
                View cart
              </Link>
              <Link
                to="/checkout"
                onClick={close}
                className="inline-flex h-11 items-center justify-center rounded-md bg-fairway-700 text-sm font-medium text-white transition hover:bg-fairway-800"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
