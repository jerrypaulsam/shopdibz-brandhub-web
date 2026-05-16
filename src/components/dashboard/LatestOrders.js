import Link from "next/link";

/**
 * @param {{ orders: any[] }} props
 */
export default function LatestOrders({ orders }) {
  return (
    <section className="theme-surface rounded-sm border">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h2 className="text-base font-extrabold text-brand-white">
          {orders.length ? "New Pending Orders" : "Pending Orders"}
        </h2>
        <span className="text-xs font-bold uppercase tracking-wide text-brand-gold">
          {orders.length} active
        </span>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-white/35">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Order ID</th>
              {/* <th className="px-5 py-3">Amount</th> */}
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.slice(0, 5).map((order, index) => {
              const orderId = order?.ordId || order?.order?.id || order?.id || "New";
              const orderRef = `/orders/${order?.oI_id}`;
              const productTitle = trimTitle(order?.prdt?.title || "Product");
              const productImage = order?.image || "";
              const qty = order?.prdt?.quantity;

              return (
                <tr className="text-white/75" key={order.id || index}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-[#121212]">
                        {productImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={productImage}
                            alt="Product"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white/30">
                            P
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          className="block truncate font-bold text-brand-white transition-colors hover:text-brand-gold"
                          href={orderRef}
                        >
                          {productTitle}
                        </Link>
                        <p className="mt-0.5 text-xs text-white/45">Qty:{qty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{orderId}</td>
                  {/* <td className="px-5 py-4">Rs. {amount}</td> */}
                  <td className="px-5 py-4">
                    <span className="rounded-sm bg-brand-gold/10 px-2 py-1 text-xs font-bold text-brand-gold">
                      Pending
                    </span>
                  </td>
                </tr>
              );
            })}
            {!orders.length ? (
              <tr>
                <td className="px-5 py-10 text-center text-white/45" colSpan={4}>
                  No pending orders right now.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-white/10 md:hidden">
        {orders.slice(0, 5).map((order, index) => {
          const orderId = order?.ordId || order?.order?.id || order?.id || "New";
          const orderRef = `/orders/${order?.oI_id}`;
          const productTitle = trimTitle(order?.prdt?.title || "Product");
          const productImage = order?.image || "";

          return (
            <Link
              className="block px-5 py-4 transition-colors hover:bg-white/[0.02]"
              href={orderRef}
              key={order.id || index}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-[#121212]">
                    {productImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={productImage}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white/30">
                        P
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-brand-white">
                      {productTitle}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-white/55">
                      #{orderId}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-sm bg-brand-gold/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gold">
                  Pending
                </span>
              </div>
              {/* <div className="mt-4 flex items-center justify-between text-sm text-white/65">
                <span>Order Amount</span>
                <span className="font-bold text-brand-white">Rs. {amount}</span>
              </div> */}
            </Link>
          );
        })}
        {!orders.length ? (
          <div className="px-5 py-10 text-center text-sm text-white/45">
            No pending orders right now.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function trimTitle(value, maxLength = 52) {
  const text = String(value || "");

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trim()}...`;
}
