import { getDashboardSession, fetchStoreInfo } from "./dashboard";

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postAdsJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || data?.error || "Campaign request failed");
  }

  return data;
}

/**
 * @param {string} url
 * @param {{ query?: Record<string, string | number>, accessToken?: string }} options
 * @returns {Promise<any>}
 */
async function getAdsJson(url, options = {}) {
  const search = new URLSearchParams();

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const response = await fetch(`${url}${search.toString() ? `?${search.toString()}` : ""}`, {
    headers: options.accessToken
      ? {
          Authorization: `Bearer ${options.accessToken}`,
        }
      : undefined,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || data?.error || "Campaign request failed");
  }

  return data;
}

/**
 * @param {{ status: string, page: number }} payload
 * @returns {Promise<any>}
 */
export function fetchAdCampaigns(payload) {
  const session = getDashboardSession();

  return getAdsJson("/api/ads/list", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
      status: payload.status,
      page: payload.page,
    },
  });
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
export function createAdCampaign(payload) {
  const session = getDashboardSession();

  return postAdsJson("/api/ads/create", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
export function updateAdCampaign(payload) {
  const session = getDashboardSession();

  return postAdsJson("/api/ads/update", {
    accessToken: session.accessToken,
    ...payload,
  });
}

/**
 * @param {{ campaignId: number, status: string }} payload
 * @returns {Promise<any>}
 */
export function updateAdCampaignStatus(payload) {
  const session = getDashboardSession();

  return postAdsJson("/api/ads/update-status", {
    accessToken: session.accessToken,
    ...payload,
  });
}

/**
 * @param {number} campaignId
 * @returns {Promise<any>}
 */
export function fetchCampaignInvoice(campaignId) {
  const session = getDashboardSession();

  return getAdsJson("/api/ads/invoice", {
    accessToken: session.accessToken,
    query: {
      campaignId,
    },
  });
}

export function fetchAdsStoreInfo() {
  return fetchStoreInfo();
}
