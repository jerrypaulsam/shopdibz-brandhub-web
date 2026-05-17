import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PaymentsWorkspace from "@/src/components/payment/PaymentsWorkspace";
import { usePaymentsWorkspace } from "@/src/hooks/payment/usePaymentsWorkspace";

export default function PaymentsScreenPage() {
  const paymentState = usePaymentsWorkspace();

  return (
    <DashboardShell>
      <PaymentsWorkspace
        subtitle="Track payouts, check payment status, and review settlement details."
        title="Payments"
        {...paymentState}
        onClosePayment={paymentState.closePayment}
        onLoadMore={paymentState.loadMore}
        onOpenPayment={paymentState.openPayment}
        onTabChange={paymentState.setTab}
      />
    </DashboardShell>
  );
}
