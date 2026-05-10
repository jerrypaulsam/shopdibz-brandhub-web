import Link from "next/link";
import {
  getProductCategoryTrail,
  getProductPriceRange,
  getProductPrimaryImage,
  getProductStockValue,
} from "@/src/utils/product";

/**
 * @param {{
 * product: any,
 * activeTab?: string,
 * actionLabel?: string,
 * onAction?: (slug: string) => Promise<void>,
 * isActionLoading?: boolean,
 * onDeleteProduct?: (slug: string) => Promise<void>,
 * onDeleteVariation?: (variationId: number) => Promise<void>,
 * onAddToPromotionFeed?: (slug: string, type: number) => Promise<void>,
 * onRemoveFromPromotionFeed?: (slug: string) => Promise<void>,
 * }} props
 */
export default function ProductSummaryCard({
  product,
  activeTab = "active",
  actionLabel,
  onAction,
  isActionLoading = false,
  onDeleteProduct,
  onDeleteVariation,
  onAddToPromotionFeed,
  onRemoveFromPromotionFeed,
}) {
  const slug = String(product?.slug || "");
  const title = String(product?.title || product?.name || "Untitled Product");
  const categoryTrail = getProductCategoryTrail(product);
  const imageUrl = getProductPrimaryImage(product);
  const stock = getProductStockValue(product);
  const priceRange = getProductPriceRange(product);
  const rating = Number(product?.rating || 0);
  const reviewCount = Number(product?.rCount || product?.reviewCount || 0);
  const sold = Number(product?.sold || 0);
  const views = Number(product?.vCnt || product?.views || 0);
  const variations = Array.isArray(product?.productVariations)
    ? product.productVariations
    : Array.isArray(product?.prdtVari)
      ? product.prdtVari
      : [];
  const variationCount = variations.length;
  const firstVariationId = variationCount ? variations[0]?.id : 0;
  const isArchived = Boolean(product?.arch || product?.archived);
  const isPromoted = Boolean(product?.isPromoted || product?.promoted);
  const featuredStatus = Number(product?.feaStat ?? product?.featuredStatus ?? 3);
  const approvalLabel = product?.aprvd ? "Approved" : "Pending";
  const canManagePromotion = !isArchived && typeof onAddToPromotionFeed === "function";
  const canRemovePromotion =
    featuredStatus >= 0 &&
    featuredStatus <= 2 &&
    typeof onRemoveFromPromotionFeed === "function";

  return (
    <article className="overflow-hidden rounded-sm border border-white/10 bg-[#121212]">
      <div className="grid gap-0 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="border-b border-white/10 bg-black/30 lg:border-b-0 lg:border-r">
          <div className="aspect-square overflow-hidden bg-white/5">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={title}
                className="h-full w-full object-cover"
                src={imageUrl}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-bold text-white/35">
                No Image
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge>{approvalLabel}</Badge>
                <Badge>{variationCount ? "With Variant" : "Without Variant"}</Badge>
                <Badge>{stock > 0 ? `Stock ${stock}` : "Out of Stock"}</Badge>
                {isPromoted ? <Badge>Promoted</Badge> : null}
              </div>
              <h3 className="mt-3 text-xl font-black text-brand-white">{title}</h3>
              <p className="mt-2 text-sm text-white/45">{categoryTrail || "Uncategorised"}</p>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Price
              </p>
              <p className="mt-2 text-lg font-black text-brand-white">
                Rs. {priceRange.minPrice.toFixed(2)}
                {priceRange.maxPrice !== priceRange.minPrice
                  ? ` - Rs. ${priceRange.maxPrice.toFixed(2)}`
                  : ""}
              </p>
              <p className="mt-1 text-sm text-white/45">
                MRP Rs. {priceRange.minMrp.toFixed(2)}
                {priceRange.maxMrp !== priceRange.minMrp
                  ? ` - Rs. ${priceRange.maxMrp.toFixed(2)}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Sold" value={String(sold)} />
            <Metric label="Views" value={String(views)} />
            <Metric label="Reviews" value={String(reviewCount)} />
            <Metric label="Rating" value={rating ? `${rating.toFixed(1)} / 5` : "0 / 5"} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              href={`/products/${slug}`}
            >
              Open
            </Link>
            <Link
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              href={`/products/${slug}/edit?variant-mode=${variationCount ? "with-variant" : "without-variant"}`}
            >
              Edit
            </Link>
            <Link
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              href={`/products/${slug}/reviews`}
            >
              Reviews
            </Link>
            <Link
              className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              href={`/products/${slug}/edit?variant-mode=${variationCount ? "with-variant" : "without-variant"}&section=category`}
            >
              Category
            </Link>
            {!isPromoted ? (
              <Link
                className="rounded-sm border border-emerald-400/35 px-4 py-2 text-sm font-semibold text-emerald-300 transition-colors hover:border-emerald-300 hover:text-emerald-200"
                href={{
                  pathname: "/campaigns/create",
                  query: {
                    "product-slug": slug,
                    "product-name": title,
                    mode: "product",
                  },
                }}
              >
                Boost
              </Link>
            ) : null}
            {variationCount ? (
              <>
                <Link
                  className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                  href={`/products/${slug}/variations/${firstVariationId}/edit?variant-mode=with-variant`}
                >
                  Edit Variant
                </Link>
                <Link
                  className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                  href={`/products/${slug}/new-variation`}
                >
                  Add Variation
                </Link>
              </>
            ) : (
              <Link
                className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                href={`/products/${slug}/images`}
              >
                Images
              </Link>
            )}
            {actionLabel && onAction ? (
              <button
                className="rounded-sm border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:border-red-300 hover:text-red-200 disabled:opacity-50"
                type="button"
                disabled={isActionLoading}
                onClick={() => onAction(slug)}
              >
                {isActionLoading ? "Updating..." : actionLabel}
              </button>
            ) : null}
            {onDeleteProduct ? (
              <button
                className="rounded-sm border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:border-red-300 hover:text-red-200 disabled:opacity-50"
                type="button"
                disabled={isActionLoading}
                onClick={() => onDeleteProduct(slug)}
              >
                {isActionLoading ? "Updating..." : "Delete"}
              </button>
            ) : null}
            {isArchived ? (
              <p className="self-center text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                Archived listing
              </p>
            ) : null}
          </div>

          {canManagePromotion || canRemovePromotion ? (
            <div className="mt-5 rounded-sm border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                    Promotional Placement
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    Surface this listing in seller-panel merchandising feeds right from the product workspace.
                  </p>
                </div>
                {canRemovePromotion ? (
                  <button
                    className="rounded-sm border border-red-400/35 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-300 hover:border-red-300 hover:text-red-200 disabled:opacity-50"
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => onRemoveFromPromotionFeed?.(slug)}
                  >
                    Remove from {featuredStatus === 0 ? "Top" : featuredStatus === 1 ? "Featured" : "Daily Deals"}
                  </button>
                ) : null}
              </div>

              {!canRemovePromotion && canManagePromotion ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    [0, "Top"],
                    [1, "Featured"],
                    [2, "Daily Deals"],
                  ].map(([type, label]) => (
                    <button
                      className="rounded-sm border border-emerald-400/30 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-300 hover:border-emerald-300 hover:text-emerald-200 disabled:opacity-50"
                      type="button"
                      key={String(type)}
                      disabled={isActionLoading}
                      onClick={() => onAddToPromotionFeed?.(slug, Number(type))}
                    >
                      Add to {label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {variationCount ? (
            <div className="mt-5 rounded-sm border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  Variations
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                  {variationCount} total
                </p>
              </div>
              <div className="mt-4 space-y-3">
                {variations.slice(0, 3).map((variation) => {
                  const variationTypes = Array.isArray(variation?.variationTypes)
                    ? variation.variationTypes.map((item) => item?.name).filter(Boolean)
                    : Array.isArray(variation?.vTypes)
                      ? variation.vTypes.map((item) => item?.name || item?.tMap).filter(Boolean)
                      : [];

                  return (
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                      key={variation.id}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-brand-white">
                          {variation?.variation || variation?.vAtion || "Variation"}
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          Code {variation?.variationCode || variation?.varCode || "-"}
                          {variationTypes.length ? ` / ${variationTypes.join(", ")}` : ""}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          className="rounded-sm border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-white hover:border-brand-gold hover:text-brand-gold"
                          href={`/products/${slug}?variation-id=${variation.id}&variant-mode=with-variant`}
                        >
                          View
                        </Link>
                        <Link
                          className="rounded-sm border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-white hover:border-brand-gold hover:text-brand-gold"
                          href={`/products/${slug}/variations/${variation.id}/edit?variant-mode=with-variant`}
                        >
                          Update
                        </Link>
                        {onDeleteVariation ? (
                          <button
                            className="rounded-sm border border-red-400/35 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-red-300 hover:border-red-300 hover:text-red-200 disabled:opacity-50"
                            type="button"
                            disabled={isActionLoading}
                            onClick={() => onDeleteVariation(variation.id)}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              {variationCount > 3 ? (
                <p className="mt-4 text-xs text-white/35">
                  Additional variations are available inside the product detail workspace.
                </p>
              ) : null}
            </div>
          ) : null}

          {activeTab === "top" || activeTab === "featured" || activeTab === "daily-deals" ? (
            <p className="mt-4 text-xs text-white/35">
              This listing is being surfaced from the seller-panel promotional feed.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * @param {{ children: import("react").ReactNode }} props
 */
function Badge({ children }) {
  return (
    <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
      {children}
    </span>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Metric({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 p-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-brand-white">{value}</p>
    </div>
  );
}
