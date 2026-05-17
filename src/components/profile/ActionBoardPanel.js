import Link from "next/link";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ tickets: any[], isLoading: boolean, message: string }} props
 */
export default function ActionBoardPanel({ tickets, isLoading, message }) {
  return (
    <StoreSection title="Action Board" subtitle="Support tickets with direct links into each conversation thread.">
      <div className="mb-5 flex justify-end">
        <Link
          className="theme-primary-button inline-flex min-h-10 items-center justify-center rounded-sm border px-4 text-sm font-semibold transition-colors"
          href="/contact-us"
        >
          Create Ticket
        </Link>
      </div>

      {message ? <p className="mb-4 text-sm text-brand-gold">{message}</p> : null}

      {isLoading ? (
        <p className="text-sm text-white/45">Loading support tickets...</p>
      ) : tickets.length ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <article
              className="rounded-sm border border-white/10 bg-black/20 p-4"
              key={ticket.id}
            >
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Info label="Ticket #" value={resolveTicketNumber(ticket)} />
                <Info label="Type" value={ticket.type} />
                <Info label="Order ID" value={ticket.ordId || "---"} />
                <Info
                  label="Status"
                  value={ticket.status ? "Resolved" : "Pending"}
                />
              </div>
              <div className="mt-4 rounded-sm border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-white/35">Message</p>
                <p className="mt-2 leading-6 text-white/70 break-words">
                  {trimTicketMessage(ticket.msg)}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs text-white/35">{formatDate(ticket.time)}</p>
                <Link
                  className="text-sm font-bold text-brand-gold hover:text-brand-white"
                  href={`/support-messages/${ticket.id}`}
                >
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-base font-bold text-brand-white">No Support Tickets</p>
        </div>
      )}
    </StoreSection>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-white/35">{label}</p>
      <p className="mt-1 font-semibold text-brand-white">{value}</p>
    </div>
  );
}

function resolveTicketNumber(ticket) {
  return ticket?.tkt || ticket?.ticket || "---";
}

function trimTicketMessage(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "---";
  }

  return text.length > 220 ? `${text.slice(0, 220).trim()}...` : text;
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
