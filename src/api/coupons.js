import { getDashboardSession } from "./dashboard";

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postCouponJson(url, payload) {
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
      data?.message || data?.detail || data?.error || "Coupon request failed",
    );
  }

  return data;
}

/**
 * @param {string} url
 * @param {Record<string, string | number>} query
 * @returns {Promise<any>}
 */
async function getCouponJson(url, query) {
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
      data?.message || data?.detail || data?.error || "Coupon request failed",
    );
  }

  return data;
}

export function fetchCoupons() {
  const session = getDashboardSession();

  return getCouponJson("/api/coupons/list", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  });
}

/**
 * @param {{ couponCode: string, type: string, minAmount: string, discountAmount?: string, validFrom: string, validTo: string, quantity: string, percentage?: string, maxDiscountAmount?: string }} payload
 * @returns {Promise<any>}
 */
export function createCoupon(payload) {
  const session = getDashboardSession();

  return postCouponJson("/api/coupons/create", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {number} couponId
 * @returns {Promise<any>}
 */
export function deleteCoupon(couponId) {
  const session = getDashboardSession();

  return postCouponJson("/api/coupons/delete", {
    accessToken: session.accessToken,
    couponId,
  });
}
