import Link from "next/link";
import CouponCard from "./CouponCard";
import CouponFilterTabs from "./CouponFilterTabs";
import { COUPON_SORTS } from "@/src/utils/coupons";

/**
 * @param {{ activeSort: { slug: string }, activeTab: { slug: string, label: string, description: string }, actionError: string, actionMessage: string, count: number, coupons: any[], hasNextPage: boolean, hasPreviousPage: boolean, isDeletingId: number, isLoading: boolean, message: string, metrics: { total: number, redemptions: number, available: number }, page: number, search: string, tabSummary: { active: number, expired: number, exhausted: number, all: number }, goToPage: (value: number) => Promise<void>, removeCoupon: (couponId: number) => Promise<void>, setSearch: (value: string) => Promise<void>, setSort: (value: string) => Promise<void>, setTab: (value: string) => Promise<void> }} props
 */
export default function CouponsWorkspace(props) {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Coupons
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
            Seller coupon workspace
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            Manage store coupons with URL-visible states, clearer performance
            signals, and the original Flutter coupon endpoints under the hood.
          </p>
        </div>

        <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
            Quick stats
          </h2>
          <div className="mt-4 space-y-3">
            <MetricCard label="Total Coupons" value={`${props.metrics.total}`} />
            <MetricCard label="Total Redemptions" value={`${props.metrics.redemptions}`} />
            <MetricCard label="Available Uses" value={`${props.metrics.available}`} />
          </div>
          <Link
            className="mt-5 inline-flex min-h-10 items-center rounded-sm border border-brand-gold/30 px-4 text-sm font-semibold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
            href="/coupons/create?type=cash"
          >
            Create coupon
          </Link>
        </aside>
      </section>

      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-white">
              {props.activeTab.label} coupons
            </h2>
            <p className="mt-2 text-sm text-white/50">
              {props.activeTab.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="min-w-[220px]">
              <span className="sr-only">Search coupons</span>
              <input
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-4 text-sm text-brand-white outline-none transition-colors focus:border-brand-gold/50"
                placeholder="Search coupon code"
                type="search"
                value={props.search}
                onChange={(event) => props.setSearch(event.target.value)}
              />
            </label>

            <label>
              <span className="sr-only">Sort coupons</span>
              <select
                className="min-h-11 rounded-sm border border-white/10 bg-black/20 px-4 text-sm text-brand-white outline-none transition-colors focus:border-brand-gold/50"
                value={props.activeSort.slug}
                onChange={(event) => props.setSort(event.target.value)}
              >
                {COUPON_SORTS.map((sort) => (
                  <option key={sort.slug} value={sort.slug}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5">
          <CouponFilterTabs
            activeTab={props.activeTab.slug}
            summary={props.tabSummary}
            onChange={props.setTab}
          />
        </div>
      </section>

      {props.message ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {props.message}
        </div>
      ) : null}

      {props.actionError ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {props.actionError}
        </div>
      ) : null}

      {props.actionMessage ? (
        <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {props.actionMessage}
        </div>
      ) : null}

      <section className="space-y-4">
        {props.isLoading ? (
          <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-12 text-center text-sm text-white/45">
            Loading coupons...
          </div>
        ) : null}

        {!props.isLoading && !props.coupons.length ? (
          <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-16 text-center">
            <p className="text-base font-bold text-brand-white">
              No {props.activeTab.label.toLowerCase()} coupons
            </p>
            <p className="mt-2 text-sm text-white/45">
              Create a new coupon or switch filters to inspect the rest of the list.
            </p>
          </div>
        ) : null}

        {!props.isLoading
          ? props.coupons.map((coupon) => (
              <CouponCard
                coupon={coupon}
                isDeleting={props.isDeletingId === Number(coupon?.id || 0)}
                key={coupon?.id}
                onDelete={props.removeCoupon}
              />
            ))
          : null}
      </section>

      <div className="flex items-center justify-between rounded-sm border border-white/10 bg-[#121212] px-5 py-4">
        <button
          className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          disabled={!props.hasPreviousPage}
          onClick={() => props.goToPage(props.page - 1)}
        >
          Previous
        </button>
        <span className="text-sm font-semibold text-white/60">
          Page {props.page} / {Math.max(1, Math.ceil(props.count / 12))}
        </span>
        <button
          className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-40"
          type="button"
          disabled={!props.hasNextPage}
          onClick={() => props.goToPage(props.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function MetricCard({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
