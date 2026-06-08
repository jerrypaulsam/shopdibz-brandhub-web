const ANALYTICS_DEDUPE_WINDOW_MS = 1500;

let lastPageView = {
  signature: "",
  timestamp: 0,
};

let lastScreenView = {
  signature: "",
  timestamp: 0,
};

const DEFAULT_CURRENCY = "INR";

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
 * @param {string} eventName
 * @param {Record<string, any>} [params]
 */
function trackGoogleEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, params);
}

/**
 * @param {"track" | "trackCustom"} method
 * @param {string} eventName
 * @param {Record<string, any>} [params]
 */
function trackMetaEvent(method, eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  window.fbq(method, eventName, params);
}

/**
 * @param {string} eventName
 * @param {Record<string, any>} [params]
 */
function trackClarityEvent(eventName, params = {}) {
  if (typeof window === "undefined" || typeof window.clarity !== "function") {
    return;
  }

  window.clarity("event", eventName);

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    window.clarity("set", key, String(value));
  });
}

/**
 * @param {string} measurementId
 * @param {string} url
 */
export function trackPageView(measurementId, url) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedPath = normalizeAnalyticsPath(url || window.location.pathname);
  const signature = normalizedPath;

  if (isDuplicateAnalyticsEvent(signature, lastPageView)) {
    return;
  }

  if (measurementId && typeof window.gtag === "function") {
    window.gtag("config", measurementId, {
      page_path: normalizedPath,
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }

  if (typeof window.clarity === "function") {
    window.clarity("set", "page_path", normalizedPath);
    window.clarity("event", "page_view");
  }
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

/**
 * @param {{ method?: string }} [options]
 */
export function trackSignupComplete(options = {}) {
  const method = String(options.method || "seller_email").trim();

  trackGoogleEvent("sign_up", {
    method,
  });
  trackMetaEvent("track", "CompleteRegistration");
  trackClarityEvent("signup_completed", {
    method,
  });
}

/**
 * @param {{ method?: string }} [options]
 */
export function trackLoginComplete(options = {}) {
  const method = String(options.method || "seller_email").trim();

  trackGoogleEvent("login", {
    method,
  });
  trackMetaEvent("trackCustom", "Login", {
    method,
  });
  trackClarityEvent("login_completed", {
    method,
  });
}

/**
 * @param {{
 *   storeUrl?: string,
 *   orderId?: string,
 *   value?: number,
 *   currency?: string,
 * }} [options]
 */
export function trackOnboardingPaid(options = {}) {
  const storeUrl = String(options.storeUrl || "").trim();
  const orderId = String(options.orderId || "").trim();
  const numericValue = Number(options.value || 0);
  const currency = String(options.currency || DEFAULT_CURRENCY).trim() || DEFAULT_CURRENCY;
  const payload = {
    currency,
    value: numericValue > 0 ? numericValue : undefined,
    transaction_id: orderId || undefined,
    item_category: "onboarding",
    item_name: "Brand Hub Onboarding",
    store_url: storeUrl || undefined,
  };

  trackGoogleEvent("purchase", payload);
  trackMetaEvent("track", "Purchase", {
    currency,
    value: numericValue > 0 ? numericValue : undefined,
    content_name: "Brand Hub Onboarding",
    content_category: "onboarding",
  });
  trackClarityEvent("onboarding_paid", {
    store_url: storeUrl,
    order_id: orderId,
    currency,
    value: numericValue > 0 ? numericValue : "",
  });
}

/**
 * @param {{
 *   storeUrl?: string,
 *   planCode?: string,
 *   planName?: string,
 *   value?: number,
 *   currency?: string,
 *   subscriptionId?: string,
 * }} [options]
 */
export function trackSubscriptionPaid(options = {}) {
  const storeUrl = String(options.storeUrl || "").trim();
  const planCode = String(options.planCode || "").trim().toUpperCase();
  const planName = String(options.planName || "Subscription Plan").trim();
  const subscriptionId = String(options.subscriptionId || "").trim();
  const numericValue = Number(options.value || 0);
  const currency = String(options.currency || DEFAULT_CURRENCY).trim() || DEFAULT_CURRENCY;
  const payload = {
    currency,
    value: numericValue > 0 ? numericValue : undefined,
    transaction_id: subscriptionId || undefined,
    item_category: "subscription",
    item_name: planName,
    plan_code: planCode || undefined,
    store_url: storeUrl || undefined,
  };

  trackGoogleEvent("purchase", payload);
  trackMetaEvent("track", "Subscribe", {
    currency,
    value: numericValue > 0 ? numericValue : undefined,
    content_name: planName,
    content_category: "subscription",
  });
  trackClarityEvent("subscription_paid", {
    store_url: storeUrl,
    plan_code: planCode,
    plan_name: planName,
    subscription_id: subscriptionId,
    currency,
    value: numericValue > 0 ? numericValue : "",
  });
}

/**
 * @param {{
 *   storeUrl?: string,
 *   orderId?: string,
 *   value?: number,
 *   currency?: string,
 * }} [options]
 */
export function trackAdWalletRechargePaid(options = {}) {
  const storeUrl = String(options.storeUrl || "").trim();
  const orderId = String(options.orderId || "").trim();
  const numericValue = Number(options.value || 0);
  const currency = String(options.currency || DEFAULT_CURRENCY).trim() || DEFAULT_CURRENCY;
  const payload = {
    currency,
    value: numericValue > 0 ? numericValue : undefined,
    transaction_id: orderId || undefined,
    item_category: "ad_wallet",
    item_name: "Ad Wallet Recharge",
    store_url: storeUrl || undefined,
  };

  trackGoogleEvent("purchase", payload);
  trackMetaEvent("track", "Purchase", {
    currency,
    value: numericValue > 0 ? numericValue : undefined,
    content_name: "Ad Wallet Recharge",
    content_category: "ad_wallet",
  });
  trackClarityEvent("ad_wallet_recharge_paid", {
    store_url: storeUrl,
    order_id: orderId,
    currency,
    value: numericValue > 0 ? numericValue : "",
  });
}
