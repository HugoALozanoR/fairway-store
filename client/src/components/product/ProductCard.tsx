import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/catalog";
import { formatPrice } from "../../lib/format";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-charcoal-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-fairway-200 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <ProductImage
          fileName={product.imageFileName}
          alt={product.name}
          className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
        />
        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-charcoal-800/90 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white">
            Sold out
          </span>
        )}
        {!outOfStock && lowStock && (
          <span className="absolute left-3 top-3 rounded-full bg-gold-500/95 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white">
            Low stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-charcoal-400">
          {product.categoryName}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium text-charcoal-800 transition group-hover:text-fairway-700">
          {product.name}
        </h3>
        <p className="mt-1 font-display text-lg text-fairway-700">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
