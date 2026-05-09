/**
 * @param {{ orders: any[] }} props
 */
export default function LatestOrders({ orders }) {
  return (
    <section className="rounded-sm border border-white/10 bg-[#121212]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h2 className="text-base font-extrabold text-brand-white">
          {orders.length ? "New Pending Orders" : "Pending Orders"}
        </h2>
        <span className="text-xs font-bold uppercase tracking-wide text-brand-gold">
          {orders.length} active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-white/35">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.slice(0, 5).map((order, index) => (
              <tr className="text-white/75" key={order.id || index}>
                <td className="px-5 py-4 font-bold text-brand-white">
                  #{order?.order?.id || order?.id || "New"}
                </td>
                <td className="px-5 py-4">
                  {order?.order?.user?.email || order?.user?.email || "Customer"}
                </td>
                <td className="px-5 py-4">
                  Rs. {order?.order?.total || order?.total || "0.00"}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-sm bg-brand-gold/10 px-2 py-1 text-xs font-bold text-brand-gold">
                    Pending
                  </span>
                </td>
              </tr>
            ))}
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
    </section>
  );
}
