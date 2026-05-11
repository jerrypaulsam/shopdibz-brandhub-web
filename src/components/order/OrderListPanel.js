import OrderStatusTabs from "./OrderStatusTabs";
import OrderCard from "./OrderCard";
import ToastMessage from "@/src/components/app/ToastMessage";
import InfiniteScrollTrigger from "@/src/components/app/InfiniteScrollTrigger";

/**
 * @param {{ activeTab: { slug: string, label: string, description: string }, orders: any[], count: number, isLoading: boolean, isLoadingMore: boolean, message: string, hasNextPage: boolean, page: number, onTabChange: (value: string) => void, onLoadMore: () => void }} props
 */
export default function OrderListPanel({
  activeTab,
  orders,
  count,
  isLoading,
  isLoadingMore,
  message,
  hasNextPage,
  onTabChange,
  onLoadMore,
}) {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <ToastMessage message={message} type="error" />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Orders
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
            Seller fulfilment workspace
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            Move between order stages, open a direct detail view, and keep
            shipping actions tight enough that your team can work from links
            instead of hidden tab state.
          </p>
        </div>

        <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
            Order reminders
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            <li>Ship within 3 days to avoid auto-cancellation.</li>
            <li>For self shipping, update tracking as soon as the parcel leaves.</li>
            <li>For assisted shipping, packed status is the pickup trigger.</li>
            <li>Faster updates reduce support tickets and refund disputes.</li>
          </ul>
        </aside>
      </section>

      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-white">
              {activeTab.label} orders
            </h2>
            <p className="mt-2 text-sm text-white/50">{activeTab.description}</p>
          </div>
          <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
              Visible items
            </p>
            <p className="mt-2 text-xl font-extrabold text-brand-white">{count}</p>
          </div>
        </div>

        <div className="mt-5">
          <OrderStatusTabs activeTab={activeTab.slug} onChange={onTabChange} />
        </div>
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-12 text-center text-sm text-white/45">
            Loading orders...
          </div>
        ) : null}

        {!isLoading && !orders.length ? (
          <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-16 text-center">
            <p className="text-base font-bold text-brand-white">
              No {activeTab.label.toLowerCase()} orders
            </p>
            <p className="mt-2 text-sm text-white/45">
              When order items enter this stage, they will appear here.
            </p>
          </div>
        ) : null}

        {!isLoading
          ? orders.map((order) => (
              <OrderCard
                key={order?.oIId || order?.id || order?.orderId}
                order={order}
                fallbackStatus={activeTab.status}
              />
            ))
          : null}

        {!isLoading && orders.length ? (
          <InfiniteScrollTrigger
            hasMore={hasNextPage}
            isLoading={isLoadingMore}
            label="Loading more orders..."
            onLoadMore={onLoadMore}
          />
        ) : null}
      </section>
    </div>
  );
}
