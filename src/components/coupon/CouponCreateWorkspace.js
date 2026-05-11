import Link from "next/link";
import { COUPON_TYPE_OPTIONS } from "@/src/utils/coupons";

/**
 * @param {{ activeType: { slug: string, label: string }, couponCode: string, couponQuantity: string, discountAmount: string, discountPercentage: string, error: string, fromDate: string, isSubmitting: boolean, maxDiscountPercentageAmount: string, message: string, minPurchaseAmount: string, toDate: string, reset: () => void, setCouponCode: (value: string) => void, setCouponQuantity: (value: string) => void, setDiscountAmount: (value: string) => void, setDiscountPercentage: (value: string) => void, setFromDate: (value: string) => void, setMaxDiscountPercentageAmount: (value: string) => void, setMinPurchaseAmount: (value: string) => void, setToDate: (value: string) => void, setType: (value: string) => Promise<void>, submit: () => Promise<void> }} props
 */
export default function CouponCreateWorkspace(props) {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Create Coupon
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
            Build a store coupon with route-visible discount type
          </h1>
        </div>

        <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
            Coupon reminders
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            <li>Coupon codes are automatically submitted in uppercase.</li>
            <li>Cash discount must stay below minimum purchase amount.</li>
            <li>Percentage coupons need a max discount cap.</li>
            <li>Validity dates follow the original coupon create payload.</li>
          </ul>
        </aside>
      </section>

      {props.message ? (
        <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {props.message}
        </div>
      ) : null}

      {props.error ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {props.error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="rounded-sm border border-white/10 bg-[#121212] p-5"
          onSubmit={(event) => {
            event.preventDefault();
            props.submit();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Coupon code">
              <input
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm uppercase text-brand-white outline-none"
                maxLength={15}
                type="text"
                value={props.couponCode}
                onChange={(event) => props.setCouponCode(event.target.value)}
              />
            </Field>

            <Field label="Coupon type">
              <div className="flex gap-3">
                {COUPON_TYPE_OPTIONS.map((type) => (
                  <button
                    className={`min-h-11 flex-1 rounded-sm border px-4 text-sm font-semibold transition-colors ${
                      props.activeType.slug === type.slug
                        ? "border-brand-gold/60 bg-brand-gold/10 text-brand-white"
                        : "border-white/10 bg-black/20 text-white/65 hover:border-white/20"
                    }`}
                    key={type.slug}
                    type="button"
                    onClick={() => props.setType(type.slug)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Number of coupon">
              <input
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                inputMode="numeric"
                type="number"
                value={props.couponQuantity}
                onChange={(event) => props.setCouponQuantity(event.target.value)}
              />
            </Field>

            <Field label="Minimum purchase amount">
              <input
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                inputMode="decimal"
                type="number"
                value={props.minPurchaseAmount}
                onChange={(event) => props.setMinPurchaseAmount(event.target.value)}
              />
            </Field>

            {props.activeType.slug === "cash" ? (
              <Field label="Discount amount">
                <input
                  className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                  inputMode="decimal"
                  type="number"
                  value={props.discountAmount}
                  onChange={(event) => props.setDiscountAmount(event.target.value)}
                />
              </Field>
            ) : (
              <>
                <Field label="Discount percentage">
                  <input
                    className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                    inputMode="decimal"
                    type="number"
                    value={props.discountPercentage}
                    onChange={(event) => props.setDiscountPercentage(event.target.value)}
                  />
                </Field>

                <Field label="Max discount amount">
                  <input
                    className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                    inputMode="decimal"
                    type="number"
                    value={props.maxDiscountPercentageAmount}
                    onChange={(event) =>
                      props.setMaxDiscountPercentageAmount(event.target.value)
                    }
                  />
                </Field>
              </>
            )}

            <Field label="Start date">
              <input
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                type="date"
                value={props.fromDate}
                onChange={(event) => props.setFromDate(event.target.value)}
              />
            </Field>

            <Field label="End date">
              <input
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                type="date"
                value={props.toDate}
                onChange={(event) => props.setToDate(event.target.value)}
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="min-h-11 rounded-sm bg-brand-red px-5 text-sm font-semibold text-brand-white transition-colors hover:bg-[#ff6969] disabled:opacity-40"
              disabled={props.isSubmitting}
              type="submit"
            >
              {props.isSubmitting ? "Submitting..." : "Create coupon"}
            </button>
            <button
              className="min-h-11 rounded-sm border border-white/10 px-5 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white"
              type="button"
              onClick={props.reset}
            >
              Reset
            </button>
            <Link
              className="inline-flex min-h-11 items-center rounded-sm border border-white/10 px-5 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white"
              href="/coupons-list?tab=active"
            >
              Back to coupons
            </Link>
          </div>
        </form>

        <aside className="space-y-4 rounded-sm border border-white/10 bg-[#121212] p-5">
          <Info label="Discount Type" value={props.activeType.label} />
          <Info label="Coupon Code Preview" value={(props.couponCode || "new-code").toUpperCase()} />
          <Info label="Valid From" value={props.fromDate || "---"} />
          <Info label="Valid To" value={props.toDate || "---"} />
        </aside>
      </section>
    </div>
  );
}

/**
 * @param {{ label: string, children: import("react").ReactNode }} props
 */
function Field({ label, children }) {
  return (
    <label className="space-y-2 text-sm text-white/60">
      <span className="block font-semibold text-brand-white">{label}</span>
      {children}
    </label>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Info({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
