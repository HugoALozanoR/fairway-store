import { formatPrice } from "../../lib/format";

interface OrderSummaryProps {
  subtotal: number;
  shipping?: number;
}

const FREE_SHIPPING_THRESHOLD = 150;

export function OrderSummary({ subtotal, shipping }: OrderSummaryProps) {
  const computedShipping =
    shipping ?? (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12);
  const total = subtotal + computedShipping;

  return (
    <div className="rounded-lg border border-charcoal-100 bg-white p-5 shadow-card">
      <h3 className="font-display text-lg text-charcoal-900">Order summary</h3>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between text-charcoal-600">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between text-charcoal-600">
          <dt>Shipping</dt>
          <dd>
            {computedShipping === 0 ? (
              <span className="text-fairway-700">Free</span>
            ) : (
              formatPrice(computedShipping)
            )}
          </dd>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-charcoal-100 pt-3 text-base font-medium text-charcoal-900">
          <dt>Total</dt>
          <dd className="font-display text-xl text-fairway-700">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>
      {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="mt-3 text-xs text-charcoal-400">
          Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free
          shipping.
        </p>
      )}
    </div>
  );
}
