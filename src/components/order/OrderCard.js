import Image from "next/image";
import Link from "next/link";
import {
  getOrderItemId,
  getOrderReference,
  getOrderPrimaryImage,
  getOrderProductTitle,
  getOrderQuantity,
  getOrderStatusLabel,
  getOrderStatusTone,
  getOrderVariantLabel,
} from "@/src/utils/orders";

/**
 * @param {{ order: any, fallbackStatus?: string }} props
 */
export default function OrderCard({ order, fallbackStatus = "" }) {
  const image = getOrderPrimaryImage(order);
  const status = fallbackStatus || order?.statusCode || order?.status || "";
  const variantLabel = getOrderVariantLabel(order);
  const orderReference = getOrderReference(order);
  const orderItemId = getOrderItemId(order);
  const displayReference =
    orderReference.length > 18
      ? `${orderReference.slice(0, 10)}...${orderReference.slice(-6)}`
      : orderReference;

  return (
    <article className="rounded-sm border border-white/10 bg-[#121212] p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
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
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex w-fit items-center rounded-sm border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getOrderStatusTone(status)}`}
              >
                {getOrderStatusLabel(status)}
              </span>
              <span className="rounded-sm border border-white/10 px-2.5 py-1 text-xs font-semibold text-white/55">
                Order #{displayReference || "---"}
              </span>
            </div>
            <h3 className="mt-2 max-w-2xl text-base font-bold text-brand-white">
              {getOrderProductTitle(order)}
            </h3>
            {variantLabel ? (
              <p className="mt-2 text-sm font-semibold text-brand-gold">
                {variantLabel}
              </p>
            ) : null}
            <p className="mt-2 text-sm text-white/45">
              Quantity {getOrderQuantity(order)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="rounded-sm border border-white/10 bg-black/20 px-3 py-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
              Qty
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-white">
              {getOrderQuantity(order)}
            </p>
          </div>
          <Link
            className="inline-flex min-h-10 items-center rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
            href={`/orders/${orderItemId}`}
          >
            Open Order
          </Link>
        </div>
      </div>
    </article>
  );
}
