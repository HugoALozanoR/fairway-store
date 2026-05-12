import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import {
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "../stores/cartStore";
import { CartLineItem } from "../components/cart/CartLineItem";
import { OrderSummary } from "../components/cart/OrderSummary";
import { Breadcrumbs } from "../components/ui/Breadcrumbs";

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Cart" },
        ]}
      />

      <div className="mt-6 flex items-baseline justify-between">
        <h1 className="font-display text-3xl text-charcoal-900 sm:text-4xl">
          Your cart
        </h1>
        {count > 0 && (
          <p className="text-sm text-charcoal-500">
            {count} {count === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-lg border border-dashed border-charcoal-200 bg-white py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-charcoal-300" strokeWidth={1.4} />
          <p className="mt-4 font-display text-lg text-charcoal-800">
            Your cart is empty
          </p>
          <p className="mt-1 text-sm text-charcoal-500">
            Add a few clubs, balls, or accessories to get started.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-md bg-fairway-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-fairway-800"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-charcoal-100 rounded-lg border border-charcoal-100 bg-white px-5 shadow-card">
            {items.map((item) => (
              <li key={item.productId}>
                <CartLineItem item={item} />
              </li>
            ))}
          </ul>

          <div className="space-y-4">
            <OrderSummary subtotal={subtotal} />
            <Link
              to="/checkout"
              className="inline-flex h-12 w-full items-center justify-center rounded-md bg-fairway-700 text-sm font-medium text-white transition hover:bg-fairway-800"
            >
              Proceed to checkout
            </Link>
            <Link
              to="/shop"
              className="block text-center text-sm text-charcoal-500 hover:text-fairway-700"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
