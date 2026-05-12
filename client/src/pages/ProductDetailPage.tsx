import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useProduct } from "../hooks/useProduct";
import { ProductImage } from "../components/product/ProductImage";
import { Breadcrumbs } from "../components/ui/Breadcrumbs";
import { Skeleton } from "../components/ui/Skeleton";
import { formatPrice } from "../lib/format";
import { useCartStore } from "../stores/cartStore";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const cartItems = useCartStore((s) => s.items);

  const cartQty = product
    ? cartItems.find((i) => i.productId === product.id)?.quantity ?? 0
    : 0;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-charcoal-900">
          Product not found
        </h1>
        <p className="mt-3 text-charcoal-500">
          The product you’re looking for may have been removed or is unavailable.
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

  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const remaining = Math.max(0, product.stock - cartQty);
  const max = Math.max(1, remaining);
  const reachedLimit = !outOfStock && remaining <= 0;

  const handleAdd = () => {
    if (outOfStock || reachedLimit) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageFileName: product.imageFileName,
        stock: product.stock,
      },
      Math.min(quantity, remaining)
    );
    setJustAdded(true);
    openDrawer();
    setQuantity(1);
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          { label: product.categoryName, to: `/shop/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-charcoal-100 bg-white shadow-card">
          <ProductImage
            fileName={product.imageFileName}
            alt={product.name}
            className="aspect-square w-full"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-[0.25em] text-charcoal-400">
            {product.categoryName}
          </p>
          <h1 className="mt-2 font-display text-3xl text-charcoal-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 font-display text-2xl text-fairway-700">
            {formatPrice(product.price)}
          </p>

          <div className="mt-4">
            {outOfStock ? (
              <span className="inline-flex rounded-full bg-charcoal-800/90 px-3 py-1 text-xs uppercase tracking-wider text-white">
                Sold out
              </span>
            ) : lowStock ? (
              <span className="inline-flex rounded-full bg-gold-500/95 px-3 py-1 text-xs uppercase tracking-wider text-white">
                Only {product.stock} left
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-fairway-50 px-3 py-1 text-xs uppercase tracking-wider text-fairway-700">
                In stock
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-charcoal-600">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-md border border-charcoal-200 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={outOfStock || reachedLimit || quantity <= 1}
                className="flex h-11 w-11 items-center justify-center text-charcoal-600 disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium text-charcoal-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(max, q + 1))}
                disabled={outOfStock || reachedLimit || quantity >= max}
                className="flex h-11 w-11 items-center justify-center text-charcoal-600 disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={outOfStock || reachedLimit}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-fairway-700 px-6 text-sm font-medium text-white transition hover:bg-fairway-800 disabled:cursor-not-allowed disabled:bg-charcoal-300"
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  {reachedLimit ? "Max in cart" : "Add to cart"}
                </>
              )}
            </button>
          </div>

          {cartQty > 0 && !reachedLimit && (
            <p className="mt-3 text-xs text-charcoal-500">
              Already in your cart: {cartQty}
            </p>
          )}
          {reachedLimit && !outOfStock && (
            <p className="mt-3 text-xs text-charcoal-500">
              You have all available stock in your cart.
            </p>
          )}

          <p className="mt-6 text-xs text-charcoal-400">
            Free shipping on orders over $150 · 30-day returns
          </p>
        </div>
      </div>
    </div>
  );
}
