import { useEffect, useState } from "react";
import { fetchSupportTickets } from "@/src/api/profile";
import { getProfileSession } from "@/src/api/profile";
import { logScreenView } from "@/src/api/analytics";

export function useActionBoard() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const data = await fetchSupportTickets(1);

        if (!isCurrent) {
          return;
        }

        setTickets(data?.results || []);
        const session = getProfileSession();
        logScreenView(
          "action_board_screen",
          session?.storeUrl || "Anonymous",
          "store",
        );
      } catch (error) {
        if (isCurrent) {
          setMessage(error instanceof Error ? error.message : "Support tickets could not be loaded");
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

  return {
    tickets,
    isLoading,
    message,
  };
}
