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
 * @param {{ order: any, fallbackStatus?: string, activeTabSlug?: string }} props
 */
export default function OrderCard({ order, fallbackStatus = "", activeTabSlug = "" }) {
  const image = getOrderPrimaryImage(order);
  const status = fallbackStatus || order?.statusCode || order?.status || "";
  const variantLabel = getOrderVariantLabel(order);
  const orderReference = getOrderReference(order);
  const orderItemId = getOrderItemId(order);
  const refundStatus = String(
    order?.product?.refundStatus ||
    order?.prdt?.refundStatus ||
    "",
  ).trim();
  const showRefundStatus = activeTabSlug === "refund" && refundStatus && refundStatus !== "Not Requested";
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
              {showRefundStatus ? (
                <span className={`inline-flex w-fit items-center rounded-sm border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getRefundStatusTone(refundStatus)}`}>
                  {refundStatus}
                </span>
              ) : (
                <span
                  className={`inline-flex w-fit items-center rounded-sm border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getOrderStatusTone(status)}`}
                >
                  {getOrderStatusLabel(status)}
                </span>
              )}
              <span className="rounded-sm border border-white/10 px-2.5 py-1 text-xs font-semibold text-white/55">
                Order #{displayReference || "---"}
              </span>
            </div>
            <h3 className="mt-2 max-w-2xl text-base font-bold text-brand-white">
              <Link href={`/orders/${orderItemId}`}>
                {getOrderProductTitle(order)}
              </Link>

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

/**
 * @param {string} value
 * @returns {string}
 */
function getRefundStatusTone(value) {
  const normalized = String(value || "").toLowerCase();

  if (normalized.includes("accepted") || normalized.includes("completed")) {
    return "border-emerald-500/30 bg-emerald-500/15 text-emerald-200 [html[data-theme='light']_&]:border-emerald-500/35 [html[data-theme='light']_&]:bg-emerald-500/10 [html[data-theme='light']_&]:text-emerald-800";
  }

  if (normalized.includes("rejected") || normalized.includes("declined")) {
    return "border-red-500/30 bg-red-500/15 text-red-200 [html[data-theme='light']_&]:border-red-500/35 [html[data-theme='light']_&]:bg-red-500/10 [html[data-theme='light']_&]:text-red-800";
  }

  return "border-amber-500/30 bg-amber-500/15 text-amber-100 [html[data-theme='light']_&]:border-amber-500/35 [html[data-theme='light']_&]:bg-amber-500/10 [html[data-theme='light']_&]:text-amber-800";
}
