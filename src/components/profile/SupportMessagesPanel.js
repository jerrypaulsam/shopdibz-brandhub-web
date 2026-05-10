import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ storeInfo: any, currentTicket: any, messages: any[], draft: string, setDraft: (value: string) => void, hasNextPage: boolean, isLoading: boolean, isLoadingMore: boolean, message: string, onLoadMore: () => Promise<void>, onSubmit: () => Promise<boolean> }} props
 */
export default function SupportMessagesPanel({
  storeInfo,
  currentTicket,
  messages,
  draft,
  setDraft,
  hasNextPage,
  isLoading,
  isLoadingMore,
  message,
  onLoadMore,
  onSubmit,
}) {
  return (
    <StoreSection
      title={currentTicket ? `Ticket: #${currentTicket.ticket}` : "Support Messages"}
      subtitle="Message thread between the seller and the Shopdibz support team."
    >
      <AuthMessage>{message}</AuthMessage>

      {isLoading ? (
        <p className="mt-6 text-sm text-white/45">Loading messages...</p>
      ) : messages.length ? (
        <div className="mt-6 space-y-4">
          {messages.map((item, index) => {
            const fromSupport = item.staff !== "" && item.staff != null;

            return (
              <article
                className={`rounded-sm border p-4 ${
                  fromSupport
                    ? "border-white/10 bg-[#171717]"
                    : "border-brand-gold/20 bg-brand-gold/5"
                }`}
                key={`${item.time || "message"}-${index}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-brand-white">
                    {fromSupport ? "Support Agent" : storeInfo?.user?.fName || "You"}
                  </p>
                  <p className="text-xs text-white/35">{formatDate(item.time)}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/75">{item.msg}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 py-12 text-center">
          <p className="text-base font-bold text-brand-white">No Messages Yet</p>
        </div>
      )}

      {hasNextPage && messages.length ? (
        <div className="mt-6 flex justify-center">
          <button
            className="rounded-sm border border-white/15 px-4 py-2 text-sm font-bold text-brand-white hover:border-brand-gold hover:text-brand-gold disabled:opacity-60"
            type="button"
            disabled={isLoadingMore}
            onClick={onLoadMore}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      ) : null}

      <div className="mt-8 border-t border-white/10 pt-6">
        <label className="block">
          <span className="text-sm font-semibold text-white/80">Add Your Message</span>
          <textarea
            className="mt-3 min-h-28 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-gold"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add Your Message"
          />
        </label>
        <div className="mt-4 max-w-xs">
          <AuthButton type="button" onClick={onSubmit}>
            Send
          </AuthButton>
        </div>
      </div>
    </StoreSection>
  );
}

function formatDate(value) {
  if (!value) {
    return "---";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "---";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
