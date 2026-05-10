import Image from "next/image";
import Link from "next/link";
import {
  formatMoney,
  formatOrderDateTime,
  getOrderCustomerName,
  getOrderPrimaryImage,
  getOrderProductTitle,
  getOrderQuantity,
  getOrderStatusCode,
  getOrderStatusLabel,
  getOrderStatusTone,
  getOrderUnitPrice,
  getOrderVariantLabel,
} from "@/src/utils/orders";

/**
 * @param {{ order: any }} props
 */
export default function OrderCard({ order }) {
  const image = getOrderPrimaryImage(order);
  const status = getOrderStatusCode(order);
  const variantLabel = getOrderVariantLabel(order);

  return (
    <article className="rounded-sm border border-white/10 bg-[#121212] p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex items-start gap-4">
          {image ? (
            <Image
              alt={getOrderProductTitle(order)}
              className="h-24 w-24 rounded-sm border border-white/10 object-cover"
              height={96}
              src={image}
              unoptimized
              width={96}
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-sm border border-dashed border-white/10 bg-black/20 text-xs text-white/35">
              No image
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
              Order #{order?.orderId || order?.order?.id || order?.oIId}
            </p>
            <h3 className="mt-2 max-w-2xl text-base font-bold text-brand-white">
              {getOrderProductTitle(order)}
            </h3>
            {variantLabel ? (
              <p className="mt-2 text-sm font-semibold text-brand-gold">
                {variantLabel}
              </p>
            ) : null}
            <p className="mt-2 text-sm text-white/55">
              {getOrderCustomerName(order)}
            </p>
          </div>
        </div>

        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Qty" value={`${getOrderQuantity(order)}`} />
          <Metric label="Unit Price" value={formatMoney(getOrderUnitPrice(order))} />
          <Metric label="Updated" value={formatOrderDateTime(order?.order?.date || order?.date)} />
          <Metric label="Item ID" value={`${order?.oIId || order?.id || "---"}`} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span
          className={`inline-flex w-fit items-center rounded-sm border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getOrderStatusTone(status)}`}
        >
          {getOrderStatusLabel(status)}
        </span>

        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-10 items-center rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
            href={`/orders/${order?.oIId || order?.id}`}
          >
            Open Order
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Metric({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
