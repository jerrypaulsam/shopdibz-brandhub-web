import PaymentTabs from "./PaymentTabs";
import PaymentCard from "./PaymentCard";
import PaymentBreakdownPanel from "./PaymentBreakdownPanel";
import ToastMessage from "@/src/components/app/ToastMessage";
import InfiniteScrollTrigger from "@/src/components/app/InfiniteScrollTrigger";
import {
  formatPaymentMoney,
  getPaymentsPricingUrl,
} from "@/src/utils/payments";

/**
 * @param {{ title: string, subtitle: string, activeTab: { slug: string, label: string, description: string }, payments: any[], summary: { pendingAmount: number, settledAmount: number, holdAmount: number, totalAmount: number }, storeInfo: any, selectedPayment: any, selectedPaymentId: number, paymentBreakdown: any, isLoading: boolean, isLoadingMore: boolean, isBreakdownLoading: boolean, message: string, breakdownMessage: string, hasNextPage: boolean, onTabChange: (value: string) => void, onLoadMore: () => void, onOpenPayment: (value: number) => void, onClosePayment: () => void }} props
 */
export default function PaymentsWorkspace({
  title,
  subtitle,
  activeTab,
  payments,
  summary,
  storeInfo,
  selectedPayment,
  selectedPaymentId,
  paymentBreakdown,
  isLoading,
  isLoadingMore,
  isBreakdownLoading,
  message,
  breakdownMessage,
  hasNextPage,
  onTabChange,
  onLoadMore,
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

      <ToastMessage message={message} type="error" />
      <ToastMessage message={breakdownMessage} type="error" />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
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
                <div className="space-y-4" key={payment.id}>
                  <PaymentCard
                    isActive={selectedPaymentId === Number(payment.id)}
                    payment={payment}
                    onOpen={onOpenPayment}
                  />
                  {selectedPaymentId === Number(payment.id) ? (
                    <div className="xl:hidden">
                      <PaymentBreakdownPanel
                        breakdown={paymentBreakdown}
                        isLoading={isBreakdownLoading}
                        message={breakdownMessage}
                        paymentId={selectedPaymentId}
                        onClose={onClosePayment}
                      />
                    </div>
                  ) : null}
                </div>
              ))
            : null}

          {!isLoading && payments.length ? (
            <InfiniteScrollTrigger
              hasMore={hasNextPage}
              isLoading={isLoadingMore}
              label="Loading more payments..."
              onLoadMore={onLoadMore}
            />
          ) : null}
        </div>

        <div className="hidden xl:block">
          <PaymentBreakdownPanel
            breakdown={paymentBreakdown}
            isLoading={isBreakdownLoading}
            message={selectedPaymentId ? breakdownMessage : ""}
            paymentId={selectedPaymentId}
            onClose={onClosePayment}
          />
        </div>
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
