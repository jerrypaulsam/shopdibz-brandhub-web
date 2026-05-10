import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PaymentsWorkspace from "@/src/components/payment/PaymentsWorkspace";
import { usePaymentsWorkspace } from "@/src/hooks/payment/usePaymentsWorkspace";

export default function PaymentsListPage() {
  const paymentState = usePaymentsWorkspace();

  return (
    <DashboardShell>
      <PaymentsWorkspace
        {...paymentState}
        subtitle="A cleaner seller payout workspace with route-driven tabs and direct fee-breakdown links, while still using the original Flutter payment endpoints."
        title="Seller payout command center"
      />
    </DashboardShell>
  );
}
