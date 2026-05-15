import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PaymentsWorkspace from "@/src/components/payment/PaymentsWorkspace";
import { usePaymentsWorkspace } from "@/src/hooks/payment/usePaymentsWorkspace";

export default function PaymentsScreenPage() {
  const paymentState = usePaymentsWorkspace();

  return (
    <DashboardShell>
      <PaymentsWorkspace
        subtitle="Track payouts and review payment updates in a focused workspace."
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
