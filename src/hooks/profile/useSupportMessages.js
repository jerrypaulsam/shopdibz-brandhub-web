import { useEffect, useState } from "react";
import { fetchEditableStoreInfo } from "@/src/api/store";
import { fetchSupportMessages, fetchSupportTickets, getProfileSession, sendSupportMessage } from "@/src/api/profile";
import { logScreenView } from "@/src/api/analytics";

export function useSupportMessages(ticketId) {
  const [storeInfo, setStoreInfo] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const [info, ticketData, messageData] = await Promise.all([
          fetchEditableStoreInfo(),
          fetchSupportTickets(1),
          fetchSupportMessages(ticketId, 1),
        ]);

        if (!isCurrent) {
          return;
        }

        setStoreInfo(info);
        setTickets(ticketData?.results || []);
        setMessages(messageData?.results || []);
        setHasNextPage(Boolean(messageData?.next));
        setPage(1);

        const session = getProfileSession();
        logScreenView(
          "support_messages_screen",
          session?.storeUrl || "Anonymous",
          "store",
        );
      } catch (error) {
        if (isCurrent) {
          setMessage(error instanceof Error ? error.message : "Support messages could not be loaded");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    if (ticketId) {
      load();
    }

    return () => {
      isCurrent = false;
    };
  }, [ticketId]);

  async function loadMore() {
    if (!hasNextPage || isLoadingMore) {
      return;
    }

    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const data = await fetchSupportMessages(ticketId, nextPage);
      setMessages((current) => [...current, ...(data?.results || [])]);
      setHasNextPage(Boolean(data?.next));
      setPage(nextPage);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load more messages");
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function submitMessage() {
    if (!draft.trim()) {
      setMessage("Add your message");
      return false;
    }

    try {
      await sendSupportMessage(ticketId, draft.trim());
      setMessages((current) => [
        ...current,
        {
          user: storeInfo?.user?.fName || "You",
          staff: "",
          msg: draft.trim(),
          time: new Date().toISOString(),
        },
      ]);
      setDraft("");
      setMessage("Support Message Sent");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Message could not be sent");
      return false;
    }
  }

  const currentTicket =
    tickets.find((ticket) => String(ticket.id) === String(ticketId)) || null;

  return {
    storeInfo,
    currentTicket,
    messages,
    draft,
    setDraft,
    hasNextPage,
    isLoading,
    isLoadingMore,
    message,
    loadMore,
    submitMessage,
  };
}
