import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/product/ProductGrid";
import { FilterSidebar } from "../components/shop/FilterSidebar";
import { SortDropdown } from "../components/shop/SortDropdown";
import { Pagination } from "../components/ui/Pagination";
import { Breadcrumbs } from "../components/ui/Breadcrumbs";
import type { ProductSort } from "../types/catalog";

const PAGE_SIZE = 12;

function parseSort(value: string | null): ProductSort {
  if (value === "price_asc" || value === "price_desc" || value === "name_asc") {
    return value;
  }
  return "newest";
}

function parseNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function ShopPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: categories } = useCategories();

  const activeCategory = useMemo(
    () => categories?.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );

  const sort = parseSort(searchParams.get("sort"));
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const minPrice = parseNumber(searchParams.get("minPrice"));
  const maxPrice = parseNumber(searchParams.get("maxPrice"));

  const productsQuery = useProducts({
    category: categorySlug,
    sort,
    page,
    pageSize: PAGE_SIZE,
    minPrice,
    maxPrice,
  });

  const updateParams = (
    updates: Record<string, string | number | undefined>,
    { resetPage = false }: { resetPage?: boolean } = {}
  ) => {
    const next = new URLSearchParams(searchParams);
    if (resetPage) next.delete("page");
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "" || value === null) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }
    setSearchParams(next, { replace: false });
  };

  const handlePriceChange = ({ min, max }: { min?: number; max?: number }) => {
    updateParams({ minPrice: min, maxPrice: max }, { resetPage: true });
  };

  const handleClearFilters = () => {
    navigate("/shop");
  };

  const handleSortChange = (value: ProductSort) => {
    updateParams({ sort: value === "newest" ? undefined : value }, { resetPage: true });
  };

  const handlePageChange = (next: number) => {
    updateParams({ page: next === 1 ? undefined : next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const heading = activeCategory ? activeCategory.name : "All products";
  const total = productsQuery.data?.total ?? 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/shop" },
          ...(activeCategory ? [{ label: activeCategory.name }] : []),
        ]}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 sm:text-4xl">
            {heading}
          </h1>
          {!productsQuery.isLoading && (
            <p className="mt-1 text-sm text-charcoal-500">
              {total} {total === 1 ? "product" : "products"}
            </p>
          )}
        </div>
        <SortDropdown value={sort} onChange={handleSortChange} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <FilterSidebar
          categories={categories}
          activeCategorySlug={categorySlug}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceChange={handlePriceChange}
          onClear={handleClearFilters}
        />

        <div>
          {productsQuery.isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Could not load products. Please try again.
            </div>
          ) : (
            <>
              <ProductGrid
                products={productsQuery.data?.items}
                isLoading={productsQuery.isLoading}
                skeletonCount={PAGE_SIZE}
                emptyMessage="No products match these filters."
              />
              {productsQuery.data && (
                <Pagination
                  page={productsQuery.data.page}
                  pageSize={productsQuery.data.pageSize}
                  total={productsQuery.data.total}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
