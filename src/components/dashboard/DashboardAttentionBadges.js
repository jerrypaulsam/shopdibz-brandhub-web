import Link from "next/link";
import { useState } from "react";

/**
 * @param {{ storeInfo: any }} props
 */
export default function DashboardAttentionBadges({ storeInfo }) {
  const hasUnreadNotifications = isFlagEnabled(storeInfo?.notiSts);
  const hasUnreadMessages = isFlagEnabled(storeInfo?.newMsg);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  if (!hasUnreadNotifications && !hasUnreadMessages) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {hasUnreadNotifications ? (
          <Link
            className="theme-surface-soft inline-flex min-h-10 items-center gap-2 rounded-full border border-brand-gold/25 px-4 py-2 text-sm font-bold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
            href="/notifications"
          >
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <BellGlyph />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-red" />
            </span>
            New notifications
          </Link>
        ) : null}

        {hasUnreadMessages ? (
          <button
            className={`theme-surface-soft inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
              isMessageOpen
                ? "border-red-400/35 text-red-200 [html[data-theme='light']_&]:text-[#8f4e3f]"
                : "border-red-400/20 text-red-200 hover:border-red-400/35 [html[data-theme='light']_&]:text-[#8f4e3f]"
            }`}
            type="button"
            aria-expanded={isMessageOpen}
            onClick={() => setIsMessageOpen((current) => !current)}
          >
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <ChatGlyph />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-red" />
            </span>
            New message
            <span className="theme-text-muted text-xs font-semibold">
              {isMessageOpen ? "Hide" : "Click to open"}
            </span>
          </button>
        ) : null}
      </div>

      {hasUnreadMessages && isMessageOpen ? (
        <div className="theme-surface-soft rounded-sm border border-red-400/20 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-200 [html[data-theme='light']_&]:text-[#8f4e3f]">
              <ChatGlyph />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-extrabold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
                  Unread chat in Brand Hub app
                </p>
                <span className="rounded-full border border-red-400/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-red-200 [html[data-theme='light']_&]:text-[#8f4e3f]">
                  App only
                </span>
              </div>
              <p className="theme-text-muted mt-1 text-sm leading-6">
                A customer or team message is waiting. Open the Brand Hub app to read and reply.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BellGlyph() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ChatGlyph() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M7 18 3 21V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7Z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  );
}

function isFlagEnabled(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return false;
}
