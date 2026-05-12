import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Breadcrumbs } from "../components/ui/Breadcrumbs";
import { Skeleton } from "../components/ui/Skeleton";
import { ProductImage } from "../components/product/ProductImage";
import { useAuth } from "../hooks/useAuth";
import { useMyOrders } from "../hooks/useMyOrders";
import { formatPrice } from "../lib/format";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: orders, isLoading, isError } = useMyOrders(isAuthenticated);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Account" },
        ]}
      />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 sm:text-4xl">
            Hello, {user?.fullName.split(" ")[0] ?? "there"}
          </h1>
          <p className="mt-2 text-sm text-charcoal-500">
            Signed in as{" "}
            <span className="text-charcoal-800">{user?.email}</span>
            {user?.role === "Admin" && (
              <span className="ml-2 inline-flex rounded-full bg-fairway-50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-fairway-700">
                Admin
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex h-10 items-center rounded-md border border-charcoal-200 px-4 text-sm font-medium text-charcoal-700 transition hover:border-fairway-300 hover:text-fairway-700"
        >
          Log out
        </button>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-charcoal-900">
          Order history
        </h2>

        {isLoading ? (
          <div className="mt-6 space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ) : isError ? (
          <p className="mt-6 text-sm text-red-600">
            We couldn’t load your orders. Please try again later.
          </p>
        ) : !orders || orders.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-charcoal-200 bg-white py-14 text-center">
            <Package
              className="h-10 w-10 text-charcoal-300"
              strokeWidth={1.4}
            />
            <p className="mt-4 font-display text-lg text-charcoal-800">
              No orders yet
            </p>
            <p className="mt-1 text-sm text-charcoal-500">
              Once you place an order, it’ll show up here.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-md bg-fairway-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fairway-800"
            >
              Shop products
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-5">
            {orders.map((order) => (
              <li
                key={order.id}
                className="overflow-hidden rounded-lg border border-charcoal-100 bg-white shadow-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal-100 px-5 py-3">
                  <div className="text-sm">
                    <p className="font-medium text-charcoal-800">
                      Order #{order.id.toString().padStart(6, "0")}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      Placed {dateFormatter.format(new Date(order.createdAt))}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex rounded-full bg-fairway-50 px-3 py-1 text-xs uppercase tracking-wider text-fairway-700">
                      {order.status}
                    </span>
                    <p className="font-display text-lg text-fairway-700">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
                <ul className="divide-y divide-charcoal-100 px-5">
                  {order.items.map((item) => (
                    <li
                      key={`${order.id}-${item.productId}`}
                      className="flex gap-4 py-3"
                    >
                      <Link
                        to={`/product/${item.productSlug}`}
                        className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-charcoal-100 bg-cream-100"
                      >
                        <ProductImage
                          fileName={item.imageFileName}
                          alt={item.productName}
                          className="h-full w-full"
                        />
                      </Link>
                      <div className="flex flex-1 items-start justify-between gap-3 text-sm">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.productSlug}`}
                            className="block truncate text-charcoal-800 hover:text-fairway-700"
                          >
                            {item.productName}
                          </Link>
                          <p className="mt-0.5 text-xs text-charcoal-500">
                            Qty {item.quantity} · {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                        <p className="font-medium text-charcoal-700">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
