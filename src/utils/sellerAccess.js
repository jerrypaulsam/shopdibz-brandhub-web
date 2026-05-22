import { isClosedStoreAccessError } from "@/src/api/dashboard";
import {
  clearPendingOnboardingPayment,
  getPendingOnboardingPayment,
} from "@/src/api/auth";

const ONBOARDING_PAYMENT_PENDING_MAX_AGE_MS = 10 * 60 * 1000;

/**
 * @param {{
 * session: any,
 * cachedStoreInfo?: any,
 * fetchStoreInfo: () => Promise<any>,
 * checkStoreVerification: () => Promise<{ status?: number } | null>,
 * }} options
 * @returns {Promise<{ redirectTo: string, storeInfo: any, resolved: boolean }>}
 */
export async function resolveSellerAccessRoute(options) {
  const session = options?.session || {};
  const cachedStoreInfo = options?.cachedStoreInfo || null;
  const accessToken = String(session?.data?.access || session?.access || "").trim();

  if (!accessToken) {
    return {
      redirectTo: "",
      storeInfo: cachedStoreInfo,
      resolved: false,
    };
  }

  const emailVerified = toBoolean(
    firstDefined([
      session?.emailVerified,
      session?.user?.emailVerified,
      session?.user?.emailVerify,
      session?.user?.eV,
      session?.eV,
    ]),
  );

  if (!emailVerified) {
    return {
      redirectTo: "/init-email-verify",
      storeInfo: cachedStoreInfo,
      resolved: true,
    };
  }

  const storeUrl = String(
    firstDefined([
      session?.user?.storeUrl,
      session?.user?.store_url,
      session?.storeUrl,
      cachedStoreInfo?.url,
      "",
    ]),
  ).trim();
  const storeCreated = toBoolean(
    firstDefined([
      session?.storeCreated,
      session?.user?.cre,
      session?.cre,
    ]),
  );
  let verified = toBoolean(
    firstDefined([
      session?.verified,
      session?.user?.ver,
      session?.ver,
    ]),
  );
  const verification =
    storeCreated
      ? await options.checkStoreVerification().catch(() => null)
      : null;

  if (verification?.status === 200 || verification?.status === 201) {
    verified = true;
  }

  if (!storeUrl) {
    if (verification?.status === 200 || verification?.status === 201 || verified) {
      return {
        redirectTo: "/store-info-form",
        storeInfo: cachedStoreInfo,
        resolved: true,
      };
    }

    if (verification?.status === 403) {
      return {
        redirectTo: "/awaiting-verification",
        storeInfo: cachedStoreInfo,
        resolved: true,
      };
    }

    if (verification?.status === 404) {
      return {
        redirectTo: "/settings/bank/create",
        storeInfo: cachedStoreInfo,
        resolved: true,
      };
    }

    return {
      redirectTo: "/store-form",
      storeInfo: cachedStoreInfo,
      resolved: true,
    };
  }

  if (verification?.status === 403) {
    return {
      redirectTo: "/awaiting-verification",
      storeInfo: cachedStoreInfo,
      resolved: true,
    };
  }

  if (verification?.status === 404) {
    return {
      redirectTo: "/settings/bank/create",
      storeInfo: cachedStoreInfo,
      resolved: true,
    };
  }

  if (storeCreated && !verified) {
    return {
      redirectTo: "/awaiting-verification",
      storeInfo: cachedStoreInfo,
      resolved: true,
    };
  }

  let storeInfo = null;

  try {
    const fetchedStoreInfo = await options.fetchStoreInfo();

    if (fetchedStoreInfo) {
      storeInfo = fetchedStoreInfo;
    }
  } catch (error) {
    if (isClosedStoreAccessError(error)) {
      clearPendingOnboardingPayment();
      return {
        redirectTo: "/store-closed",
        storeInfo,
        resolved: true,
      };
    }

    storeInfo = cachedStoreInfo;
  }

  if (isStoreClosed(storeInfo)) {
    clearPendingOnboardingPayment();
    return {
      redirectTo: "/store-closed",
      storeInfo,
      resolved: true,
    };
  }

  if (isExplicitFalse(firstDefined([storeInfo?.bankVerify, storeInfo?.bank_verify, storeInfo?.bV]))) {
    clearPendingOnboardingPayment();
    return {
      redirectTo: "/settings/bank/create",
      storeInfo,
      resolved: true,
    };
  }

  if (isExplicitTrue(storeInfo?.paywall)) {
    clearPendingOnboardingPayment();
  } else if (hasPendingOnboardingPayment(storeUrl)) {
    return {
      redirectTo: "/onboard-payment-status",
      storeInfo,
      resolved: true,
    };
  }

  if (requiresOnboardingPayment(storeInfo)) {
    return {
      redirectTo: "/onboard-payment",
      storeInfo,
      resolved: true,
    };
  }

  return {
    redirectTo: "",
    storeInfo,
    resolved: Boolean(storeInfo || !storeUrl),
  };
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function shouldGuardSellerRoute(pathname) {
  const value = String(pathname || "").trim();

  if (!value || value.startsWith("/api/")) {
    return false;
  }

  if (isPublicLandingRoute(value)) {
    return false;
  }

  return !isSystemPublicRoute(value);
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function shouldBlockSellerRouteUntilResolved(pathname) {
  const value = String(pathname || "").trim();

  if (!shouldGuardSellerRoute(value)) {
    return false;
  }

  return !isGuestAccessibleRoute(value);
}

/**
 * @param {string} pathname
 * @param {string} targetRoute
 * @returns {boolean}
 */
export function isAllowedSellerRoute(pathname, targetRoute) {
  const value = String(pathname || "").trim();
  const target = String(targetRoute || "").trim();

  if (!value || !target) {
    return false;
  }

  return getAllowedRoutesForTarget(target).some((route) => value === route);
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
export function isOnboardingOnlyRoute(pathname) {
  const value = String(pathname || "").trim();

  return [
    "/",
    "/hub",
    "/login",
    "/sign-up",
    "/new-mobile-verify",
    "/init-email-verify",
    "/store-form",
    "/settings/bank/create",
    "/awaiting-verification",
    "/onboard-payment",
    "/onboard-payment-status",
    "/subscription-payment-status",
    "/store-closed",
  ].some((route) => value === route);
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
function isGuestAccessibleRoute(pathname) {
  const value = String(pathname || "").trim();

  return [
    "/login",
    "/sign-up",
    "/new-mobile-verify",
    "/init-email-verify",
  ].some((route) => value === route || value.startsWith(`${route}?`));
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
function isPublicLandingRoute(pathname) {
  const value = String(pathname || "").trim();

  return [
    "/",
    "/hub",
  ].some((route) => value === route || value.startsWith(`${route}?`));
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
function isSystemPublicRoute(pathname) {
  const value = String(pathname || "").trim();

  return [
    "/404",
    "/500",
    "/maintenance",
  ].some((route) => value === route || value.startsWith(`${route}?`));
}

/**
 * @param {string} targetRoute
 * @returns {string[]}
 */
function getAllowedRoutesForTarget(targetRoute) {
  if (targetRoute === "/onboard-payment") {
    return ["/onboard-payment", "/onboard-payment-status"];
  }

  if (targetRoute === "/onboard-payment-status") {
    return ["/onboard-payment", "/onboard-payment-status"];
  }

  return [targetRoute];
}

/**
 * @param {unknown[]} values
 * @returns {unknown}
 */
function firstDefined(values) {
  return values.find((value) => value !== undefined && value !== null);
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return Boolean(value);
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isExplicitFalse(value) {
  if (typeof value === "boolean") {
    return value === false;
  }

  if (typeof value === "number") {
    return value === 0;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "false" || normalized === "0";
  }

  return false;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isExplicitTrue(value) {
  if (typeof value === "boolean") {
    return value === true;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return false;
}

/**
 * @param {any} storeInfo
 * @returns {boolean}
 */
function requiresOnboardingPayment(storeInfo) {
  return !isExplicitTrue(storeInfo?.paywall);
}

/**
 * @param {string} storeUrl
 * @returns {boolean}
 */
function hasPendingOnboardingPayment(storeUrl) {
  const pendingPayment = getPendingOnboardingPayment();
  const normalizedStoreUrl = String(storeUrl || "").trim();

  if (!pendingPayment?.storeUrl || !pendingPayment?.createdAt) {
    return false;
  }

  if (String(pendingPayment.storeUrl).trim() !== normalizedStoreUrl) {
    clearPendingOnboardingPayment();
    return false;
  }

  if ((Date.now() - Number(pendingPayment.createdAt || 0)) > ONBOARDING_PAYMENT_PENDING_MAX_AGE_MS) {
    clearPendingOnboardingPayment();
    return false;
  }

  return true;
}

/**
 * @param {any} storeInfo
 * @returns {boolean}
 */
function isStoreClosed(storeInfo) {
  return toBoolean(firstDefined([storeInfo?.close, storeInfo?.closed]));
}
