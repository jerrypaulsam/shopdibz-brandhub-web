import { useEffect, useRef } from "react";
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
  const threadRef = useRef(null);
  const previousMessageCountRef = useRef(0);
  const prependHeightRef = useRef(null);
  const shouldStickBottomRef = useRef(true);

  useEffect(() => {
    const node = threadRef.current;

    if (!node || isLoading) {
      previousMessageCountRef.current = messages.length;
      return;
    }

    const previousCount = previousMessageCountRef.current;
    const nextCount = messages.length;

    if (!previousCount && nextCount) {
      node.scrollTop = node.scrollHeight;
    } else if (
      prependHeightRef.current !== null
      && nextCount > previousCount
    ) {
      const heightDelta = node.scrollHeight - prependHeightRef.current;
      node.scrollTop = heightDelta;
      prependHeightRef.current = null;
    } else if (shouldStickBottomRef.current && nextCount > previousCount) {
      node.scrollTop = node.scrollHeight;
    }

    previousMessageCountRef.current = nextCount;
  }, [isLoading, messages]);

  function handleThreadScroll(event) {
    const node = event.currentTarget;
    const distanceFromBottom =
      node.scrollHeight - node.scrollTop - node.clientHeight;

    shouldStickBottomRef.current = distanceFromBottom < 80;

    if (node.scrollTop > 48 || !hasNextPage || isLoadingMore) {
      return;
    }

    prependHeightRef.current = node.scrollHeight;
    onLoadMore();
  }

  return (
    <StoreSection
      title={currentTicket ? `Ticket: #${resolveTicketNumber(currentTicket)}` : "Support Messages"}
      subtitle="Follow the conversation with the Shopdibz support team and send replies here."
    >
      <AuthMessage>{message}</AuthMessage>

      {isLoading ? (
        <p className="mt-6 text-sm text-white/45">Loading messages...</p>
      ) : messages.length ? (
        <div
          ref={threadRef}
          className="mt-6 max-h-[68vh] space-y-3 overflow-y-auto pr-1"
          onScroll={handleThreadScroll}
        >
          {hasNextPage ? (
            <div className="flex justify-center pb-2">
              <div className="theme-panel-soft rounded-full border px-3 py-1 text-xs theme-text-muted">
                {isLoadingMore ? "Loading older messages..." : "Scroll up for older messages"}
              </div>
            </div>
          ) : null}

          {messages.map((item, index) => {
            const sender = resolveMessageSender(item, storeInfo);
            const fromSupport = sender.kind === "support";

            return (
              <div
                className={`flex ${fromSupport ? "justify-start" : "justify-end"}`}
                key={`${item.time || "message"}-${index}`}
              >
                <article
                  className={`w-full max-w-3xl rounded-2xl border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${
                    fromSupport
                      ? "theme-panel border-white/10 rounded-bl-sm"
                      : "border-brand-gold/24 bg-brand-gold/10 rounded-br-sm [html[data-theme='light']_&]:border-brand-gold/35 [html[data-theme='light']_&]:bg-brand-gold/14"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-extrabold text-brand-white [html[data-theme='light']_&]:text-[#5b3125]">
                      {sender.label}
                    </p>
                    <p className="shrink-0 text-xs text-white/35">
                      {formatDate(item.time)}
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-white/75 [html[data-theme='light']_&]:text-[#5f4a42]">
                    {item.msg}
                  </p>
                </article>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 py-12 text-center">
          <p className="text-base font-bold text-brand-white">No Messages Yet</p>
        </div>
      )}

      <div className="mt-8 border-t border-white/10 pt-5">
        <div className="rounded-[26px] border border-white/10 bg-black/20 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.12)] [html[data-theme='light']_&]:bg-white/[0.05]">
          <div className="flex items-end gap-3">
            <textarea
              className="theme-field min-h-14 flex-1 resize-none rounded-[22px] border px-4 py-3 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-brand-gold"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Reply to this ticket..."
              rows={2}
            />
            <div className="w-[112px] shrink-0">
              <AuthButton type="button" onClick={onSubmit}>
                Send
              </AuthButton>
            </div>
          </div>
          <p className="mt-2 px-1 text-xs theme-text-muted">
            Your reply will be added to this support thread.
          </p>
        </div>
      </div>
    </StoreSection>
  );
}

function resolveTicketNumber(ticket) {
  return ticket?.tkt || ticket?.ticket || "---";
}

function resolveMessageSender(item, storeInfo) {
  const staffName = normalizeIdentityValue(item?.staff);
  const userName = normalizeIdentityValue(item?.user);
  const fallbackUserName =
    normalizeIdentityValue(storeInfo?.user?.fName)
    || normalizeIdentityValue(storeInfo?.name)
    || "Client";

  if (staffName) {
    return {
      kind: "support",
      label: "Shopdibz Team",
    };
  }

  return {
    kind: "client",
    label: userName || fallbackUserName,
  };
}

function normalizeIdentityValue(value) {
  const text = String(value ?? "").trim();

  if (!text || text.toLowerCase() === "null" || text.toLowerCase() === "undefined") {
    return "";
  }

  return text;
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
