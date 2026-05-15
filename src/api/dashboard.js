import { cacheStoreInfo, getAuthSession, getCachedStoreInfo } from "./auth";
import { resolveApiErrorMessage } from "./error";

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
 * @param {{ query?: Record<string, string | number>, accessToken?: string }} options
 * @returns {Promise<any>}
 */
async function getDashboardJson(url, options = {}) {
  const query = new URLSearchParams();

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  const response = await fetch(`${url}${queryString ? `?${queryString}` : ""}`, {
    headers: options.accessToken
      ? {
          Authorization: `Bearer ${options.accessToken}`,
        }
      : undefined,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      resolveApiErrorMessage({
        status: response.status,
        data,
        fallback: "Dashboard request failed",
        notFound: "Dashboard data unavailable.",
      }),
    );
  }

  return data;
}

export function fetchStoreInfo() {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/store-info", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
    },
  }).then((data) => {
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
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
      status,
      page,
    },
  });
}

export function fetchManagers() {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/managers", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
    },
  });
}

export function fetchWeeklyAnalytics() {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/weekly-analytics", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
      page: 1,
    },
  });
}

export function fetchDailyVisits() {
  const session = getDashboardSession();

  return getDashboardJson("/api/dashboard/daily-visits", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
      page: 1,
    },
  });
}
