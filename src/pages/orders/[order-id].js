import DashboardShell from "@/src/components/dashboard/DashboardShell";
import OrderDetailPanel from "@/src/components/order/OrderDetailPanel";
import { useOrderDetail } from "@/src/hooks/order/useOrderDetail";

export default function OrderDetailPage() {
  const {
    order,
    isLoading,
    message,
    actionMessage,
    actionError,
    busyAction,
    isPhoneVisible,
    revealPhone,
    submitPack,
    submitTracking,
    submitDelivered,
    submitCancel,
    submitMessage,
    openInvoice,
    openShippingLabel,
  } = useOrderDetail();

  return (
    <DashboardShell>
      <OrderDetailPanel
        actionError={actionError}
        actionMessage={actionMessage}
        busyAction={busyAction}
        isLoading={isLoading}
        isPhoneVisible={isPhoneVisible}
        message={message}
        order={order}
        onOpenInvoice={openInvoice}
        onOpenShippingLabel={openShippingLabel}
        onSubmitCancel={submitCancel}
        onSubmitDelivered={submitDelivered}
        onSubmitMessage={submitMessage}
        onSubmitPack={submitPack}
        onSubmitTracking={submitTracking}
        onTogglePhone={revealPhone}
      />
    </DashboardShell>
  );
}
