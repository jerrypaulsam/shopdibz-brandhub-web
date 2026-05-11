import { getDashboardSession } from "./dashboard";
import { getCachedStoreInfo, getSellerStoreUrl } from "./auth";

function resolveActivitySession() {
  const session = getDashboardSession();
  const storeUrl = getSellerStoreUrl() || getCachedStoreInfo()?.url || session.storeUrl;

  return {
    accessToken: session.accessToken,
    storeUrl,
  };
}

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postActivityJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || data?.error || "Activity request failed");
  }

  return data;
}

/**
 * @param {{ variants: boolean, fileBase64: string, fileName: string }} payload
 * @returns {Promise<any>}
 */
export function bulkUpdateProducts(payload) {
  const session = resolveActivitySession();

  return postActivityJson("/api/activity/bulk-update-products", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {{ month: string, year: string }} payload
 * @returns {Promise<any>}
 */
export function requestMonthlyInvoice(payload) {
  const session = resolveActivitySession();

  return postActivityJson("/api/activity/monthly-invoice", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {{ type: string, fileBase64: string, fileName: string }} payload
 * @returns {Promise<any>}
 */
export function uploadSpecialProducts(payload) {
  const session = resolveActivitySession();

  return postActivityJson("/api/activity/special-products-upload", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {{ type: string }} payload
 * @returns {Promise<any>}
 */
export function removeSpecialProducts(payload) {
  const session = resolveActivitySession();

  return postActivityJson("/api/activity/special-products-remove", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {{ name: string, discountType: string, discount: number, showOnHome: boolean, imageBase64: string, fileName: string }} payload
 * @returns {Promise<any>}
 */
export function createProductGroup(payload) {
  const session = resolveActivitySession();

  return postActivityJson("/api/activity/create-product-group", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}
