import {
  formatCouponDate,
  formatCouponMoney,
  getCouponStatus,
  getCouponTypeLabel,
} from "@/src/utils/coupons";

/**
 * @param {{ coupon: any, isDeleting: boolean, onDelete: (couponId: number) => Promise<void> }} props
 */
export default function CouponCard({ coupon, isDeleting, onDelete }) {
  const couponId = Number(coupon?.id || 0);
  const code = String(coupon?.code || "COUPON");
  const status = getCouponStatus(coupon);
  const used = Number(coupon?.used || 0);
  const maxValue = Number(coupon?.maxVal || coupon?.maxValue || 0);
  const remaining = Math.max(maxValue - used, 0);
  const typeLabel = getCouponTypeLabel(coupon);
  const discountValue =
    String(coupon?.type || "") === "C"
      ? formatCouponMoney(coupon?.amount)
      : `${Number(coupon?.perc || 0)}%`;

  return (
    <article className="overflow-hidden rounded-sm border border-white/10 bg-[#121212]">
      <div className="border-b border-white/10 bg-black/20 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
              Coupon Code
            </p>
            <h3 className="mt-2 text-xl font-black tracking-[0.12em] text-brand-white">
              {code}
            </h3>
          </div>
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Metric label="Type" value={typeLabel} />
          <Metric label="Discount" value={discountValue} />
          <Metric label="Min Purchase" value={formatCouponMoney(coupon?.minAmt)} />
          <Metric label="Used" value={`${used}`} />
          <Metric label="Available" value={`${remaining}`} />
          <Metric
            label={String(coupon?.type || "") === "C" ? "Ceiling" : "Max Discount"}
            value={
              String(coupon?.type || "") === "C"
                ? `${maxValue} redemptions`
                : formatCouponMoney(coupon?.maxPAmt || coupon?.maxPercAmt)
            }
          />
        </div>

        <div className="rounded-sm border border-white/10 bg-black/20 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
            Validity
          </p>
          <p className="mt-2 text-sm font-semibold text-brand-white">
            {formatCouponDate(coupon?.vFrom || coupon?.validFrom)}
          </p>
          <p className="mt-1 text-xs text-white/45">Start date</p>
          <p className="mt-4 text-sm font-semibold text-brand-white">
            {formatCouponDate(coupon?.vTo || coupon?.validTo)}
          </p>
          <p className="mt-1 text-xs text-white/45">End date</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
        <p className="text-sm text-white/45">
          {typeLabel === "Percentage"
            ? `Max discount ${formatCouponMoney(coupon?.maxPAmt || coupon?.maxPercAmt)}`
            : `Coupon count ${maxValue}`}
        </p>
        <button
          className="min-h-10 rounded-sm border border-red-400/35 px-4 text-sm font-semibold text-red-300 transition-colors hover:border-red-300 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isDeleting}
          onClick={() => onDelete(couponId)}
        >
          {isDeleting ? "Removing..." : "Remove"}
        </button>
      </div>
    </article>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Metric({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}

/**
 * @param {{ status: string }} props
 */
function StatusBadge({ status }) {
  const className =
    status === "active"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : status === "expired"
        ? "border-white/15 bg-white/5 text-white/65"
        : "border-red-500/30 bg-red-500/10 text-red-200";

  const label =
    status === "active" ? "Active" : status === "expired" ? "Expired" : "Exhausted";

  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${className}`}>
      {label}
    </span>
  );
}
