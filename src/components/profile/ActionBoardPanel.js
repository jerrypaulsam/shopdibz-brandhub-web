import Link from "next/link";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ tickets: any[], isLoading: boolean, message: string }} props
 */
export default function ActionBoardPanel({ tickets, isLoading, message }) {
  return (
    <StoreSection title="Action Board" subtitle="Support tickets with direct links into each conversation thread.">
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
                <Info label="Ticket #" value={ticket.ticket} />
                <Info label="Type" value={ticket.type} />
                <Info label="Order ID" value={ticket.ordId || "---"} />
                <Info
                  label="Status"
                  value={ticket.status ? "Resolved" : "Pending"}
                />
              </div>
              <p className="mt-4 leading-6 text-white/70">{ticket.msg}</p>
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
