import { normalizeRemoteAssetUrl } from "@/src/utils/product";

/**
 * @param {{ groups: any[], isLoading: boolean, message: string, onOpenGroup: (groupId: number) => Promise<void> }} props
 */
export default function ProductGroupsPanel({
  groups,
  isLoading,
  message,
  onOpenGroup,
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-sm border border-white/10 bg-[#121212] p-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
          Product Workspace
        </p>
        <h1 className="mt-3 text-3xl font-black text-brand-white">Product Groups</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
          Grouped collections for seller-curated assortments, with direct routes into each group.
        </p>
        {message ? <p className="mt-4 text-sm text-brand-gold">{message}</p> : null}
      </section>

      {isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
          Loading product groups...
        </div>
      ) : groups.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const coverImage = normalizeRemoteAssetUrl(group?.cImg || group?.image || "");

            return (
            <article
              className="overflow-hidden rounded-sm border border-white/10 bg-[#121212]"
              key={group?.id}
            >
              <div className="aspect-[16/9] w-full bg-black/30">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={group?.name || "Product group"}
                    className="h-full w-full object-cover"
                    src={coverImage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-semibold text-white/35">
                    No cover image
                  </div>
                )}
              </div>
              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
                    Group #{group?.id || "-"}
                  </span>
                  <span className={`rounded-sm px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${group?.active ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-white/50"}`}>
                    {group?.active ? "Active" : "Hidden"}
                  </span>
                  {group?.show ? (
                    <span className="rounded-sm bg-brand-gold/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gold">
                      Home
                    </span>
                  ) : null}
                </div>
                <div>
                  <h2 className="text-xl font-black text-brand-white">
                    {group?.name || group?.title || "Untitled Group"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {group?.discount
                      ? `${group.discountType === "1" ? "Flat" : "Percent"} discount ${group.discount}`
                      : "Seller-curated grouped products."}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white/50">
                    Open the group to review included products.
                  </p>
                  <button
                    className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
                    type="button"
                    onClick={() => onOpenGroup(Number(group?.id || 0))}
                  >
                    Open
                  </button>
                </div>
              </div>
            </article>
            );
          })}
        </section>
      ) : (
        <div className="rounded-sm border border-dashed border-white/15 bg-[#121212] p-12 text-center">
          <p className="text-lg font-black text-brand-white">No Product Groups Yet</p>
        </div>
      )}
    </div>
  );
}
