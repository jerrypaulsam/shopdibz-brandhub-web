import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ActivityWorkspace from "./ActivityWorkspace";
import { useActivityWorkspace } from "@/src/hooks/activity/useActivityWorkspace";

export default function ActivityPage() {
  const activityState = useActivityWorkspace();

  return (
    <DashboardShell>
      <ActivityWorkspace {...activityState} />
    </DashboardShell>
  );
}
