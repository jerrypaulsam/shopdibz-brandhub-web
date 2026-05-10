import ProductSummaryCard from "@/src/components/product/ProductSummaryCard";

/**
 * @param {{ groupId: number, products: any[], count: number, isLoading: boolean, message: string, page: number, hasNextPage: boolean, hasPreviousPage: boolean, onGoToPage: (page: number) => Promise<void> }} props
 */
export default function ProductGroupProductsPanel({
  groupId,
  products,
  count,
  isLoading,
  message,
  page,
  hasNextPage,
  hasPreviousPage,
  onGoToPage,
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-sm border border-white/10 bg-[#121212] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
          Product Workspace
        </p>
        <h1 className="mt-3 text-3xl font-black text-brand-white">Group Products</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
          Products assigned to group {groupId || "-"}, with direct access into detail, edit,
          image, and review routes.
        </p>
        <div className="mt-4 text-sm text-white/55">Total products {count}</div>
        {message ? <p className="mt-4 text-sm text-brand-gold">{message}</p> : null}
      </section>

      {isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
          Loading grouped products...
        </div>
      ) : products.length ? (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductSummaryCard key={product?.id || product?.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm border border-dashed border-white/15 bg-[#121212] p-12 text-center">
          <p className="text-lg font-black text-brand-white">No Products In This Group</p>
        </div>
      )}

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-white/10 bg-[#121212] p-4">
        <button
          className="rounded-sm border border-white/10 px-4 py-2 text-sm font-semibold text-brand-white disabled:opacity-40"
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onGoToPage(Math.max(page - 1, 1))}
        >
          Previous
        </button>
        <p className="text-sm font-semibold text-white/55">Page {page}</p>
        <button
          className="rounded-sm border border-white/10 px-4 py-2 text-sm font-semibold text-brand-white disabled:opacity-40"
          type="button"
          disabled={!hasNextPage}
          onClick={() => onGoToPage(page + 1)}
        >
          Next
        </button>
      </section>
    </div>
  );
}
