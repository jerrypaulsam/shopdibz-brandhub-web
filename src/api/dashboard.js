import { cacheStoreInfo, getAuthSession, getCachedStoreInfo } from "./auth";
import { resolveApiErrorMessage } from "./error";

const STORE_INFO_CACHE_MS = 1500;
let storeInfoCache = {
  key: "",
  expiresAt: 0,
  data: null,
};
let storeInfoRequest = {
  key: "",
  promise: null,
};

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
  const cacheKey = `${session.accessToken}:${session.storeUrl}`;
  const now = Date.now();

  if (
    storeInfoCache.key === cacheKey
    && storeInfoCache.data
    && storeInfoCache.expiresAt > now
  ) {
    return Promise.resolve(storeInfoCache.data);
  }

  if (storeInfoRequest.key === cacheKey && storeInfoRequest.promise) {
    return storeInfoRequest.promise;
  }

  const request = getDashboardJson("/api/dashboard/store-info", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
    },
  }).then((data) => {
    cacheStoreInfo(data);
    storeInfoCache = {
      key: cacheKey,
      expiresAt: Date.now() + STORE_INFO_CACHE_MS,
      data,
    };
    return data;
  });

  storeInfoRequest = {
    key: cacheKey,
    promise: request,
  };

  return request.finally(() => {
    if (storeInfoRequest.key === cacheKey) {
      storeInfoRequest = {
        key: "",
        promise: null,
      };
    }
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
