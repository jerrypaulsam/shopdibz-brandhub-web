import Link from "next/link";
import ProductSummaryCard from "./ProductSummaryCard";

/**
 * @param {{
 * query: string,
 * label: string,
 * sort: string,
 * page: number,
 * products: any[],
 * isLoading: boolean,
 * message: string,
 * hasNextPage: boolean,
 * hasPreviousPage: boolean,
 * onUpdateRoute: (patch: Record<string, string>) => Promise<void>,
 * }} props
 */
export default function ProductSearchResultsPanel({
  query,
  label,
  sort,
  page,
  products,
  isLoading,
  message,
  hasNextPage,
  hasPreviousPage,
  onUpdateRoute,
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-sm border border-white/10 bg-[#121212] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Search Results
            </p>
            <h1 className="mt-3 text-3xl font-black text-brand-white">{label || query || "Search"}</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              href={{
                pathname: "/search-title",
                query: {
                  query,
                },
              }}
            >
              Refine Query
            </Link>
            <label className="rounded-sm border border-white/10 bg-black/20 px-4">
              <select
                className="min-h-11 bg-transparent text-sm text-brand-white outline-none"
                value={sort}
                onChange={(event) =>
                  onUpdateRoute({
                    sort: event.target.value,
                    page: "1",
                    label,
                  })
                }
              >
                <option value="relevance">Relevance</option>
                <option value="latest">Latest</option>
                <option value="price-high">Price High</option>
                <option value="price-low">Price Low</option>
                <option value="best-rated">Best Rated</option>
              </select>
            </label>
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-brand-gold">{message}</p> : null}
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/45">
            Loading search results...
          </div>
        ) : products.length ? (
          products.map((product) => (
            <ProductSummaryCard product={product} key={product?.slug || product?.id} />
          ))
        ) : (
          <div className="rounded-sm border border-dashed border-white/15 bg-[#121212] p-12 text-center">
            <p className="text-lg font-black text-brand-white">No Matches Found</p>
            <p className="mt-2 text-sm text-white/45">
              Try a broader keyword or switch back to title suggestions.
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-white/10 bg-[#121212] p-4">
        <button
          className="rounded-sm border border-white/10 px-4 py-2 text-sm font-semibold text-brand-white disabled:opacity-40"
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onUpdateRoute({ page: String(Math.max(page - 1, 1)) })}
        >
          Previous
        </button>
        <p className="text-sm font-semibold text-white/55">Page {page}</p>
        <button
          className="rounded-sm border border-white/10 px-4 py-2 text-sm font-semibold text-brand-white disabled:opacity-40"
          type="button"
          disabled={!hasNextPage}
          onClick={() => onUpdateRoute({ page: String(page + 1) })}
        >
          Next
        </button>
      </section>
    </div>
  );
}
