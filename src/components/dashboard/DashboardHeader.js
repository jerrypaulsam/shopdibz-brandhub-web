import Image from "next/image";
import Link from "next/link";

/**
 * @param {{ storeInfo: any, actions?: import("react").ReactNode }} props
 */
export default function DashboardHeader({ storeInfo, actions = null }) {
  return (
    <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,460px)]">
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-brand-white md:text-4xl">
            {storeInfo?.name || "Brand Command Center"}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-sm border border-brand-gold/40 px-3 py-1 text-xs font-bold uppercase text-brand-gold">
              {resolvePlanLabel(storeInfo)}
            </span>
            <span className="rounded-sm border border-white/10 px-3 py-1 text-xs font-semibold text-white/65">
              {storeInfo?.url ? `store/${storeInfo.url}` : "Store URL unavailable"}
            </span>
            <span className="rounded-sm border border-white/10 px-3 py-1 text-xs font-semibold text-white/65">
              Avg shipping: {formatShippingTime(storeInfo?.averageShippingTime)}
            </span>
          </div>
        </div>
        {actions ? <div className="max-w-[760px]">{actions}</div> : null}
      </div>

      <div className="theme-surface rounded-sm border p-4">
        <div className="flex items-center gap-4">
          {storeInfo?.logo ? (
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-brand-gold/30 bg-brand-black">
              <Image
                src={storeInfo.logo}
                alt={`${storeInfo?.name || "Store"} logo`}
                fill
                sizes="56px"
                className="object-contain"
                unoptimized
              />
            </div>
          ) : (
            <Link
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-dashed border-brand-gold/35 bg-black/20 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
              href="/store-info-form?section=identity"
            >
              Add Logo
            </Link>
          )}
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-brand-white">
              {storeInfo?.name || "Store setup pending"}
            </p>
            <p className="mt-1 truncate text-xs text-white/45">
              {storeInfo?.url ? `shopdibz.com/store/${storeInfo.url}` : "No store URL yet"}
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-sm border border-emerald-400/20 bg-emerald-400/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                Ad Wallet
              </p>
              <p className="mt-2 text-2xl font-extrabold text-brand-white">
                Rs. {Number(storeInfo?.wallet || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <a
              className="theme-action-positive inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-bold transition-colors"
              href={`https://loadapp.shopdibz.com/api/ads/ad_wallet/recharge/page/?storeUrl=${storeInfo?.url || ""}`}
              rel="noreferrer"
              target="_blank"
            >
              Recharge
            </a>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <HeaderMetric label="Followers" value={storeInfo?.followers || 0} />
          <HeaderMetric label="Products" value={storeInfo?.totalProducts || 0} />
          <HeaderMetric label="Ratings" value={storeInfo?.countReview || 0} />
        </div>
      </div>
    </header>
  );
}

/**
 * @param {{ label: string, value: string | number }} props
 */
function HeaderMetric({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-3 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-lg font-extrabold text-brand-white">
        {Number(value || 0).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/**
 * @param {any} storeInfo
 * @returns {string}
 */
function resolvePlanLabel(storeInfo) {
  if (!storeInfo?.prem) {
    return "Free";
  }

  if (storeInfo?.plan === "S") {
    return "Silver";
  }

  if (storeInfo?.plan === "G") {
    return "Gold";
  }

  if (storeInfo?.plan === "P") {
    return "Platinum";
  }

  return "Premium";
}

/**
 * @param {number|string} value
 * @returns {string}
 */
function formatShippingTime(value) {
  const days = Number(value || 0);

  if (!days) {
    return "---";
  }

  return `${days} ${days === 1 ? "day" : "days"}`;
}
