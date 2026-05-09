import DashboardShell from "@/src/components/dashboard/DashboardShell";
import NotificationsPanel from "@/src/components/store/NotificationsPanel";
import { useNotifications } from "@/src/hooks/store/useNotifications";

export default function NotificationsPage() {
  const { notifications, isLoading, message, dismissNotification } =
    useNotifications();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-6">
        <NotificationsPanel
          notifications={notifications}
          isLoading={isLoading}
          message={message}
          onDismiss={dismissNotification}
        />
      </div>
    </DashboardShell>
  );
}
