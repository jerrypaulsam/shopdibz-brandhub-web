import { useRouter } from "next/router";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import SupportMessagesPanel from "@/src/components/profile/SupportMessagesPanel";
import { useSupportMessages } from "@/src/hooks/profile/useSupportMessages";

export default function SupportMessagesPage() {
  const router = useRouter();
  const ticketId = Number(router.query.ticketId || 0);
  const {
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
  } = useSupportMessages(ticketId);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-6">
        <SupportMessagesPanel
          storeInfo={storeInfo}
          currentTicket={currentTicket}
          messages={messages}
          draft={draft}
          setDraft={setDraft}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          message={message}
          onLoadMore={loadMore}
          onSubmit={submitMessage}
        />
      </div>
    </DashboardShell>
  );
}
