import Link from "next/link";
import StoreSection from "./StoreSection";

/**
 * @param {{ notifications: any[], isLoading: boolean, message: string, onDismiss: (index: number) => void }} props
 */
export default function NotificationsPanel({
  notifications,
  isLoading,
  message,
  onDismiss,
}) {
  if (isLoading) {
    return (
      <StoreSection title="Notifications">
        <p className="text-sm text-white/45">Loading notifications...</p>
      </StoreSection>
    );
  }

  if (!notifications.length) {
    return (
      <StoreSection title="Notifications">
        <div className="py-14 text-center">
          <p className="text-base font-bold text-brand-white">No Notification</p>
          <p className="mt-2 text-sm text-white/45">
            Fresh alerts for orders, reviews, and store events will appear here.
          </p>
        </div>
      </StoreSection>
    );
  }

  return (
    <StoreSection
      title="Notifications"
      subtitle="Seller hub alerts mirrored from the Flutter notification stream."
    >
      {message ? <p className="mb-4 text-sm text-brand-gold">{message}</p> : null}
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <NotificationRow
            notification={notification}
            onDismiss={() => onDismiss(index)}
            key={`${notification?.verb || "notification"}-${notification?.time || index}`}
          />
        ))}
      </div>
    </StoreSection>
  );
}

/**
 * @param {{ notification: any, onDismiss: () => void }} props
 */
function NotificationRow({ notification, onDismiss }) {
  const href = resolveNotificationHref(notification);

  return (
    <article className="rounded-sm border border-white/10 bg-black/20 p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-brand-black text-sm font-bold text-brand-gold">
          N
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 text-brand-white">{notification?.verb || "Notification"}</p>
          <p className="mt-2 text-xs text-white/40">
            {formatNotificationDate(notification?.time)}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {href ? (
              <Link
                className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold transition-colors hover:text-brand-white"
                href={href}
              >
                Open
              </Link>
            ) : null}
            <button
              className="text-xs font-bold uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-brand-white"
              type="button"
              onClick={onDismiss}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * @param {any} notification
 * @returns {string}
 */
function resolveNotificationHref(notification) {
  const type = String(notification?.target?.url || notification?.target?.type || "");
  const targetId = notification?.target?.id;

  if (type.includes("STR_FBK")) {
    return "/store-reviews";
  }

  if (type.includes("CNT")) {
    return "/action-board/support-tickets";
  }

  if (type.includes("PRDT")) {
    if (type.includes("PRDT_BLK")) {
      return "/products/new/bulk";
    }

    if (targetId) {
      return `/products/${targetId}`;
    }
  }

  if (type.includes("PAY")) {
    return targetId ? `/payments-list?tab=all&payment=${targetId}` : "/payments-list?tab=pending";
  }

  if (type.includes("ORD") || type.includes("RFD")) {
    return targetId ? `/orders/${targetId}` : "/orders-list?tab=pending";
  }

  return "";
}

/**
 * @param {string | Date} value
 * @returns {string}
 */
function formatNotificationDate(value) {
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
