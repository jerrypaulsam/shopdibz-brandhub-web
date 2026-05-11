import { fetchStoreInfo, getDashboardSession } from "./dashboard";
import {
  cacheStoreInfo,
  getAccessToken,
  getCachedStoreInfo,
  updateAuthSession,
} from "./auth";

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
  }).then((data) => {
    updateAuthSession({
      storeCreated: true,
      verified: false,
      user: {
        cre: true,
        ver: false,
      },
    });

    return data;
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

    const cachedStore = getCachedStoreInfo();
    if (cachedStore) {
      cacheStoreInfo({
        ...cachedStore,
        name: payload.name,
        url: payload.storeUrl || cachedStore.url,
        email: payload.storeEmail,
        link1: payload.link1,
        link2: payload.link2,
        cntNo: payload.contactNo,
        desc: payload.description,
        adrs: payload.address,
        city: payload.city,
        pCode: payload.pinCode,
        state: payload.state,
        active: payload.active,
        shType: payload.shipType,
        mode: payload.shipMode,
        resell: payload.enableResell,
        video: payload.storeVideo,
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

export function updateSizeChart(payload) {
  const session = getDashboardSession();
  return postStoreJson("/api/store/update-size-chart", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    chartBase64: payload.base64,
    filename: payload.filename,
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
  const cachedStore = getCachedStoreInfo();

  if (!session.storeUrl && cachedStore) {
    return Promise.resolve(cachedStore);
  }

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

/**
 * @param {{ bannerId: number, imageBase64: string, productGroupSlug: string, link?: string }} payload
 * @returns {Promise<any>}
 */
export function updateStoreBanner(payload) {
  const session = getDashboardSession();

  return postStoreJson("/api/store/update-banner", {
    accessToken: session.accessToken,
    bannerId: payload.bannerId,
    imageBase64: payload.imageBase64,
    productGroupSlug: payload.productGroupSlug,
    link: payload.link || "",
  });
}

/**
 * @param {{ url: string, access: string }} payload
 * @returns {Promise<any>}
 */
export function connectShopifyStore(payload) {
  const session = getDashboardSession();

  return postStoreJson("/api/store/connect-shopify", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    url: payload.url,
    access: payload.access,
  });
}

/**
 * @returns {Promise<any>}
 */
export function disconnectShopifyStore() {
  const session = getDashboardSession();

  return postStoreJson("/api/store/disconnect-shopify", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  });
}

/**
 * @returns {Promise<any>}
 */
export function syncShopifyStore() {
  const session = getDashboardSession();

  return postStoreJson("/api/store/sync-shopify", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  });
}

/**
 * @param {{ url: string, key: string, secret: string }} payload
 * @returns {Promise<any>}
 */
export function connectWooCommerceStore(payload) {
  const session = getDashboardSession();

  return postStoreJson("/api/store/connect-woocommerce", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    url: payload.url,
    key: payload.key,
    secret: payload.secret,
  });
}

/**
 * @returns {Promise<any>}
 */
export function disconnectWooCommerceStore() {
  const session = getDashboardSession();

  return postStoreJson("/api/store/disconnect-woocommerce", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  });
}

/**
 * @returns {Promise<any>}
 */
export function syncWooCommerceStore() {
  const session = getDashboardSession();

  return postStoreJson("/api/store/sync-woocommerce", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  });
}
