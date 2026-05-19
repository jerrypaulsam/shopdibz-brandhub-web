const ANALYTICS_DEDUPE_WINDOW_MS = 1500;

let lastPageView = {
  signature: "",
  timestamp: 0,
};

let lastScreenView = {
  signature: "",
  timestamp: 0,
};

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeAnalyticsPath(value) {
  const resolved = String(value || "").trim();
  const withoutHash = resolved.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];

  return withoutQuery || "/";
}

/**
 * @param {string} signature
 * @param {{ signature: string, timestamp: number }} cache
 * @returns {boolean}
 */
function isDuplicateAnalyticsEvent(signature, cache) {
  const timestamp = Date.now();
  const isDuplicate =
    cache.signature === signature &&
    timestamp - cache.timestamp < ANALYTICS_DEDUPE_WINDOW_MS;

  cache.signature = signature;
  cache.timestamp = timestamp;

  return isDuplicate;
}

/**
 * @param {string} measurementId
 * @param {string} url
 */
export function trackPageView(measurementId, url) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const normalizedPath = normalizeAnalyticsPath(url || window.location.pathname);
  const signature = `${measurementId}:${normalizedPath}`;

  if (isDuplicateAnalyticsEvent(signature, lastPageView)) {
    return;
  }

  window.gtag("config", measurementId, {
    page_path: normalizedPath,
  });
}

/**
 * @param {string} screenName
 * @param {string} value
 * @param {string} key
 */
export function logScreenView(screenName, value, key) {
  if (typeof window === "undefined") {
    return;
  }

  const signature = `${screenName}:${key}:${String(value || "")}`;

  if (isDuplicateAnalyticsEvent(signature, lastScreenView)) {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "screen_view", {
      firebase_screen: screenName,
      [key]: value,
    });
    return;
  }

  window.dispatchEvent(
    new CustomEvent("shopdibz:screen-view", {
      detail: {
        screenName,
        [key]: value,
      },
    }),
  );
}
