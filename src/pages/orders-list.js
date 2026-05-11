import DashboardShell from "@/src/components/dashboard/DashboardShell";
import OrderListPanel from "@/src/components/order/OrderListPanel";
import { useOrderList } from "@/src/hooks/order/useOrderList";

export default function OrdersListPage() {
  const {
    activeTab,
    page,
    orders,
    count,
    isLoading,
    isLoadingMore,
    message,
    hasNextPage,
    setTab,
    loadMore,
  } = useOrderList();

  return (
    <DashboardShell>
      <OrderListPanel
        activeTab={activeTab}
        count={count}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        message={message}
        orders={orders}
        page={page}
        onLoadMore={loadMore}
        onTabChange={setTab}
      />
    </DashboardShell>
  );
}
