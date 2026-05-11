import { cacheStoreInfo, getAuthSession, getCachedStoreInfo } from "./auth";

/**
 * @typedef {Object} DashboardSession
 * @property {string} accessToken
 * @property {string} storeUrl
 */

/**
 * @returns {DashboardSession}
 */
export function getDashboardSession() {
  const session = getAuthSession();
  const cachedStore = getCachedStoreInfo();

  return {
    accessToken: session?.data?.access || session?.access || "",
    storeUrl:
      session?.user?.storeUrl ||
      session?.user?.store_url ||
      session?.storeUrl ||
      cachedStore?.url ||
      "",
  };
}

/**
 * @param {string} url
 * @param {Record<string, string | number>} params
 * @returns {Promise<any>}
 */
async function getDashboardJson(url, params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  const response = await fetch(`${url}?${query.toString()}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Dashboard request failed");
  }

  return data;
}

export function fetchStoreInfo() {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/store-info", session).then((data) => {
    cacheStoreInfo(data);
    return data;
  });
}

/**
 * @param {string} status
 * @param {number} page
 */
export function fetchOrders(status = "AC", page = 1) {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/orders", {
    ...session,
    status,
    page,
  });
}

export function fetchManagers() {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/managers", session);
}

export function fetchWeeklyAnalytics() {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/weekly-analytics", {
    ...session,
    page: 1,
  });
}

export function fetchDailyVisits() {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/daily-visits", {
    ...session,
    page: 1,
  });
}
