import { useEffect, useState } from "react";
import { fetchNotifications, markStoreNotificationsRead } from "@/src/api/store";
import { logScreenView } from "@/src/api/analytics";
import { getAuthSession } from "@/src/api/auth";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const [notificationsResult] = await Promise.allSettled([
          fetchNotifications(1),
          markStoreNotificationsRead(),
        ]);

        if (notificationsResult.status !== "fulfilled") {
          throw notificationsResult.reason;
        }

        if (!isCurrent) {
          return;
        }

        setNotifications(notificationsResult.value?.results || []);

        const authSession = getAuthSession();
        logScreenView(
          "notification_screen",
          authSession?.user?.storeUrl || authSession?.storeUrl || "Anonymous",
          "store",
        );
      } catch (error) {
        if (isCurrent) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Notifications could not be loaded",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, []);

  function dismissNotification(index) {
    setNotifications((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return {
    notifications,
    isLoading,
    message,
    dismissNotification,
  };
}
