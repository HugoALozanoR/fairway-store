import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "../stores/cartStore";
import {
  CheckoutForm,
  type CheckoutFormValues,
} from "../components/checkout/CheckoutForm";
import { OrderSummary } from "../components/cart/OrderSummary";
import { Breadcrumbs } from "../components/ui/Breadcrumbs";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { formatPrice } from "../lib/format";

export function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore((s) => s.clear);
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [serverError, setServerError] = useState<string | null>(null);

  if (count === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmit = async (values: CheckoutFormValues) => {
    setServerError(null);
    try {
      const order = await createOrder.mutateAsync({
        ...values,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });
      clearCart();
      navigate(`/checkout/success/${order.id}`, {
        replace: true,
        state: { order },
      });
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "We couldn’t place your order. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="mt-6 font-display text-3xl text-charcoal-900 sm:text-4xl">
        Checkout
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <CheckoutForm
          onSubmit={handleSubmit}
          submitting={createOrder.isPending}
          serverError={serverError}
        />

        <div className="space-y-4">
          <div className="rounded-lg border border-charcoal-100 bg-white p-5 shadow-card">
            <h3 className="font-display text-lg text-charcoal-900">
              In your order
            </h3>
            <ul className="mt-3 divide-y divide-charcoal-100">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-charcoal-800">{item.name}</p>
                    <p className="text-xs text-charcoal-400">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-charcoal-700">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <OrderSummary subtotal={subtotal} />

          <Link
            to="/cart"
            className="block text-center text-sm text-charcoal-500 hover:text-fairway-700"
          >
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
