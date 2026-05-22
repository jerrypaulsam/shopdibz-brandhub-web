/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 * @property {string} [loc]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {number} statusCode
 * @property {unknown} data
 */

export const AUTH_STORAGE_KEY = "shopdibz_seller_auth";
export const MOBILE_VERIFY_STORAGE_KEY = "shopdibz_mobile_verified";
export const STORE_INFO_STORAGE_KEY = "shopdibz_store_info";
export const SESSION_STORE_INFO_STORAGE_KEY = "shopdibz_session_store_info";
export const ONBOARDING_PAYMENT_PENDING_STORAGE_KEY = "shopdibz_onboarding_payment_pending";
export const AUTH_SESSION_EVENT = "shopdibz:auth-session-change";
const SELLER_ACCESS_SESSION_CACHE_KEY = "shopdibz_seller_access_resolution";

/**
 * @returns {Promise<string>}
 */
export async function getBrowserLocation() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return "";
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(`${position.coords.latitude},${position.coords.longitude}`);
      },
      () => resolve(""),
      {
        enableHighAccuracy: false,
        maximumAge: 300000,
        timeout: 3000,
      },
    );
  });
}

/**
 * @param {LoginPayload} payload
 * @returns {Promise<AuthResponse>}
 */
export async function loginSeller(payload) {
  return postAuthJson("/api/auth/login", payload);
}

/**
 * @param {{ email: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function requestForgotPasswordOtp(payload) {
  return postAuthJson("/api/auth/forgot-password", payload);
}

/**
 * @param {{ email: string, otp: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function verifyForgotPasswordOtp(payload) {
  return postAuthJson("/api/auth/forgot-password-verify", payload);
}

/**
 * @param {{ accessToken: string, refreshToken: string, newPassword: string, confirmPassword: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function resetForgotPassword(payload) {
  return postAuthJson("/api/auth/forgot-password-reset", payload);
}

/**
 * @param {{ email: string, fName: string, lName?: string, password: string, confirmPassword: string, mobile: string, loc?: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function signupSeller(payload) {
  return postAuthJson("/api/auth/signup", payload);
}

/**
 * @param {{ mobile: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function requestInitialMobileOtp(payload) {
  return postAuthJson("/api/auth/mobile-otp", payload);
}

/**
 * @param {{ mobile: string, otp: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function verifyInitialMobileNumber(payload) {
  return postAuthJson("/api/auth/verify-mobile", payload);
}

/**
 * @returns {Promise<AuthResponse>}
 */
export async function requestEmailOtp() {
  return postAuthJson("/api/auth/email-otp", {
    accessToken: getAccessToken(),
  });
}

/**
 * @param {{ otp: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function verifyEmailOtp(payload) {
  return postAuthJson("/api/auth/verify-email", {
    ...payload,
    accessToken: getAccessToken(),
  });
}

/**
 * @returns {Promise<AuthResponse>}
 */
export async function logoutSeller() {
  const authSession = getAuthSession();
  const userCode = authSession?.user?.uCode || authSession?.user?.userCode || "";

  return postAuthJson("/api/auth/logout", {
    userCode,
  });
}

/**
 * @param {{ oldPassword: string, newPassword: string, confirmPassword: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function changeSellerPassword(payload) {
  return postAuthJson("/api/auth/change-password", {
    accessToken: getAccessToken(),
    oldPassword: payload.oldPassword,
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });
}

/**
 * @param {{ fName: string, lName: string, email: string }} payload
 * @returns {Promise<AuthResponse>}
 */
export async function updateSellerAccount(payload) {
  const response = await postAuthJson("/api/auth/update-account", {
    accessToken: getAccessToken(),
    ...payload,
  });

  updateAuthSession({
    user: {
      fName: payload.fName,
      lName: payload.lName,
      email: payload.email,
    },
  });

  return response;
}

/**
 * @param {string} imageBase64
 * @returns {Promise<AuthResponse>}
 */
export async function updateSellerProfilePicture(imageBase64) {
  const response = await postAuthJson("/api/auth/update-profile-picture", {
    accessToken: getAccessToken(),
    imageBase64,
  });

  return response;
}

/**
 * @returns {Promise<boolean>}
 */
export async function checkSellerEmailVerification() {
  const response = await fetch("/api/auth/check-email-verification", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accessToken: getAccessToken(),
    }),
  });

  return response.ok;
}

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<AuthResponse>}
 */
export async function postAuthJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(getAuthErrorMessage(url, response.status, response.statusText, data));
  }

  return {
    statusCode: response.status,
    data,
  };
}

/**
 * @param {string} url
 * @param {number} status
 * @param {string} statusMessage
 * @param {unknown} data
 * @returns {string}
 */
function getAuthErrorMessage(url, status, statusMessage, data) {
  const apiMessage = getApiErrorMessage(data);

  if (apiMessage) {
    return apiMessage;
  }

  if (url === "/api/auth/login") {
    if (status === 401) {
      return statusMessage
        ? `Invalid Credentials : ${statusMessage}`
        : "Invalid Credentials";
    }

    if (status === 404) {
      return "User not found.";
    }

    if (status === 403) {
      return "Forbidden.";
    }

    if (status === 500) {
      return "Something went wrong! Please try again later";
    }

    return "Invalid Credentials";
  }

  if (url === "/api/auth/signup") {
    if (status === 409) {
      return "Account With Email Already Exists.";
    }

    return "BAD REQUEST. CONTACT SUPPORT!";
  }

  if (url === "/api/auth/mobile-otp") {
    if (status === 403) {
      return "Mobile Number Already Exists.";
    }

    return "Oops something went wrong.";
  }

  if (url === "/api/auth/verify-mobile") {
    if (status === 400) {
      return "Mobile Verification Failed. Check OTP or try again.";
    }

    return "Oops something went wrong.";
  }

  if (url === "/api/auth/forgot-password") {
    if (status === 404) {
      return "No account found for this email.";
    }

    if (status === 400) {
      return "Too many OTP requests. Please wait a few minutes and try again.";
    }

    return "Unable to send OTP right now.";
  }

  if (url === "/api/auth/forgot-password-verify") {
    if (status === 403) {
      return "Invalid OTP. Please try again.";
    }

    if (status === 408) {
      return "OTP expired. Please request a new OTP.";
    }

    if (status === 429) {
      return "Too many failed attempts. Please request a new OTP.";
    }

    return "Unable to verify OTP right now.";
  }

  if (url === "/api/auth/forgot-password-reset") {
    if (status === 400) {
      return "Passwords do not match.";
    }

    if (status === 401 || status === 403) {
      return "Reset session expired. Please request a new OTP.";
    }

    return "Unable to reset password right now.";
  }

  return statusMessage || "Request failed";
}

/**
 * @param {unknown} data
 * @returns {string}
 */
function getApiErrorMessage(data) {
  if (typeof data === "string") {
    return sanitizeAuthErrorMessage(data);
  }

  if (!data || typeof data !== "object") {
    return "";
  }

  const message = "message" in data ? data.message : "";
  const detail = "detail" in data ? data.detail : "";

  return sanitizeAuthErrorMessage(String(message || detail || ""));
}

/**
 * @param {string} value
 * @returns {string}
 */
function sanitizeAuthErrorMessage(value) {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return "";
  }

  const lowerValue = normalized.toLowerCase();

  if (
    lowerValue.startsWith("<!doctype html") ||
    lowerValue.startsWith("<html") ||
    lowerValue.includes("<body") ||
    lowerValue.includes("</html>")
  ) {
    return "";
  }

  return normalized.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * @param {unknown} authData
 */
export function saveAuthSession(authData) {
  if (typeof window === "undefined") {
    return;
  }

  const nextSession = normalizeAuthSession(authData);
  const cachedStore = getCachedStoreInfo();

  if (cachedStore?.url && nextSession.storeUrl && cachedStore.url !== nextSession.storeUrl) {
    window.localStorage.removeItem(STORE_INFO_STORAGE_KEY);
    window.sessionStorage.removeItem(SESSION_STORE_INFO_STORAGE_KEY);
  }

  if (!nextSession.storeUrl) {
    window.localStorage.removeItem(STORE_INFO_STORAGE_KEY);
    window.sessionStorage.removeItem(SESSION_STORE_INFO_STORAGE_KEY);
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(stripSensitiveAuthFields(nextSession)),
  );
  clearSellerAccessSessionCache();
  dispatchAuthSessionChange();
}

/**
 * @param {Record<string, unknown>} patch
 */
export function updateAuthSession(patch) {
  if (typeof window === "undefined") {
    return;
  }

  const session = getAuthSession() || {};
  const nextSession = normalizeAuthSession({
    ...session,
    ...patch,
    user: {
      ...(session.user || {}),
      ...(patch.user || {}),
    },
    data: {
      ...(session.data || {}),
      ...(patch.data || {}),
    },
  });

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify(stripSensitiveAuthFields(nextSession)),
  );
  dispatchAuthSessionChange();
}

/**
 * @returns {any}
 */
export function getAuthSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return normalizeAuthSession(JSON.parse(rawSession));
  } catch {
    return null;
  }
}

/**
 * @returns {string}
 */
export function getAccessToken() {
  const authSession = getAuthSession();

  return authSession?.data?.access || authSession?.access || "";
}

/**
 * @param {any} [session]
 * @returns {boolean}
 */
export function hasAuthenticatedSellerSession(session = getAuthSession()) {
  const normalizedSession = session ? normalizeAuthSession(session) : null;
  const accessToken =
    normalizedSession?.data?.access || normalizedSession?.access || "";

  return Boolean(accessToken);
}

/**
 * @param {any} [session]
 * @returns {string}
 */
export function getSellerStoreUrl(session = getAuthSession()) {
  const normalizedSession = session ? normalizeAuthSession(session) : null;

  return (
    normalizedSession?.user?.storeUrl ||
    normalizedSession?.storeUrl ||
    getCachedStoreInfo()?.url ||
    ""
  );
}

/**
 * @param {any} [session]
 * @returns {boolean}
 */
export function hasSellerDashboardSession(session = getAuthSession()) {
  const normalizedSession = session ? normalizeAuthSession(session) : null;
  const accessToken =
    normalizedSession?.data?.access || normalizedSession?.access || "";
  const storeUrl = getSellerStoreUrl(normalizedSession);

  return Boolean(accessToken && storeUrl);
}

export function clearAuthSession(options = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (options.clearServerCookies !== false) {
    clearServerAuthCookies();
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem(STORE_INFO_STORAGE_KEY);
  window.localStorage.removeItem(MOBILE_VERIFY_STORAGE_KEY);

  Object.keys(window.localStorage).forEach((key) => {
    if (key.startsWith("shopdibz_")) {
      window.localStorage.removeItem(key);
    }
  });

  Object.keys(window.sessionStorage).forEach((key) => {
    if (key.startsWith("shopdibz_")) {
      window.sessionStorage.removeItem(key);
    }
  });

  clearSellerAccessSessionCache();
  dispatchAuthSessionChange();
}

export function clearCachedStoreInfo() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORE_INFO_STORAGE_KEY);
  window.sessionStorage.removeItem(SESSION_STORE_INFO_STORAGE_KEY);
  clearSellerAccessSessionCache();
  dispatchAuthSessionChange();
}

/**
 * @param {() => void} callback
 * @returns {() => void}
 */
export function subscribeAuthSession(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleChange = () => {
    callback();
  };

  window.addEventListener(AUTH_SESSION_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(AUTH_SESSION_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

/**
 * @returns {string | null}
 */
export function getAuthSessionSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}

/**
 * @returns {string | null}
 */
export function getSessionCachedStoreInfoSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(SESSION_STORE_INFO_STORAGE_KEY);
}

function dispatchAuthSessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

function clearServerAuthCookies() {
  fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "same-origin",
    keepalive: true,
  }).catch(() => null);
}

/**
 * @param {any} storeInfo
 */
export function cacheStoreInfo(storeInfo) {
  if (typeof window === "undefined" || !storeInfo) {
    return;
  }

  window.localStorage.setItem(STORE_INFO_STORAGE_KEY, JSON.stringify(storeInfo));
  window.sessionStorage.setItem(
    SESSION_STORE_INFO_STORAGE_KEY,
    JSON.stringify(storeInfo),
  );

  updateAuthSession({
    storeUrl: storeInfo?.url || "",
    storeCreated: true,
    user: {
      storeUrl: storeInfo?.url || "",
      email: storeInfo?.user?.email || "",
      fName: storeInfo?.user?.fName || "",
      lName: storeInfo?.user?.lName || "",
      mobile: storeInfo?.user?.mobile || storeInfo?.user?.mob || "",
      mob: storeInfo?.user?.mobile || storeInfo?.user?.mob || "",
      owner:
        storeInfo?.user?.owner ??
        storeInfo?.user?.sSo ??
        storeInfo?.user?.sSO ??
        false,
      eV:
        storeInfo?.user?.emailVerify ??
        storeInfo?.user?.eV ??
        true,
      cre: true,
    },
  });
}

/**
 * @returns {any | null}
 */
export function getCachedStoreInfo() {
  if (typeof window === "undefined") {
    return null;
  }

  const sessionStoreInfo = getSessionCachedStoreInfo();

  if (sessionStoreInfo) {
    return sessionStoreInfo;
  }

  const rawStoreInfo = window.localStorage.getItem(STORE_INFO_STORAGE_KEY);

  if (!rawStoreInfo) {
    return null;
  }

  try {
    return JSON.parse(rawStoreInfo);
  } catch {
    return null;
  }
}

/**
 * @returns {any | null}
 */
export function getSessionCachedStoreInfo() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawStoreInfo = window.sessionStorage.getItem(SESSION_STORE_INFO_STORAGE_KEY);

  if (!rawStoreInfo) {
    return null;
  }

  try {
    return JSON.parse(rawStoreInfo);
  } catch {
    return null;
  }
}

/**
 * @param {string} storeUrl
 */
export function savePendingOnboardingPayment(storeUrl) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedStoreUrl = String(storeUrl || "").trim();

  if (!normalizedStoreUrl) {
    return;
  }

  window.sessionStorage.setItem(
    ONBOARDING_PAYMENT_PENDING_STORAGE_KEY,
    JSON.stringify({
      storeUrl: normalizedStoreUrl,
      createdAt: Date.now(),
    }),
  );
  clearSellerAccessSessionCache();
  dispatchAuthSessionChange();
}

/**
 * @returns {{ storeUrl: string, createdAt: number } | null}
 */
export function getPendingOnboardingPayment() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(
    ONBOARDING_PAYMENT_PENDING_STORAGE_KEY,
  );

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

export function clearPendingOnboardingPayment() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ONBOARDING_PAYMENT_PENDING_STORAGE_KEY);
  clearSellerAccessSessionCache();
  dispatchAuthSessionChange();
}

function clearSellerAccessSessionCache() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SELLER_ACCESS_SESSION_CACHE_KEY);
}

/**
 * @param {any} rawSession
 * @returns {any}
 */
export function normalizeAuthSession(rawSession) {
  const session = rawSession || {};
  const user = session.user || {};
  const data = session.data || {};

  return {
    ...session,
    access: session.access || data.access || "",
    refresh: session.refresh || data.refresh || "",
    storeUrl:
      session.storeUrl ||
      user.storeUrl ||
      user.store_url ||
      "",
    storeCreated:
      session.storeCreated ?? resolveBoolean(user.cre ?? session.cre),
    verified:
      session.verified ?? resolveBoolean(user.ver ?? session.ver),
    emailVerified:
      session.emailVerified ??
      resolveBoolean(user.eV ?? user.emailVerified ?? session.eV),
    mobileVerified:
      session.mobileVerified ??
      resolveBoolean(user.mV ?? user.mobileVerified ?? session.mV),
    user: {
      ...user,
      uCode: user.uCode || session.uCode || "",
      userCode: user.userCode || user.uCode || session.userCode || "",
      email: user.email || session.email || data.email || "",
      fName: user.fName || session.fName || "",
      lName: user.lName || session.lName || "",
      mobile: user.mobile || user.mob || session.mobile || "",
      mob: user.mob || user.mobile || session.mobile || "",
      owner:
        user.owner ??
        user.sSo ??
        user.sSO ??
        session.owner ??
        false,
      manager:
        user.manager ??
        user.sSm ??
        user.sSM ??
        false,
      emailVerified:
        user.emailVerify ??
        user.emailVerified ??
        resolveBoolean(user.eV),
      eV:
        user.eV ??
        user.emailVerify ??
        session.emailVerified ??
        false,
      mV:
        user.mV ??
        session.mobileVerified ??
        false,
      cre:
        user.cre ??
        session.storeCreated ??
        false,
      ver:
        user.ver ??
        session.verified ??
        false,
      storeUrl:
        user.storeUrl ||
        user.store_url ||
        session.storeUrl ||
        "",
    },
    data: {
      ...data,
      access: data.access || session.access || "",
      refresh: data.refresh || session.refresh || "",
    },
  };
}

/**
 * @param {any} session
 * @returns {any}
 */
function stripSensitiveAuthFields(session) {
  const normalizedSession = normalizeAuthSession(session);

  return {
    ...normalizedSession,
    refresh: "",
    data: {
      ...(normalizedSession.data || {}),
      refresh: "",
    },
  };
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function resolveBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
}

/**
 * @param {string} mobile
 */
export function saveMobileVerification(mobile) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    MOBILE_VERIFY_STORAGE_KEY,
    JSON.stringify({
      mobile,
      verified: true,
    }),
  );
}

/**
 * @returns {{ mobile: string, verified: boolean } | null}
 */
export function getMobileVerification() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(MOBILE_VERIFY_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}
