import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { ProductGrid } from "../components/product/ProductGrid";

export function HomePage() {
  const { data: categories } = useCategories();
  const featured = useProducts({ pageSize: 8, sort: "newest" });

  return (
    <>
      <section className="border-b border-charcoal-100 bg-gradient-to-br from-cream-100 via-cream-50 to-fairway-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-fairway-700">
              Spring Collection
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-charcoal-900 sm:text-5xl">
              Equipment with the
              <br />
              quiet confidence of the
              <br />
              <span className="text-fairway-700">fairway.</span>
            </h1>
            <p className="mt-5 max-w-md text-charcoal-600">
              Tour-grade clubs, soft-feel balls, and tailored apparel chosen for
              players who notice every detail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-md bg-fairway-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-fairway-800"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop/clubs"
                className="inline-flex items-center gap-2 rounded-md border border-charcoal-200 bg-white px-5 py-2.5 text-sm font-medium text-charcoal-700 transition hover:border-fairway-500 hover:text-fairway-700"
              >
                Browse clubs
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-fairway-700 to-fairway-900 shadow-[0_30px_60px_-20px_rgba(28,54,33,0.45)]">
              <div className="flex h-full items-center justify-center text-center">
                <div className="px-10 text-cream-100">
                  <p className="font-display text-3xl leading-snug">
                    “The game rewards
                    <br />
                    those who prepare.”
                  </p>
                  <p className="mt-6 text-xs uppercase tracking-[0.3em] text-cream-200/70">
                    — Fairway Studio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-charcoal-400">
              Browse
            </p>
            <h2 className="font-display text-2xl text-charcoal-900 sm:text-3xl">
              Shop by category
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories?.map((c) => (
            <Link
              key={c.id}
              to={`/shop/${c.slug}`}
              className="group rounded-lg border border-charcoal-100 bg-white px-5 py-6 text-center shadow-card transition hover:-translate-y-0.5 hover:border-fairway-200"
            >
              <p className="font-display text-lg text-charcoal-900 group-hover:text-fairway-700">
                {c.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-charcoal-400">
                Shop now
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-charcoal-400">
              Curated
            </p>
            <h2 className="font-display text-2xl text-charcoal-900 sm:text-3xl">
              New this season
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-sm text-fairway-700 hover:underline sm:inline-flex sm:items-center sm:gap-1"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProductGrid
          products={featured.data?.items}
          isLoading={featured.isLoading}
          skeletonCount={8}
        />
      </section>
    </>
  );
}
