import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PaymentsWorkspace from "@/src/components/payment/PaymentsWorkspace";
import { usePaymentsWorkspace } from "@/src/hooks/payment/usePaymentsWorkspace";

export default function PaymentsListPage() {
  const paymentState = usePaymentsWorkspace();

  return (
    <DashboardShell>
      <PaymentsWorkspace
        subtitle="Track seller payouts, review fee breakdowns, and stay on top of payment status."
        title="Seller payout command center"
        {...paymentState}
        onClosePayment={paymentState.closePayment}
        onLoadMore={paymentState.loadMore}
        onOpenPayment={paymentState.openPayment}
        onTabChange={paymentState.setTab}
      />
    </DashboardShell>
  );
}
