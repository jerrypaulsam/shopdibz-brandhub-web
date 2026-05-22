import { fetchStoreInfo, getDashboardSession } from "./dashboard";
import {
  cacheStoreInfo,
  getAccessToken,
  getCachedStoreInfo,
  getSessionCachedStoreInfo,
  updateAuthSession,
} from "./auth";
import { resolveApiErrorMessage } from "./error";
import { invalidateSellerAccessCache } from "@/src/utils/sellerAccess";

const SESSION_BANNER_IMAGES_STORAGE_KEY = "shopdibz_session_banner_images";
let bannerImagesCache = {
  key: "",
  data: null,
};
let bannerImagesRequest = {
  key: "",
  promise: null,
};

function invalidateBannerImagesCache() {
  bannerImagesCache = {
    key: "",
    data: null,
  };
  bannerImagesRequest = {
    key: "",
    promise: null,
  };

  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(SESSION_BANNER_IMAGES_STORAGE_KEY);
  }
}

/**
 * @returns {{ key: string, data: any } | null}
 */
function getSessionBannerImagesCache() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(SESSION_BANNER_IMAGES_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {any} data
 */
function cacheSessionBannerImages(key, data) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    SESSION_BANNER_IMAGES_STORAGE_KEY,
    JSON.stringify({
      key,
      data,
    }),
  );
}

/**
 * @param {string} url
 * @param {{ method?: string, payload?: Record<string, unknown> }} [options]
 * @returns {Promise<any>}
 */
async function requestStoreJson(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.payload ? JSON.stringify(options.payload) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      resolveApiErrorMessage({
        status: response.status,
        data,
        fallback: "Store request failed",
        notFound: "Store data unavailable.",
        paymentRequired: "Please upgrade your plan to continue.",
      }),
    );
  }

  return data;
}

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postStoreJson(url, payload) {
  return requestStoreJson(url, {
    method: "POST",
    payload,
  });
}

export function verifyGstNumber(gstn) {
  return postStoreJson("/api/store/verify-gst", { gstn });
}

export function createStore(payload) {
  return postStoreJson("/api/store/create", {
    accessToken: getAccessToken(),
    ...payload,
  }).then((data) => {
    invalidateSellerAccessCache();
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
    invalidateSellerAccessCache();
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

export function deleteSizeChart() {
  const session = getDashboardSession();
  return requestStoreJson("/api/store/update-size-chart", {
    method: "DELETE",
    payload: {
      accessToken: session.accessToken,
      storeUrl: session.storeUrl,
    },
  });
}

/**
 * @param {{ base64: string, filename: string }} payload
 * @returns {Promise<any>}
 */
export function uploadFounderWelcomeMessage(payload) {
  const session = getDashboardSession();
  return postStoreJson("/api/store/upload-welcome-voice", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    audioBase64: payload.base64,
    filename: payload.filename,
  });
}

/**
 * @returns {Promise<any>}
 */
export function deleteFounderWelcomeMessage() {
  const session = getDashboardSession();
  return postStoreJson("/api/store/delete-welcome-voice", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
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
  const cachedStore = getSessionCachedStoreInfo() || getCachedStoreInfo();

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
 * @returns {Promise<any>}
 */
export function markStoreNotificationsRead() {
  const session = getDashboardSession();

  return postStoreJson("/api/store/notifications-read-status", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  }).then((data) => {
    const cachedStore = getSessionCachedStoreInfo() || getCachedStoreInfo();

    if (cachedStore) {
      cacheStoreInfo({
        ...cachedStore,
        notiSts: false,
      });
    }

    return data;
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
  const cacheKey = `${session.accessToken}:${session.storeUrl}`;
  const sessionBannerImagesCache = getSessionBannerImagesCache();

  if (
    sessionBannerImagesCache?.key === cacheKey &&
    sessionBannerImagesCache.data
  ) {
    return Promise.resolve(sessionBannerImagesCache.data);
  }

  if (
    bannerImagesCache.key === cacheKey
    && bannerImagesCache.data
  ) {
    return Promise.resolve(bannerImagesCache.data);
  }

  if (bannerImagesRequest.key === cacheKey && bannerImagesRequest.promise) {
    return bannerImagesRequest.promise;
  }

  const request = postStoreJson("/api/store/banner-images", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  });

  bannerImagesRequest = {
    key: cacheKey,
    promise: request,
  };

  return request
    .then((data) => {
      bannerImagesCache = {
        key: cacheKey,
        data,
      };
      cacheSessionBannerImages(cacheKey, data);
      return data;
    })
    .finally(() => {
      if (bannerImagesRequest.key === cacheKey) {
        bannerImagesRequest = {
          key: "",
          promise: null,
        };
      }
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
  }).then((data) => {
    invalidateBannerImagesCache();
    return data;
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
  }).then((data) => {
    invalidateBannerImagesCache();
    return data;
  });
}

/**
 * @param {number} bannerId
 * @returns {Promise<any>}
 */
export function deleteStoreBanner(bannerId) {
  const session = getDashboardSession();

  return postStoreJson("/api/store/delete-banner", {
    accessToken: session.accessToken,
    bannerId,
  }).then((data) => {
    invalidateBannerImagesCache();
    return data;
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
