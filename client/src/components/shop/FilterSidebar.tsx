import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../types/catalog";

interface FilterSidebarProps {
  categories: Category[] | undefined;
  activeCategorySlug?: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onPriceChange: (range: { min?: number; max?: number }) => void;
  onClear: () => void;
}

export function FilterSidebar({
  categories,
  activeCategorySlug,
  minPrice,
  maxPrice,
  onPriceChange,
  onClear,
}: FilterSidebarProps) {
  const [minInput, setMinInput] = useState(minPrice?.toString() ?? "");
  const [maxInput, setMaxInput] = useState(maxPrice?.toString() ?? "");

  useEffect(() => {
    setMinInput(minPrice?.toString() ?? "");
    setMaxInput(maxPrice?.toString() ?? "");
  }, [minPrice, maxPrice]);

  const applyPrice = () => {
    const min = minInput.trim() === "" ? undefined : Number(minInput);
    const max = maxInput.trim() === "" ? undefined : Number(maxInput);
    onPriceChange({
      min: Number.isFinite(min) ? min : undefined,
      max: Number.isFinite(max) ? max : undefined,
    });
  };

  const hasFilters =
    !!activeCategorySlug || minPrice !== undefined || maxPrice !== undefined;

  return (
    <aside className="w-full lg:w-60">
      <div className="space-y-8 rounded-lg border border-charcoal-100 bg-white p-5 shadow-card">
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-500">
            Category
          </h3>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link
                to="/shop"
                className={`block rounded px-2 py-1 transition ${
                  !activeCategorySlug
                    ? "bg-fairway-50 font-medium text-fairway-700"
                    : "text-charcoal-600 hover:bg-cream-100 hover:text-fairway-700"
                }`}
              >
                All categories
              </Link>
            </li>
            {categories?.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/shop/${c.slug}`}
                  className={`block rounded px-2 py-1 transition ${
                    activeCategorySlug === c.slug
                      ? "bg-fairway-50 font-medium text-fairway-700"
                      : "text-charcoal-600 hover:bg-cream-100 hover:text-fairway-700"
                  }`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-500">
            Price
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Min"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                className="w-full rounded-md border border-charcoal-200 bg-white px-2 py-1.5 text-sm focus:border-fairway-500 focus:outline-none focus:ring-1 focus:ring-fairway-500"
              />
              <span className="text-charcoal-300">–</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="Max"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                className="w-full rounded-md border border-charcoal-200 bg-white px-2 py-1.5 text-sm focus:border-fairway-500 focus:outline-none focus:ring-1 focus:ring-fairway-500"
              />
            </div>
            <button
              type="button"
              onClick={applyPrice}
              className="w-full rounded-md bg-fairway-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-fairway-800"
            >
              Apply
            </button>
          </div>
        </section>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="w-full rounded-md border border-charcoal-200 px-3 py-1.5 text-xs uppercase tracking-wider text-charcoal-600 transition hover:border-fairway-500 hover:text-fairway-700"
          >
            Clear all filters
          </button>
        )}
      </div>
    </aside>
  );
}
