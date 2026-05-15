import { getDashboardSession } from "./dashboard";
import { getCachedStoreInfo, getSellerStoreUrl } from "./auth";
import { resolveApiErrorMessage } from "./error";

/**
 * @param {string} url
 * @param {{ payload?: Record<string, unknown>, accessToken?: string }} options
 * @returns {Promise<any>}
 */
async function postOrderJson(url, options = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.accessToken
        ? {
            Authorization: `Bearer ${options.accessToken}`,
          }
        : {}),
    },
    body: JSON.stringify(options.payload || {}),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      resolveApiErrorMessage({
        status: response.status,
        data,
        fallback: "Order request failed",
        notFound: "Order details unavailable.",
      }),
    );
  }

  return data;
}

/**
 * @param {string} url
 * @param {{ query?: Record<string, string | number>, accessToken?: string }} options
 * @returns {Promise<any>}
 */
async function getOrderJson(url, options = {}) {
  const search = new URLSearchParams();

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const queryString = search.toString();
  // console.log(url+queryString);

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
        fallback: "Order request failed",
        notFound: "Order details unavailable.",
      }),
    );
  }

  return data;
}

/**
 * @param {{ tab: string, page: number }} payload
 * @returns {Promise<any>}
 */
export function fetchOrderList(payload) {
  const session = getDashboardSession();
  const storeUrl =
    getSellerStoreUrl() || getCachedStoreInfo()?.url || session.storeUrl;

  return getOrderJson("/api/orders/list", {
    accessToken: session.accessToken,
    query: {
      storeUrl,
      tab: payload.tab,
      page: payload.page,
    },
  });
}

/**
 * @param {number | string} orderId
 * @returns {Promise<any>}
 */
export function fetchOrderDetail(orderId) {
  const session = getDashboardSession();

  return getOrderJson("/api/orders/detail", {
    accessToken: session.accessToken,
    query: {
      orderId,
    },
  });
}

/**
 * @param {{ orderId: number, reasonId: number, detail: string }} payload
 * @returns {Promise<any>}
 */
export function cancelOrder(payload) {
  const session = getDashboardSession();

  return postOrderJson("/api/orders/cancel", {
    accessToken: session.accessToken,
    payload,
  });
}

/**
 * @param {{ orderId: number, packageWidth: number, packageLength: number, packageHeight: number, packageWeight: number }} payload
 * @returns {Promise<any>}
 */
export function markOrderPacked(payload) {
  const session = getDashboardSession();

  return postOrderJson("/api/orders/packed", {
    accessToken: session.accessToken,
    payload,
  });
}

/**
 * @param {{ orderId: number, status: string }} payload
 * @returns {Promise<any>}
 */
export function updateOrderStatus(payload) {
  const session = getDashboardSession();

  return postOrderJson("/api/orders/update-status", {
    accessToken: session.accessToken,
    payload,
  });
}

/**
 * @param {{ orderId: number, company: string, trackingNo: string, trackingUrl?: string }} payload
 * @returns {Promise<any>}
 */
export function updateOrderTracking(payload) {
  const session = getDashboardSession();

  return postOrderJson("/api/orders/update-tracking", {
    accessToken: session.accessToken,
    payload,
  });
}

/**
 * @param {number} orderId
 * @returns {Promise<any>}
 */
export function fetchOrderInvoice(orderId) {
  const session = getDashboardSession();
  const storeUrl =
    getSellerStoreUrl() || getCachedStoreInfo()?.url || session.storeUrl;

  return getOrderJson("/api/orders/invoice", {
    accessToken: session.accessToken,
    query: {
      storeUrl,
      orderId,
    },
  });
}

/**
 * @param {number} orderId
 * @returns {Promise<any>}
 */
export function fetchOrderShippingLabel(orderId) {
  const session = getDashboardSession();
  const storeUrl =
    getSellerStoreUrl() || getCachedStoreInfo()?.url || session.storeUrl;

  return getOrderJson("/api/orders/shipping-label", {
    accessToken: session.accessToken,
    query: {
      storeUrl,
      orderId,
    },
  });
}

/**
 * @param {{ orderId: number, userCode: string, message: string }} payload
 * @returns {Promise<any>}
 */
export function sendOrderMessage(payload) {
  const session = getDashboardSession();
  const storeUrl =
    getSellerStoreUrl() || getCachedStoreInfo()?.url || session.storeUrl;

  return postOrderJson("/api/orders/send-message", {
    accessToken: session.accessToken,
    payload: {
      storeUrl,
      ...payload,
    },
  });
}

/**
 * @param {{ page: number }} payload
 * @returns {Promise<any>}
 */
export function fetchPenaltyReasons(payload) {
  const session = getDashboardSession();
  const storeUrl =
    getSellerStoreUrl() || getCachedStoreInfo()?.url || session.storeUrl;

  return getOrderJson("/api/orders/penalty-reasons", {
    accessToken: session.accessToken,
    query: {
      storeUrl,
      page: payload.page,
    },
  });
}
