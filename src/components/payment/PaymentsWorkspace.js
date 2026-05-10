import PaymentTabs from "./PaymentTabs";
import PaymentCard from "./PaymentCard";
import PaymentBreakdownPanel from "./PaymentBreakdownPanel";
import {
  formatPaymentMoney,
  getPaymentsPricingUrl,
} from "@/src/utils/payments";

/**
 * @param {{ title: string, subtitle: string, activeTab: { slug: string, label: string, description: string }, payments: any[], page: number, summary: { pendingAmount: number, settledAmount: number, holdAmount: number, totalAmount: number }, storeInfo: any, selectedPaymentId: number, paymentBreakdown: any, isLoading: boolean, isBreakdownLoading: boolean, message: string, breakdownMessage: string, hasNextPage: boolean, hasPreviousPage: boolean, onTabChange: (value: string) => void, onPageChange: (value: number) => void, onOpenPayment: (value: number) => void, onClosePayment: () => void }} props
 */
export default function PaymentsWorkspace({
  title,
  subtitle,
  activeTab,
  payments,
  page,
  summary,
  storeInfo,
  selectedPaymentId,
  paymentBreakdown,
  isLoading,
  isBreakdownLoading,
  message,
  breakdownMessage,
  hasNextPage,
  hasPreviousPage,
  onTabChange,
  onPageChange,
  onOpenPayment,
  onClosePayment,
}) {
  const pricingUrl = getPaymentsPricingUrl(storeInfo);

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Payments
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            {subtitle}
          </p>
        </div>

        <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
            Settlement notes
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            <li>Pending payouts usually release after delivery review.</li>
            <li>Higher seller trust shortens the settlement window.</li>
            <li>Hold states often follow delivery disputes or verification flags.</li>
            <li>Use fee breakdown to inspect penalties, shipping cost, and commission.</li>
          </ul>
          {pricingUrl ? (
            <a
              className="mt-5 inline-flex min-h-10 items-center rounded-sm border border-brand-gold/30 px-4 text-sm font-semibold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
              href={pricingUrl}
              rel="noreferrer"
              target="_blank"
            >
              View payout pricing
            </a>
          ) : null}
        </aside>
      </section>

      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-white">
              {activeTab.label} payouts
            </h2>
            <p className="mt-2 text-sm text-white/50">{activeTab.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Pending" value={formatPaymentMoney(summary.pendingAmount)} />
            <SummaryCard label="Settled" value={formatPaymentMoney(summary.settledAmount)} />
            <SummaryCard label="On Hold" value={formatPaymentMoney(summary.holdAmount)} />
            <SummaryCard label="Visible" value={`${payments.length}`} />
          </div>
        </div>

        <div className="mt-5">
          <PaymentTabs activeTab={activeTab.slug} onChange={onTabChange} />
        </div>
      </section>

      {message ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {message}
        </div>
      ) : null}

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-12 text-center text-sm text-white/45">
              Loading payments...
            </div>
          ) : null}

          {!isLoading && !payments.length ? (
            <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-16 text-center">
              <p className="text-base font-bold text-brand-white">
                No {activeTab.label.toLowerCase()} payments
              </p>
              <p className="mt-2 text-sm text-white/45">
                Payment events matching this stage will show up here.
              </p>
            </div>
          ) : null}

          {!isLoading
            ? payments.map((payment) => (
                <PaymentCard
                  isActive={selectedPaymentId === Number(payment.id)}
                  key={payment.id}
                  payment={payment}
                  onOpen={onOpenPayment}
                />
              ))
            : null}

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

        <PaymentBreakdownPanel
          breakdown={paymentBreakdown}
          isLoading={isBreakdownLoading}
          message={selectedPaymentId ? breakdownMessage : ""}
          paymentId={selectedPaymentId}
          onClose={onClosePayment}
        />
      </section>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function SummaryCard({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
