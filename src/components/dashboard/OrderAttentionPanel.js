import Link from "next/link";

/**
 * @param {{ storeInfo: any }} props
 */
export default function OrderAttentionPanel({ storeInfo }) {
  const items = [
    {
      label: "Pending",
      value: Number(storeInfo?.pOrders || 0),
      href: "/orders-list?tab=pending",
      tone:
        "border-amber-400/30 bg-amber-400/10 text-amber-200 [html[data-theme='light']_&]:text-amber-700",
    },
    {
      label: "Packed",
      value: Number(storeInfo?.packedOrders || 0),
      href: "/orders-list?tab=packed",
      tone:
        "border-sky-400/30 bg-sky-400/10 text-sky-200 [html[data-theme='light']_&]:text-sky-700",
    },
    {
      label: "Shipped",
      value: Number(storeInfo?.shippedOrders || 0),
      href: "/orders-list?tab=shipped",
      tone:
        "border-violet-400/30 bg-violet-400/10 text-violet-200 [html[data-theme='light']_&]:text-violet-700",
    },
  ];

  return (
    <section className="theme-surface rounded-sm border p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Needs Attention
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-brand-white">
            Keep the active order queue moving
          </h2>
        </div>
        <Link
          className="text-sm font-bold text-brand-gold transition-colors hover:text-brand-white"
          href="/orders-list?tab=all"
        >
          View all orders
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Link
            className={`rounded-sm border p-4 transition-transform hover:-translate-y-0.5 ${item.tone}`}
            href={item.href}
            key={item.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-80">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-extrabold">
                  {item.value.toLocaleString("en-IN")}
                </p>
              </div>
              <span className="rounded-sm border border-current/20 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em]">
                Open
              </span>
            </div>
            <p className="mt-3 text-sm opacity-80">
              {item.value > 0
                ? "Orders are waiting for seller action."
                : "Nothing waiting in this queue right now."}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
