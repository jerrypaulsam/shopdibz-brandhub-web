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
  const refreshToken = authSession?.data?.refresh || authSession?.refresh || "";

  return postAuthJson("/api/auth/logout", {
    refreshToken,
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
    throw new Error(data?.message || data?.detail || "Request failed");
  }

  return {
    statusCode: response.status,
    data,
  };
}

/**
 * @param {unknown} authData
 */
export function saveAuthSession(authData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

/**
 * @param {Record<string, unknown>} patch
 */
export function updateAuthSession(patch) {
  if (typeof window === "undefined") {
    return;
  }

  const session = getAuthSession() || {};
  const nextSession = {
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
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
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
    return JSON.parse(rawSession);
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

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
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
