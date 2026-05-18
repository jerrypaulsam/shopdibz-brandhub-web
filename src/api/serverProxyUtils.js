/**
 * @param {string} text
 * @returns {unknown}
 */
export function parseUpstreamResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizePreview(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 240);
}

/**
 * @param {{
 *   route: string,
 *   upstreamUrl: string,
 *   status: number,
 *   contentType?: string | null,
 *   text?: string,
 *   method?: string,
 * }} details
 */
export function logProxyResponse(details) {
  const contentType = String(details.contentType || "").toLowerCase();
  const preview = normalizePreview(details.text || "");
  const looksHtml =
    preview.startsWith("<!DOCTYPE") ||
    preview.startsWith("<html") ||
    contentType.includes("text/html");

  if (!looksHtml && details.status < 500) {
    return;
  }

  const level = details.status >= 500 || looksHtml ? "error" : "warn";
  const logger = level === "error" ? console.error : console.warn;

  logger("[shopdibz-proxy]", {
    route: details.route,
    method: details.method || "GET",
    upstreamUrl: details.upstreamUrl,
    status: details.status,
    contentType: details.contentType || "",
    preview,
  });
}
