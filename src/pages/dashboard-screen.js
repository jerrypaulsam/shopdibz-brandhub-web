import DashboardHome from "@/src/components/dashboard/DashboardHome";
import DashboardShell from "@/src/components/dashboard/DashboardShell";

export default function DashboardScreenPage() {
  return (
    <DashboardShell>
      <DashboardHome />
    </DashboardShell>
  );
}
