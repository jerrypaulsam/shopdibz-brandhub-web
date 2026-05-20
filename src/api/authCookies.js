export const ACCESS_TOKEN_COOKIE_NAME = "shopdibz_seller_access";
export const REFRESH_TOKEN_COOKIE_NAME = "shopdibz_seller_refresh";

const ACCESS_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const REFRESH_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * @param {unknown} authData
 * @returns {string}
 */
function extractAccessToken(authData) {
  if (!authData || typeof authData !== "object") {
    return "";
  }

  return String(authData.access || authData?.data?.access || "").trim();
}

/**
 * @param {unknown} authData
 * @returns {string}
 */
function extractRefreshToken(authData) {
  if (!authData || typeof authData !== "object") {
    return "";
  }

  return String(authData.refresh || authData?.data?.refresh || "").trim();
}

/**
 * @returns {boolean}
 */
function shouldUseSecureCookies() {
  const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL || "").trim().toLowerCase();

  return process.env.NODE_ENV === "production" || siteUrl.startsWith("https://");
}

/**
 * @param {string} name
 * @param {string} value
 * @param {{ maxAge?: number }} [options]
 * @returns {string}
 */
function serializeCookie(name, value, options = {}) {
  const parts = [
    `${name}=${encodeURIComponent(String(value || ""))}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (shouldUseSecureCookies()) {
    parts.push("Secure");
  }

  if (typeof options.maxAge === "number") {
    parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  }

  return parts.join("; ");
}

/**
 * @param {any} res
 * @param {string[]} cookies
 */
function appendSetCookieHeader(res, cookies) {
  const current = res.getHeader("Set-Cookie");
  const currentValues = Array.isArray(current)
    ? current
    : current
      ? [String(current)]
      : [];

  res.setHeader("Set-Cookie", [...currentValues, ...cookies]);
}

/**
 * @param {any} res
 * @param {unknown} authData
 */
export function setAuthCookies(res, authData) {
  const accessToken = extractAccessToken(authData);
  const refreshToken = extractRefreshToken(authData);
  const cookies = [];

  if (accessToken) {
    cookies.push(
      serializeCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
        maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
      }),
    );
  }

  if (refreshToken) {
    cookies.push(
      serializeCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      }),
    );
  }

  if (cookies.length > 0) {
    appendSetCookieHeader(res, cookies);
  }
}

/**
 * @param {any} res
 */
export function clearAuthCookies(res) {
  appendSetCookieHeader(res, [
    serializeCookie(ACCESS_TOKEN_COOKIE_NAME, "", { maxAge: 0 }),
    serializeCookie(REFRESH_TOKEN_COOKIE_NAME, "", { maxAge: 0 }),
  ]);
}

/**
 * @param {any} req
 * @param {string} name
 * @returns {string}
 */
function getCookieValue(req, name) {
  return String(req?.cookies?.[name] || "").trim();
}

/**
 * @param {any} req
 * @param {string} [explicitToken]
 * @returns {string}
 */
export function getRequestAccessToken(req, explicitToken = "") {
  const cookieToken = getCookieValue(req, ACCESS_TOKEN_COOKIE_NAME);

  if (cookieToken) {
    return cookieToken;
  }

  const normalizedExplicitToken = String(explicitToken || "").trim();

  if (normalizedExplicitToken) {
    return normalizedExplicitToken;
  }

  const authHeader = String(req?.headers?.authorization || "").trim();

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  if (authHeader.startsWith("JWT ")) {
    return authHeader.slice(4).trim();
  }
  return "";
}

/**
 * @param {any} req
 * @param {string} [explicitToken]
 * @returns {string}
 */
export function getRequestRefreshToken(req, explicitToken = "") {
  const cookieToken = getCookieValue(req, REFRESH_TOKEN_COOKIE_NAME);

  if (cookieToken) {
    return cookieToken;
  }

  const normalizedExplicitToken = String(explicitToken || "").trim();

  if (normalizedExplicitToken) {
    return normalizedExplicitToken;
  }

  return "";
}
