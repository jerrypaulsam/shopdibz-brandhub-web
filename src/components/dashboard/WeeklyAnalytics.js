import ChartCard from "./ChartCard";
import HorizontalBarChart from "./HorizontalBarChart";
import LineChart from "./LineChart";

/**
 * @param {{ analytics: any[], dailyVisits: any[], currentDailyVisits?: number, storeInfo?: any }} props
 */
export default function WeeklyAnalytics({
  analytics,
  dailyVisits,
  currentDailyVisits = 0,
  storeInfo,
}) {
  const weeklyData = analytics.map((item) => ({
    label: formatRange(item.sDate, item.eDate),
    orders: Number(item.orders || 0),
    earned: Number(item.earned || 0),
    productViews: Number(item.productViews || item.product_views || 0),
  }));
  const visitData = [
    ...dailyVisits.map((item) => ({
      label: formatDate(item.date),
      value: Number(item.visits || 0),
    })),
    {
      label: "Today",
      value: Number(currentDailyVisits || 0),
    },
  ].filter((item, index, list) => item.value > 0 || index === list.length - 1);
  const productViewsUnlocked = Boolean(storeInfo?.prem) && storeInfo?.plan === "P";

  if (!weeklyData.length && !visitData.length) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
              Analytics
            </p>
            <h2 className="mt-2 text-lg font-extrabold text-brand-white">
              Store Weekly Orders & Revenue
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex">
            <SummaryPill
              label="Weeks tracked"
              value={`${weeklyData.length}`}
            />
            <SummaryPill
              label="Current daily visits"
              value={`${Number(currentDailyVisits || 0).toLocaleString("en-IN")}`}
            />
          </div>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Weekly Orders">
          <HorizontalBarChart
            axisLabel="Orders (No.)"
            colorClass="bg-emerald-300"
            data={weeklyData.map((item) => ({
              label: item.label,
              value: item.orders,
            }))}
          />
        </ChartCard>
        <ChartCard title="Weekly Revenue">
          <HorizontalBarChart
            axisLabel="Revenue (Rs.)"
            colorClass="bg-red-400"
            valuePrefix="Rs. "
            data={weeklyData.map((item) => ({
              label: item.label,
              value: item.earned,
            }))}
          />
        </ChartCard>
        <div className="relative">
          <ChartCard title="Weekly Product Views" subtitle="Updates every 24 hours">
            <div className={productViewsUnlocked ? "" : "pointer-events-none select-none blur-[5px] opacity-55"}>
              <LineChart
                axisLabel="Views (No.)"
                stroke="#D4AF37"
                data={weeklyData.map((item) => ({
                  label: item.label,
                  value: item.productViews,
                }))}
              />
            </div>
          </ChartCard>
          {!productViewsUnlocked ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="max-w-sm rounded-sm border border-brand-gold/20 bg-black/80 p-5 text-center backdrop-blur-sm">
                <p className="text-sm font-bold text-brand-white">
                  {storeInfo?.prem
                    ? "Detailed product view analytics are available only on the Platinum plan."
                    : "Please upgrade to access detailed product view analytics."}
                </p>
                <a
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-sm bg-[#2d5a42] px-5 text-sm font-bold text-brand-white"
                  href={`https://loadapp.shopdibz.com/api/store/get/subscription_plans/?store_url=${storeInfo?.url || ""}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Upgrade
                </a>
              </div>
            </div>
          ) : null}
        </div>
        <ChartCard title="Daily Store Visits">
          <LineChart axisLabel="Visits (No.)" stroke="#34d399" data={visitData} />
        </ChartCard>
      </div>
    </section>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function SummaryPill({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
        {label}
      </p>
      <p className="mt-1 text-base font-extrabold text-brand-white">{value}</p>
    </div>
  );
}

/**
 * @param {string} start
 * @param {string} end
 * @returns {string}
 */
function formatRange(start, end) {
  return `${formatDate(start)}\nto\n${formatDate(end)}`;
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
