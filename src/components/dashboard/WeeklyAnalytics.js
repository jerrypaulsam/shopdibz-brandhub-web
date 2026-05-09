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
      <h2 className="text-center text-lg font-extrabold text-brand-white">
        Store Weekly Orders & Revenue
      </h2>
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
