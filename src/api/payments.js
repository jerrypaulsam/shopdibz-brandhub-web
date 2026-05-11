import { getDashboardSession, fetchStoreInfo } from "./dashboard";
import { getCachedStoreInfo, getSellerStoreUrl } from "./auth";

/**
 * @param {string} url
 * @param {{ query?: Record<string, string | number>, accessToken?: string }} options
 * @returns {Promise<any>}
 */
async function getPaymentJson(url, options = {}) {
  const search = new URLSearchParams();

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const queryString = search.toString();
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
  const storeUrl = getSellerStoreUrl() || getCachedStoreInfo()?.url || session.storeUrl;

  return getPaymentJson("/api/payments/list", {
    accessToken: session.accessToken,
    query: {
      storeUrl,
      page: payload.page,
    },
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
    query: {
      paymentId,
    },
  });
}

export function fetchPaymentsStoreInfo() {
  return fetchStoreInfo();
}
