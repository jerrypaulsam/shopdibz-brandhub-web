import { fetchStoreInfo, getDashboardSession } from "./dashboard";
import { getAccessToken, updateAuthSession } from "./auth";

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postStoreJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Store request failed");
  }

  return data;
}

export function verifyGstNumber(gstn) {
  return postStoreJson("/api/store/verify-gst", { gstn });
}

export function createStore(payload) {
  return postStoreJson("/api/store/create", {
    accessToken: getAccessToken(),
    ...payload,
  });
}

export function updateStoreInfo(payload) {
  return postStoreJson("/api/store/update-info", {
    accessToken: getAccessToken(),
    ...payload,
  }).then((data) => {
    if (payload.storeUrl) {
      updateAuthSession({
        storeUrl: payload.storeUrl,
        user: {
          storeUrl: payload.storeUrl,
        },
      });
    }

    return data;
  });
}

export function updateStoreLogo(logoBase64) {
  const session = getDashboardSession();
  return postStoreJson("/api/store/update-logo", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    logoBase64,
  });
}

export function updateSizeChart(chartBase64) {
  const session = getDashboardSession();
  return postStoreJson("/api/store/update-size-chart", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    chartBase64,
  });
}

export function updateStoreTheme(themeId) {
  return postStoreJson("/api/store/update-theme", {
    accessToken: getAccessToken(),
    themeId,
  });
}

export function fetchEditableStoreInfo() {
  const session = getDashboardSession();

  if (!session.storeUrl) {
    return Promise.resolve(null);
  }

  return fetchStoreInfo();
}

export function checkStoreVerification() {
  return fetch("/api/store/check-verification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: getAccessToken(),
    }),
  }).then(async (response) => ({
    status: response.status,
    data: await response.json().catch(() => ({})),
  }));
}

/**
 * @param {number} [page]
 * @returns {Promise<any>}
 */
export function fetchNotifications(page = 1) {
  const session = getDashboardSession();

  return postStoreJson("/api/store/notifications", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    page,
  });
}

/**
 * @param {number} [page]
 * @returns {Promise<any>}
 */
export function fetchStoreReviews(page = 1) {
  const session = getDashboardSession();

  return postStoreJson("/api/store/reviews", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    page,
  });
}

/**
 * @param {{ reviewId: number, vote: string }} payload
 * @returns {Promise<any>}
 */
export function voteStoreReview(payload) {
  const session = getDashboardSession();

  return postStoreJson("/api/store/review-vote", {
    accessToken: session.accessToken,
    reviewId: payload.reviewId,
    vote: payload.vote,
  });
}

/**
 * @returns {Promise<any>}
 */
export function fetchProductGroups() {
  const session = getDashboardSession();

  return postStoreJson("/api/store/product-groups", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    page: 1,
  });
}

/**
 * @returns {Promise<any>}
 */
export function fetchBannerImages() {
  const session = getDashboardSession();

  return postStoreJson("/api/store/banner-images", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  });
}

/**
 * @param {{ forMobile: boolean, images: string[], productGroupSlugs: string[], links: string[] }} payload
 * @returns {Promise<any>}
 */
export function addStoreBanners(payload) {
  const session = getDashboardSession();

  return postStoreJson("/api/store/add-banners", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}
