import type { ProductSummary } from "../../types/catalog";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "../ui/Skeleton";

interface ProductGridProps {
  products?: ProductSummary[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-charcoal-100 bg-white">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-charcoal-200 bg-white/60 p-10 text-center">
        <p className="text-sm text-charcoal-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
