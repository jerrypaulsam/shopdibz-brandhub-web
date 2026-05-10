import { getDashboardSession, fetchStoreInfo } from "./dashboard";

/**
 * @param {string} url
 * @param {Record<string, string | number>} query
 * @returns {Promise<any>}
 */
async function getPaymentJson(url, query) {
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
      data?.message || data?.detail || data?.error || "Payment request failed",
    );
  }

  return data;
}

/**
 * @param {{ page: number }} payload
 * @returns {Promise<any>}
 */
export function fetchPaymentList(payload) {
  const session = getDashboardSession();

  return getPaymentJson("/api/payments/list", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    page: payload.page,
  });
}

/**
 * @param {number} paymentId
 * @returns {Promise<any>}
 */
export function fetchPaymentBreakdown(paymentId) {
  const session = getDashboardSession();

  return getPaymentJson("/api/payments/breakdown", {
    accessToken: session.accessToken,
    paymentId,
  });
}

export function fetchPaymentsStoreInfo() {
  return fetchStoreInfo();
}
