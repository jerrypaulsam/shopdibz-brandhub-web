import {
  formatPaymentDate,
  formatPaymentMoney,
  getPaymentStatusTone,
} from "@/src/utils/payments";

/**
 * @param {{ payment: any, isActive: boolean, onOpen: (paymentId: number) => void }} props
 */
export default function PaymentCard({ payment, isActive, onOpen }) {
  return (
    <article
      className={`rounded-sm border p-4 transition-colors ${
        isActive
          ? "border-brand-gold/50 bg-brand-gold/5"
          : "border-white/10 bg-[#121212]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
            Order #{payment.orderId}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getPaymentStatusTone(payment.statusLabel)}`}
            >
              {payment.statusLabel}
            </span>
            {payment.transactionId ? (
              <span className="text-xs font-semibold text-white/45">
                Txn: {payment.transactionId}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Initiated" value={formatPaymentDate(payment.initiateDate)} />
          <Metric label="Amount" value={formatPaymentMoney(payment.amount)} />
          <Metric label="Penalty" value={formatPaymentMoney(payment.penalty)} />
          <Metric label="Ship Cost" value={formatPaymentMoney(payment.shipCost)} />
        </div>
      </div>

      <div className="mt-4 flex justify-end border-t border-white/10 pt-4">
        <button
          className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
          type="button"
          onClick={() => onOpen(payment.id)}
        >
          Fee Breakdown
        </button>
      </div>
    </article>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Metric({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
