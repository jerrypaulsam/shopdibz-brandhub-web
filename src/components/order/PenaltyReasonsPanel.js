import { formatMoney, formatOrderDateTime } from "@/src/utils/orders";

/**
 * @param {{ reasons: any[], count: number, isLoading: boolean, message: string, page: number, hasNextPage: boolean, hasPreviousPage: boolean, onPageChange: (value: number) => void }} props
 */
export default function PenaltyReasonsPanel({
  reasons,
  count,
  isLoading,
  message,
  page,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}) {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
          Penalties
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
          Store penalty ledger
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
          A clearer web view of the Flutter penalty list, with direct pagination
          and enough structure to spot which orders are affecting seller health.
        </p>
      </section>

      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-white">
              Store penalties
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Review refund and fulfilment penalties tied to past orders.
            </p>
          </div>
          <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
              Records
            </p>
            <p className="mt-2 text-xl font-extrabold text-brand-white">{count}</p>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {message}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-12 text-center text-sm text-white/45">
          Loading penalties...
        </div>
      ) : null}

      {!isLoading && !reasons.length ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-16 text-center">
          <p className="text-base font-bold text-brand-white">No penalties</p>
          <p className="mt-2 text-sm text-white/45">
            Penalty records will appear here when the backend returns them.
          </p>
        </div>
      ) : null}

      {!isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {reasons.map((reason, index) => (
            <article
              className="rounded-sm border border-white/10 bg-[#121212] p-5"
              key={`${reason?.order || "penalty"}-${index}`}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Order #" value={reason?.order} />
                <Field label="Penalty Amount" value={formatMoney(reason?.amt)} />
                <Field label="Item Name" value={reason?.item} />
                <Field label="Date" value={formatOrderDateTime(reason?.created)} />
              </div>
              <div className="mt-4 rounded-sm border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                  Refund Reason
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {reason?.reason || "---"}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between rounded-sm border border-white/10 bg-[#121212] px-5 py-4">
        <button
          className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="text-sm font-semibold text-white/60">Page {page}</span>
        <button
          className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Field({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value || "---"}</p>
    </div>
  );
}
