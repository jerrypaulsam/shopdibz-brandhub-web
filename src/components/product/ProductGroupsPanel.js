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
          {groups.map((group) => (
            <article
              className="rounded-sm border border-white/10 bg-[#121212] p-5"
              key={group?.id}
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                Group #{group?.id || "-"}
              </p>
              <h2 className="mt-3 text-xl font-black text-brand-white">
                {group?.name || group?.title || "Untitled Group"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                {group?.description || "Seller-curated grouped products."}
              </p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white/60">
                  Products {String(group?.pCount || group?.productCount || 0)}
                </p>
                <button
                  className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
                  type="button"
                  onClick={() => onOpenGroup(Number(group?.id || 0))}
                >
                  Open
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-sm border border-dashed border-white/15 bg-[#121212] p-12 text-center">
          <p className="text-lg font-black text-brand-white">No Product Groups Yet</p>
        </div>
      )}
    </div>
  );
}
