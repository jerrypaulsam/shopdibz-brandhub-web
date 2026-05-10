import ChartCard from "./ChartCard";
import HorizontalBarChart from "./HorizontalBarChart";
import LineChart from "./LineChart";

/**
 * @param {{ analytics: any[], dailyVisits: any[], currentDailyVisits?: number }} props
 */
export default function WeeklyAnalytics({
  analytics,
  dailyVisits,
  currentDailyVisits = 0,
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
        <ChartCard title="Weekly Product Views" subtitle="Updates every 24 hours">
          <LineChart
            axisLabel="Views (No.)"
            stroke="#D4AF37"
            data={weeklyData.map((item) => ({
              label: item.label,
              value: item.productViews,
            }))}
          />
        </ChartCard>
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
