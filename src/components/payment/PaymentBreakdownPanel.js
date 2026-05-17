import { formatPaymentMoney } from "@/src/utils/payments";

/**
 * @param {{ paymentId: number, payment?: any, breakdown: any, isLoading: boolean, message: string, onClose: () => void }} props
 */
export default function PaymentBreakdownPanel({
  paymentId,
  payment,
  breakdown,
  isLoading,
  message,
  onClose,
}) {
  const publicTitle =
    payment?.title ||
    payment?.productTitle ||
    payment?.productName ||
    payment?.name ||
    breakdown?.tit ||
    breakdown?.productTitle ||
    "";

  return (
    <aside className="theme-panel rounded-sm border p-5 xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
            Fee Breakdown
          </p>
          <h2 className="mt-2 text-lg font-extrabold text-brand-white">
            {publicTitle || "Payment breakdown"}
          </h2>
        </div>
        <button
          className="theme-action-neutral min-h-10 rounded-sm border px-3 text-sm font-semibold transition-colors"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {!paymentId && !isLoading ? (
        <div className="theme-panel-soft theme-text-muted mt-6 rounded-sm border px-4 py-4 text-sm leading-6">
          Select a payment card to inspect its fee breakdown here.
        </div>
      ) : null}

      {isLoading ? (
        <p className="theme-text-muted mt-6 text-sm">Loading breakdown...</p>
      ) : null}

      {!isLoading && message ? (
        <div className="theme-toast-error mt-6 rounded-sm border px-4 py-3 text-sm">
          {message}
        </div>
      ) : null}

      {!isLoading && !message && breakdown ? (
        <div className="mt-6 space-y-3">
          <Row label="Product" value={breakdown?.tit || breakdown?.productTitle || "---"} />
          <Row label="Price" value={formatPaymentMoney(breakdown?.price)} />
          <Row label="Gateway Fee" value={formatPaymentMoney(breakdown?.gateFee)} />
          <Row label="TCS" value={formatPaymentMoney(breakdown?.tcs)} />
          {Number(breakdown?.penalty || 0) > 0 ? (
            <Row label="Penalty" value={formatPaymentMoney(breakdown?.penalty)} />
          ) : null}
          {Number(breakdown?.shCost || breakdown?.shippingCost || 0) > 0 ? (
            <Row
              label="Shipping Cost"
              value={formatPaymentMoney(breakdown?.shCost || breakdown?.shippingCost)}
            />
          ) : null}
          <Row label="Commission" value={formatPaymentMoney(breakdown?.commission)} />
          <div className="mt-2 rounded-sm border border-brand-gold/30 bg-brand-gold/10 px-4 py-4">
            <Row label="Seller Total" value={formatPaymentMoney(breakdown?.total || breakdown?.sellerTotal)} strong />
          </div>
        </div>
      ) : null}
    </aside>
  );
}

/**
 * @param {{ label: string, value: string, strong?: boolean }} props
 */
function Row({ label, value, strong = false }) {
  return (
    <div className="theme-panel-soft flex items-start justify-between gap-4 rounded-sm border px-4 py-3">
      <span className={`text-sm ${strong ? "font-bold text-brand-white" : "text-white/55"}`}>
        {label}
      </span>
      <span className={`text-right text-sm ${strong ? "font-bold text-brand-white" : "font-semibold text-brand-white"}`}>
        {value}
      </span>
    </div>
  );
}
