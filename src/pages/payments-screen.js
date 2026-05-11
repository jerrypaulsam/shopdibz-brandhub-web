import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PaymentsWorkspace from "@/src/components/payment/PaymentsWorkspace";
import { usePaymentsWorkspace } from "@/src/hooks/payment/usePaymentsWorkspace";

export default function PaymentsScreenPage() {
  const paymentState = usePaymentsWorkspace();

  return (
    <DashboardShell>
      <PaymentsWorkspace
        subtitle="This keeps parity with the legacy Flutter payments screen, but uses the same upgraded responsive workspace as the main payments route."
        title="Payments screen"
        {...paymentState}
        onClosePayment={paymentState.closePayment}
        onLoadMore={paymentState.loadMore}
        onOpenPayment={paymentState.openPayment}
        onTabChange={paymentState.setTab}
      />
    </DashboardShell>
  );
}
