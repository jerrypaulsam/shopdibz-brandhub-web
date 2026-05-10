import { useMemo, useState } from "react";
import Image from "next/image";
import ChartCard from "./ChartCard";
import LineChart from "./LineChart";

/**
 * @param {{ storeInfo: any, managers: any[], weeklyAnalytics?: any[], dailyVisits?: any[] }} props
 */
export default function RightPanel({
  storeInfo,
  managers,
  weeklyAnalytics = [],
  dailyVisits = [],
}) {
  const [activeModal, setActiveModal] = useState("");

  const visitData = useMemo(
    () =>
      [
        ...dailyVisits.map((item) => ({
          label: formatDate(item.date),
          value: Number(item.visits || 0),
        })),
        {
          label: "Today",
          value: Number(storeInfo?.dailyVisits || 0),
        },
      ].filter((item, index, list) => item.value > 0 || index === list.length - 1),
    [dailyVisits, storeInfo?.dailyVisits],
  );

  const productViewData = useMemo(
    () =>
      weeklyAnalytics.map((item) => ({
        label: formatRange(item.sDate, item.eDate),
        value: Number(item.productViews || item.product_views || 0),
      })),
    [weeklyAnalytics],
  );

  function handleDailyVisitorsMore() {
    setActiveModal("daily-visits");
  }

  function handleProductViewsMore() {
    if (!storeInfo?.prem) {
      setActiveModal("premium");
      return;
    }

    if (storeInfo?.plan && storeInfo.plan !== "P") {
      setActiveModal("platinum");
      return;
    }

    setActiveModal("product-views");
  }

  return (
    <>
      <aside className="space-y-4">
        <OrderStats storeInfo={storeInfo} />
        <QuickStat
          title="Ad Wallet"
          label="Balance"
          value={`Rs. ${storeInfo?.wallet || 0}`}
          action="Recharge"
          href={`https://loadapp.shopdibz.com/api/ads/ad_wallet/recharge/page/?storeUrl=${storeInfo?.url || ""}`}
        />
        <QuickStat
          title="Daily Visitors"
          label="Daily Users"
          value={`${storeInfo?.dailyVisits || 0}`}
          action="More"
          onAction={handleDailyVisitorsMore}
        />
        <QuickStat
          title="Shipping Time"
          label="Days"
          value={
            storeInfo?.averageShippingTime
              ? `${storeInfo.averageShippingTime} day${
                  storeInfo.averageShippingTime === 1 ? "" : "s"
                }`
              : "---"
          }
          valueClassName={
            storeInfo?.averageShippingTime >= 2
              ? "text-red-400"
              : "text-emerald-300"
          }
        />
        <QuickStat
          title="Product Views"
          label="Total"
          value={`${storeInfo?.totalProductViews || 0}`}
          action="More"
          onAction={handleProductViewsMore}
        />
        <StoreProfile storeInfo={storeInfo} />
        <InfoStrip label="GST" value={storeInfo?.tin || ""} />
        <Managers managers={managers} />
      </aside>

      <InsightModal
        open={Boolean(activeModal)}
        title={resolveModalTitle(activeModal)}
        onClose={() => setActiveModal("")}
      >
        {activeModal === "daily-visits" ? (
          <ChartCard title="Daily Store Visits">
            <LineChart
              axisLabel="Visits (No.)"
              stroke="#34d399"
              data={visitData}
            />
          </ChartCard>
        ) : null}

        {activeModal === "product-views" ? (
          <ChartCard
            title="Weekly Product Views"
            subtitle="Updates every 24 hours"
          >
            <LineChart
              axisLabel="Views (No.)"
              stroke="#D4AF37"
              data={productViewData}
            />
          </ChartCard>
        ) : null}

        {activeModal === "premium" ? (
          <UpgradeNotice
            message="Please upgrade to access detailed product view analytics."
            storeUrl={storeInfo?.url || ""}
          />
        ) : null}

        {activeModal === "platinum" ? (
          <UpgradeNotice
            message="This feature is only available on the Platinum plan."
            storeUrl={storeInfo?.url || ""}
          />
        ) : null}
      </InsightModal>
    </>
  );
}

/**
 * @param {{ storeInfo: any }} props
 */
function OrderStats({ storeInfo }) {
  const rows = [
    ["Pending Orders", Number(storeInfo?.pOrders || 0), "/orders-list?tab=pending"],
    ["Packed Orders", Number(storeInfo?.packedOrders || 0), "/orders-list?tab=packed"],
    ["Shipped Orders", Number(storeInfo?.shippedOrders || 0), "/orders-list?tab=shipped"],
    ["Completed Orders", Number(storeInfo?.completedOrders || 0), "/orders-list?tab=delivered"],
    ["Cancelled Orders", Number(storeInfo?.cancelledOrders || 0), "/orders-list?tab=cancelled"],
  ];

  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-extrabold text-brand-white">Order Stats</h2>
        <span className="rounded-sm border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-200">
          {storeInfo?.pOrders || 0} pending
        </span>
      </div>
      <div className="mt-5 space-y-2">
        {rows.map(([label, value, href]) => (
          <a
            className={`flex items-center justify-between gap-4 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-white/[0.03] ${
              label === "Pending Orders" && value > 0
                ? "border border-amber-400/20 bg-amber-400/5 text-amber-100"
                : "text-white/75"
            }`}
            href={href}
            key={label}
          >
            <span>{label}</span>
            <span className="font-bold text-brand-white">
              {value.toLocaleString("en-IN")} Nos
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

/**
 * @param {{ title: string, label: string, value: string, action?: string, href?: string, onAction?: () => void, valueClassName?: string }} props
 */
function QuickStat({
  title,
  label,
  value,
  action,
  href,
  onAction,
  valueClassName = "text-brand-white",
}) {
  const actionClasses =
    "text-sm font-bold text-brand-gold transition-colors hover:text-brand-white";

  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-extrabold text-brand-white">{title}</h2>
        {action && href ? (
          <a
            className={actionClasses}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {action}
          </a>
        ) : action ? (
          <button className={actionClasses} type="button" onClick={onAction}>
            {action}
          </button>
        ) : null}
      </div>
      <div className="mt-5 flex items-center justify-between px-3 text-sm text-white/75">
        <span>{label}</span>
        <span className={`font-bold ${valueClassName}`}>{value}</span>
      </div>
    </section>
  );
}

/**
 * @param {{ storeInfo: any }} props
 */
function StoreProfile({ storeInfo }) {
  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-5 text-center">
      <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-sm border border-brand-gold/30 bg-brand-black">
        <Image
          src={storeInfo?.logo || "/assets/logo/seller-logo.png"}
          alt={`${storeInfo?.name || "Store"} logo`}
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
      <h2 className="mt-4 text-lg font-extrabold text-brand-white">
        {storeInfo?.name || "Store"}
      </h2>
      <p className="mt-2 line-clamp-4 text-sm leading-6 text-white/50">
        {storeInfo?.description || "Store description has not been added yet."}
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
        <ProfileMetric label="Level" value={storeInfo?.level || 0} />
        <ProfileMetric label="Rating" value={storeInfo?.averageReview || 0} />
        <ProfileMetric label="Points" value={storeInfo?.points || 0} />
      </div>
    </section>
  );
}

/**
 * @param {{ label: string, value: string | number }} props
 */
function ProfileMetric({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 p-2">
      <p className="font-bold text-brand-white">{value}</p>
      <p className="mt-1 text-white/35">{label}</p>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function InfoStrip({ label, value }) {
  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-4 text-center text-sm">
      <span className="font-bold tracking-[0.18em] text-brand-white">
        {label}:{" "}
      </span>
      <span className="tracking-wide text-white/70">{value || "---"}</span>
    </section>
  );
}

/**
 * @param {{ managers: any[] }} props
 */
function Managers({ managers }) {
  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-4">
      <h2 className="text-center text-base font-extrabold text-brand-white">
        Store Managers
      </h2>
      <div className="mt-4 max-h-52 space-y-3 overflow-y-auto">
        {managers.length ? (
          managers.map((manager, index) => (
            <div
              className="flex items-center gap-3 rounded-sm border border-white/10 px-3 py-2 text-sm text-white/70"
              key={manager.manager || index}
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-sm border border-white/10 bg-brand-black">
                {manager?.managerData?.proPic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={manager.managerData.proPic}
                    alt="Manager profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-bold text-brand-gold">
                    M
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-brand-white">
                  {manager?.managerData?.email || manager?.email || "Manager"}
                </p>
                <p className="truncate text-xs text-white/40">
                  {manager?.manager || "Store manager"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-sm text-white/45">
            No Managers Assigned
          </p>
        )}
      </div>
    </section>
  );
}

/**
 * @param {{ open: boolean, title: string, children: import("react").ReactNode, onClose: () => void }} props
 */
function InsightModal({ open, title, children, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 md:items-center">
      <button
        className="absolute inset-0"
        type="button"
        aria-label="Close insight modal"
        onClick={onClose}
      />
      <section className="relative z-10 max-h-[90vh] w-full max-w-[1100px] overflow-y-auto rounded-[18px] border border-white/10 bg-[#0f0f0f] p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-brand-white">{title}</h2>
          <button
            className="rounded-sm border border-white/15 px-3 py-1.5 text-sm font-bold text-white/70 transition-colors hover:text-brand-white"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

/**
 * @param {{ message: string, storeUrl: string }} props
 */
function UpgradeNotice({ message, storeUrl }) {
  return (
    <div className="rounded-sm border border-brand-gold/25 bg-[#17130a] p-6 text-center">
      <p className="text-base font-bold text-brand-white">{message}</p>
      <p className="mt-2 text-sm text-white/55">
        Upgrade your plan to unlock detailed analytics for your brand team.
      </p>
      <a
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-sm bg-[#2d5a42] px-5 text-sm font-bold text-brand-white"
        href={`https://loadapp.shopdibz.com/api/store/get/subscription_plans/?store_url=${storeUrl}`}
        target="_blank"
        rel="noreferrer"
      >
        View Plans
      </a>
    </div>
  );
}

/**
 * @param {string} value
 * @returns {string}
 */
function resolveModalTitle(value) {
  if (value === "daily-visits") {
    return "Daily Store Visits";
  }

  if (value === "product-views") {
    return "Weekly Product Views";
  }

  return "Analytics Access";
}

/**
 * @param {string} start
 * @param {string} end
 * @returns {string}
 */
function formatRange(start, end) {
  return `${formatDate(start)} to ${formatDate(end)}`;
}

/**
 * @param {string | Date} value
 * @returns {string}
 */
function formatDate(value) {
  if (!value) {
    return "---";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "---";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}
