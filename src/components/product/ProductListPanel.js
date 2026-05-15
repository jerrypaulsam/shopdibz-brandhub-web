import Link from "next/link";
import InfiniteScrollTrigger from "@/src/components/app/InfiniteScrollTrigger";
import ToastMessage from "@/src/components/app/ToastMessage";
import ProductSummaryCard from "./ProductSummaryCard";

const tabs = [
  ["pending", "Pending"],
  ["active", "Active"],
  ["top", "Top"],
  ["featured", "Featured"],
  ["daily-deals", "Daily Deals"],
  ["out-of-stock", "Out of Stock"],
  ["archived", "Archived"],
];

/**
 * @param {{
 * filters: Record<string, string>,
 * categories: any[],
 * subCategories: any[],
 * itemSubCategories: any[],
 * searchInput: string,
 * setSearchInput: (value: string) => void,
 * products: any[],
 * count: number,
 * isLoading: boolean,
 * isRefreshing: boolean,
 * hasNextPage: boolean,
 * isLoadingMore: boolean,
 * message: string,
 * loadingSlug: string,
 * onSubmitSearch: () => Promise<void>,
 * onUpdateFilters: (patch: Record<string, string>) => Promise<void>,
 * onLoadMore: () => Promise<void>,
 * onArchiveProduct: (slug: string) => Promise<void>,
 * onRestoreProduct: (slug: string) => Promise<void>,
 * onHideProduct: (slug: string) => Promise<void>,
 * onDeleteProduct: (slug: string) => Promise<void>,
 * onDeleteVariation: (variationId: number) => Promise<void>,
 * onAddToPromotionFeed: (slug: string, type: number) => Promise<void>,
 * onRemoveFromPromotionFeed: (slug: string) => Promise<void>,
 * }} props
 */
export default function ProductListPanel({
  filters,
  categories,
  subCategories,
  itemSubCategories,
  searchInput,
  setSearchInput,
  products,
  count,
  isLoading,
  isRefreshing,
  hasNextPage,
  isLoadingMore,
  message,
  loadingSlug,
  onSubmitSearch,
  onUpdateFilters,
  onLoadMore,
  onArchiveProduct,
  onRestoreProduct,
  onHideProduct,
  onDeleteProduct,
  onDeleteVariation,
  onAddToPromotionFeed,
  onRemoveFromPromotionFeed,
}) {
  return (
    <div className="space-y-6">
      <ToastMessage message={message} type="info" />
      <section className="rounded-sm border border-white/10 bg-[#121212] p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Product Operations
            </p>
            <h1 className="mt-3 text-3xl font-black text-brand-white">Products</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
              A route-driven catalog workspace for direct product management.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              href="/search-title"
            >
              Search Catalog
            </Link>
            <Link
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              href="/products/verify-listing-sheet"
            >
              Verify Listing Sheet
            </Link>
            <Link
              className="rounded-sm border border-brand-gold bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-black transition-colors hover:bg-[#f5d279]"
              href="/products/new/category"
            >
              New Product
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map(([value, label]) => (
            <button
              className={`rounded-sm border px-4 py-2 text-sm font-semibold transition-colors ${
                filters.tab === value
                  ? "border-brand-gold bg-brand-gold/10 text-brand-white"
                  : "border-white/10 text-white/55 hover:border-white/20 hover:text-brand-white"
              }`}
              type="button"
              key={value}
              onClick={() => onUpdateFilters({ tab: value })}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1.25fr)_220px_220px_220px]">
          <label className="flex min-h-12 items-center rounded-sm border border-white/10 bg-black/20 px-4">
            <input
              className="w-full bg-transparent text-sm text-brand-white outline-none placeholder:text-white/30"
              placeholder="Search by title or product code"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSubmitSearch();
                }
              }}
            />
          </label>

          <SelectField
            value={filters.category}
            onChange={(event) =>
              onUpdateFilters({
                category: event.target.value,
                "sub-category": "",
                item: "",
              })
            }
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option value={category.slug} key={category.id}>
                {category.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            value={filters["sub-category"]}
            onChange={(event) =>
              onUpdateFilters({
                "sub-category": event.target.value,
                item: "",
              })
            }
          >
            <option value="">All Subcategories</option>
            {subCategories.map((subCategory) => (
              <option value={subCategory.slug} key={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            value={filters.item}
            onChange={(event) =>
              onUpdateFilters({
                item: event.target.value,
              })
            }
          >
            <option value="">All Item Groups</option>
            {itemSubCategories.map((itemSubCategory) => (
              <option value={itemSubCategory.slug} key={itemSubCategory.id}>
                {itemSubCategory.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            <span>{count} listings</span>
            {isRefreshing ? <span>Updating route...</span> : null}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/45">
            Loading products...
          </div>
        ) : products.length ? (
          products.map((product) => (
            <ProductSummaryCard
              product={product}
              activeTab={filters.tab}
              actionLabel={
                filters.tab === "archived"
                  ? "Restore"
                  : filters.tab === "pending"
                    ? "Hide"
                    : "Archive"
              }
              onAction={
                filters.tab === "archived"
                  ? onRestoreProduct
                  : filters.tab === "pending"
                    ? onHideProduct
                    : onArchiveProduct
              }
              isActionLoading={loadingSlug.includes(String(product?.slug || ""))}
              onDeleteProduct={onDeleteProduct}
              onDeleteVariation={onDeleteVariation}
              onAddToPromotionFeed={onAddToPromotionFeed}
              onRemoveFromPromotionFeed={onRemoveFromPromotionFeed}
              key={product?.slug || product?.id}
            />
          ))
        ) : (
          <div className="rounded-sm border border-dashed border-white/15 bg-[#121212] p-12 text-center">
            <p className="text-lg font-black text-brand-white">No Products Found</p>
            <p className="mt-2 text-sm text-white/45">
              Try another tab, change the category path, or search the catalog directly.
            </p>
          </div>
        )}

        {!isLoading && products.length ? (
          <InfiniteScrollTrigger
            hasMore={hasNextPage}
            isLoading={isLoadingMore}
            label="Loading more products..."
            onLoadMore={onLoadMore}
          />
        ) : null}
      </section>
    </div>
  );
}

/**
 * @param {{ value: string, onChange: (event: import("react").ChangeEvent<HTMLSelectElement>) => void, children: import("react").ReactNode }} props
 */
function SelectField({ value, onChange, children }) {
  return (
    <label className="rounded-sm border border-white/10 bg-black/20 px-4">
      <select
        className="min-h-12 w-full bg-transparent text-sm text-brand-white outline-none"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </label>
  );
}
