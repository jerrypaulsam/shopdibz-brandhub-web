import Link from "next/link";
import { useState } from "react";

const downloadAppHref =
  "https://www.shopdibz.com/brand-hub?utm_source=brand-hub&utm_medium=organic";

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
    <div className="theme-surface-soft rounded-[18px] border px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 [html[data-theme='light']_&]:text-[#7b6358]">
            Attention Board
          </p>
          <p className="mt-1 text-sm font-semibold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
            Fresh updates that may need your action.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
        {hasUnreadNotifications ? (
          <Link
            className="inline-flex min-h-11 items-center gap-3 rounded-full border border-brand-gold/25 bg-brand-gold/10 px-4 py-2.5 text-sm font-bold text-brand-gold transition-colors hover:border-brand-gold hover:bg-brand-gold/15 hover:text-brand-white"
            href="/notifications"
          >
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-brand-gold/20 bg-black/15 [html[data-theme='light']_&]:bg-white/70">
              <BellGlyph className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-red" />
            </span>
            <span className="flex flex-col leading-none">
              <span>Notifications</span>
              <span className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-brand-gold/80 [html[data-theme='light']_&]:text-[#6f4337]">
                New Updates
              </span>
            </span>
          </Link>
        ) : null}

        {hasUnreadMessages ? (
          <button
            className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-bold transition-colors ${
              isMessageOpen
                ? "border-red-400/35 bg-red-500/12 text-red-200 [html[data-theme='light']_&]:text-[#8f4e3f]"
                : "border-red-400/20 bg-red-500/8 text-red-200 hover:border-red-400/35 hover:bg-red-500/12 [html[data-theme='light']_&]:text-[#8f4e3f]"
            }`}
            type="button"
            aria-expanded={isMessageOpen}
            onClick={() => setIsMessageOpen((current) => !current)}
          >
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-400/20 bg-black/15 [html[data-theme='light']_&]:bg-white/70">
              <ChatGlyph className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-brand-red" />
            </span>
            <span className="flex flex-col text-left leading-none">
              <span>Messages</span>
              <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-current/75">
                {isMessageOpen ? "Close" : "View"}
              </span>
            </span>
          </button>
        ) : null}
      </div>
      </div>

      {hasUnreadMessages && isMessageOpen ? (
        <div className="mt-4 rounded-[16px] border border-red-400/20 bg-red-500/6 px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-200 [html[data-theme='light']_&]:text-[#8f4e3f]">
              <ChatGlyph className="h-4 w-4" />
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
              <div className="mt-4">
                <a
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100 transition-colors hover:border-red-400/40 hover:bg-red-500/16 hover:text-white [html[data-theme='light']_&]:text-[#8f4e3f]"
                  href={downloadAppHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download Brand Hub App
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BellGlyph({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
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

function ChatGlyph({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
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
