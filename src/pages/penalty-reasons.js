import DashboardShell from "@/src/components/dashboard/DashboardShell";
import PenaltyReasonsPanel from "@/src/components/order/PenaltyReasonsPanel";
import { usePenaltyReasonsList } from "@/src/hooks/order/usePenaltyReasonsList";

export default function PenaltyReasonsPage() {
  const {
    page,
    reasons,
    count,
    isLoading,
    message,
    hasNextPage,
    hasPreviousPage,
    goToPage,
  } = usePenaltyReasonsList();

  return (
    <DashboardShell>
      <PenaltyReasonsPanel
        count={count}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        isLoading={isLoading}
        message={message}
        page={page}
        reasons={reasons}
        onPageChange={goToPage}
      />
    </DashboardShell>
  );
}
