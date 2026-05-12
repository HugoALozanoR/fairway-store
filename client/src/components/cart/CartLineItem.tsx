import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../../types/cart";
import { ProductImage } from "../product/ProductImage";
import { formatPrice } from "../../lib/format";
import { useCartStore } from "../../stores/cartStore";

interface CartLineItemProps {
  item: CartItem;
  compact?: boolean;
  onNavigate?: () => void;
}

export function CartLineItem({ item, compact = false, onNavigate }: CartLineItemProps) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const max = Math.max(1, item.stock);
  const atMax = item.quantity >= max;

  return (
    <div className="flex gap-4 py-4">
      <Link
        to={`/product/${item.slug}`}
        onClick={onNavigate}
        className={`shrink-0 overflow-hidden rounded-md border border-charcoal-100 bg-cream-100 ${
          compact ? "h-20 w-20" : "h-24 w-24"
        }`}
      >
        <ProductImage
          fileName={item.imageFileName}
          alt={item.name}
          className="h-full w-full"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/product/${item.slug}`}
            onClick={onNavigate}
            className="text-sm font-medium text-charcoal-800 hover:text-fairway-700"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="rounded p-1 text-charcoal-400 transition hover:text-fairway-700"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-charcoal-500">
          {formatPrice(item.price)} each
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded-md border border-charcoal-200 bg-white">
            <button
              type="button"
              onClick={() => setQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-charcoal-600 disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-charcoal-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(item.productId, item.quantity + 1)}
              disabled={atMax}
              className="flex h-8 w-8 items-center justify-center text-charcoal-600 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="font-display text-base text-fairway-700">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
        {atMax && (
          <p className="mt-1 text-[11px] text-charcoal-400">
            Stock limit reached
          </p>
        )}
      </div>
    </div>
  );
}
