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
    message,
    hasNextPage,
    hasPreviousPage,
    setTab,
    goToPage,
  } = useOrderList();

  return (
    <DashboardShell>
      <OrderListPanel
        activeTab={activeTab}
        count={count}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        isLoading={isLoading}
        message={message}
        orders={orders}
        page={page}
        onPageChange={goToPage}
        onTabChange={setTab}
      />
    </DashboardShell>
  );
}
