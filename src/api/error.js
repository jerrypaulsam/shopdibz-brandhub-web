/**
 * @param {unknown} data
 * @returns {string}
 */
function extractApiErrorMessage(data) {
  if (typeof data === "string") {
    return data.trim();
  }

  if (!data || typeof data !== "object") {
    return "";
  }

  const message = "message" in data ? data.message : "";
  const detail = "detail" in data ? data.detail : "";
  const error = "error" in data ? data.error : "";

  return String(message || detail || error || "").trim();
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isGenericApiMessage(value) {
  const normalized = String(value || "").trim().toLowerCase();

  return (
    normalized === "bad request" ||
    normalized === "request failed" ||
    normalized === "error" ||
    normalized === "failed"
  );
}

/**
 * @param {{
 * status: number,
 * data?: unknown,
 * fallback: string,
 * notFound?: string,
 * forbidden?: string,
 * paymentRequired?: string,
 * unauthorized?: string,
 * badRequest?: string,
 * }} options
 * @returns {string}
 */
export function resolveApiErrorMessage(options) {
  const apiMessage = extractApiErrorMessage(options.data);

  if (apiMessage && !isGenericApiMessage(apiMessage)) {
    return apiMessage;
  }

  if (options.status === 404) {
    return options.notFound || "Requested resource unavailable.";
  }

  if (options.status === 403) {
    return options.forbidden || "Permission denied.";
  }

  if (options.status === 402) {
    return options.paymentRequired || "Please upgrade your plan to continue.";
  }

  if (options.status === 401) {
    return options.unauthorized || "Session expired. Please sign in again.";
  }

  if (options.status === 400) {
    return options.badRequest || apiMessage || options.fallback;
  }

  return apiMessage || options.fallback;
}
