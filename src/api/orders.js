import { getDashboardSession } from "./dashboard";

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postOrderJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || data?.error || "Order request failed",
    );
  }

  return data;
}

/**
 * @param {string} url
 * @param {Record<string, string | number>} query
 * @returns {Promise<any>}
 */
async function getOrderJson(url, query) {
  const search = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const response = await fetch(`${url}?${search.toString()}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || data?.error || "Order request failed",
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

  return getOrderJson("/api/orders/list", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    tab: payload.tab,
    page: payload.page,
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
    orderId,
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
    ...payload,
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
    ...payload,
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
    ...payload,
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
    ...payload,
  });
}

/**
 * @param {number} orderId
 * @returns {Promise<any>}
 */
export function fetchOrderInvoice(orderId) {
  const session = getDashboardSession();

  return getOrderJson("/api/orders/invoice", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    orderId,
  });
}

/**
 * @param {{ orderId: number, userCode: string, message: string }} payload
 * @returns {Promise<any>}
 */
export function sendOrderMessage(payload) {
  const session = getDashboardSession();

  return postOrderJson("/api/orders/send-message", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {{ page: number }} payload
 * @returns {Promise<any>}
 */
export function fetchPenaltyReasons(payload) {
  const session = getDashboardSession();

  return getOrderJson("/api/orders/penalty-reasons", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    page: payload.page,
  });
}
