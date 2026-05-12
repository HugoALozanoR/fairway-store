import { Link, useLocation, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useOrder } from "../hooks/useOrder";
import { ProductImage } from "../components/product/ProductImage";
import { Skeleton } from "../components/ui/Skeleton";
import { formatPrice } from "../lib/format";
import type { Order } from "../types/order";

export function CheckoutSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const id = orderId ? Number(orderId) : undefined;
  const location = useLocation();
  const preloaded = (location.state as { order?: Order } | null)?.order;

  const { data, isLoading, isError } = useOrder(
    preloaded ? undefined : id
  );
  const order = preloaded ?? data;

  if (!preloaded && isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />
        <Skeleton className="mx-auto mt-6 h-8 w-2/3" />
        <Skeleton className="mx-auto mt-3 h-4 w-1/2" />
        <Skeleton className="mt-10 h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-charcoal-900">
          Order not found
        </h1>
        <p className="mt-3 text-charcoal-500">
          We couldn’t locate that order. If you just placed it, try refreshing.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-md bg-fairway-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fairway-800"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-fairway-50 text-fairway-700">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-charcoal-900 sm:text-4xl">
          Thank you, {order.customerName.split(" ")[0]}!
        </h1>
        <p className="mt-3 text-charcoal-500">
          Your order{" "}
          <span className="font-medium text-charcoal-800">
            #{order.id.toString().padStart(6, "0")}
          </span>{" "}
          has been placed. A confirmation will be sent to{" "}
          <span className="font-medium text-charcoal-800">{order.email}</span>.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-lg border border-charcoal-100 bg-white shadow-card">
        <div className="border-b border-charcoal-100 px-6 py-4">
          <h2 className="font-display text-lg text-charcoal-900">
            Order summary
          </h2>
        </div>

        <ul className="divide-y divide-charcoal-100 px-6">
          {order.items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-4">
              <Link
                to={`/product/${item.productSlug}`}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-charcoal-100 bg-cream-100"
              >
                <ProductImage
                  fileName={item.imageFileName}
                  alt={item.productName}
                  className="h-full w-full"
                />
              </Link>
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="text-sm font-medium text-charcoal-800 hover:text-fairway-700"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-xs text-charcoal-500">
                    Qty {item.quantity} · {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-medium text-charcoal-800">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 border-t border-charcoal-100 px-6 py-5 text-sm">
          <div className="flex items-center justify-between text-charcoal-600">
            <dt>Shipping to</dt>
            <dd className="max-w-[60%] text-right text-charcoal-800">
              {order.shippingAddress}
            </dd>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-charcoal-100 pt-3 text-base font-medium text-charcoal-900">
            <dt>Total paid</dt>
            <dd className="font-display text-xl text-fairway-700">
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/shop"
          className="inline-flex rounded-md bg-fairway-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-fairway-800"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
