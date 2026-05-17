import { formatMoney, formatOrderDateTime } from "@/src/utils/orders";
import ToastMessage from "@/src/components/app/ToastMessage";

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
      <ToastMessage message={message} type="error" />

      <section className="theme-panel rounded-sm border p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
          Penalties
        </p>
        <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
          Store penalty ledger
        </h1>
      </section>

      <section className="theme-panel rounded-sm border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-white">
              Store penalties
            </h2>
            <p className="theme-text-muted mt-2 text-sm">
              Review refund and fulfilment penalties tied to past orders.
            </p>
          </div>
          <div className="theme-panel-soft rounded-sm border px-4 py-3 text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
              Records
            </p>
            <p className="mt-2 text-xl font-extrabold text-brand-white">{count}</p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="theme-panel rounded-sm border px-5 py-12 text-center text-sm theme-text-muted">
          Loading penalties...
        </div>
      ) : null}

      {!isLoading && !reasons.length ? (
        <div className="theme-panel rounded-sm border px-5 py-16 text-center">
          <p className="text-base font-bold text-brand-white">No penalties</p>
          <p className="theme-text-muted mt-2 text-sm">
            Penalty records will appear here when the backend returns them.
          </p>
        </div>
      ) : null}

      {!isLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {reasons.map((reason, index) => (
            <article
              className="theme-panel rounded-sm border p-5"
              key={`${reason?.order || "penalty"}-${index}`}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Order #" value={reason?.order} />
                <Field label="Penalty Amount" value={formatMoney(reason?.amt)} />
                <Field label="Item Name" value={reason?.item} />
                <Field label="Date" value={formatOrderDateTime(reason?.created)} />
              </div>
              <div className="theme-panel-soft mt-4 rounded-sm border p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                  Refund Reason
                </p>
                <p className="theme-text-muted mt-2 text-sm leading-6">
                  {reason?.reason || "---"}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="theme-panel flex items-center justify-between rounded-sm border px-5 py-4">
        <button
          className="theme-action-neutral min-h-10 rounded-sm border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="theme-text-muted text-sm font-semibold">Page {page}</span>
        <button
          className="theme-action-neutral min-h-10 rounded-sm border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
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
    <div className="theme-panel-soft rounded-sm border px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value || "---"}</p>
    </div>
  );
}
