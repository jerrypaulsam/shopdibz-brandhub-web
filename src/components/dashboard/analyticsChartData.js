/**
 * @param {any} value
 * @returns {number}
 */
function toNumber(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

/**
 * @param {string | Date} value
 * @returns {string}
 */
export function formatAnalyticsDate(value) {
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

/**
 * @param {string} start
 * @param {string} end
 * @param {{ multiline?: boolean }} [options]
 * @returns {string}
 */
export function formatAnalyticsRange(start, end, options = {}) {
  const separator = options.multiline ? "\nto\n" : " to ";
  return `${formatAnalyticsDate(start)}${separator}${formatAnalyticsDate(end)}`;
}

/**
 * @param {any[]} dailyVisits
 * @param {number|string} currentDailyVisits
 * @returns {Array<{ label: string, value: number }>}
 */
export function buildDailyVisitChartData(dailyVisits = [], currentDailyVisits = 0) {
  return [
    ...dailyVisits.map((item) => ({
      label: formatAnalyticsDate(item?.date || item?.createdAt || item?.day),
      value: toNumber(item?.visits ?? item?.visit ?? item?.count ?? item?.dVisits),
    })),
    {
      label: "Today",
      value: toNumber(currentDailyVisits),
    },
  ].filter((item, index, list) => item.value > 0 || index === list.length - 1);
}

/**
 * @param {any[]} analytics
 * @param {{ multilineLabel?: boolean }} [options]
 * @returns {Array<{ label: string, orders: number, earned: number, productViews: number }>}
 */
export function buildWeeklyAnalyticsChartData(analytics = [], options = {}) {
  return analytics.map((item) => ({
    label: formatAnalyticsRange(item?.sDate || item?.startDate, item?.eDate || item?.endDate, {
      multiline: options.multilineLabel,
    }),
    orders: toNumber(item?.orders ?? item?.orderCount),
    earned: toNumber(item?.earned ?? item?.revenue ?? item?.amount),
    productViews: toNumber(
      item?.productViews ?? item?.prdViews ?? item?.product_views ?? item?.prdtViews,
    ),
  }));
}
