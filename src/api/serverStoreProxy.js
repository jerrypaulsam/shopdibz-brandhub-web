import { API_BASE_URL } from "@/src/api/config";
import {
  logProxyResponse,
  parseUpstreamResponse,
  withInternalProxyHeaders,
} from "./serverProxyUtils";

/**
 * @param {string} value
 * @returns {Uint8Array}
 */
function decodeBase64(value) {
  return Uint8Array.from(Buffer.from(value, "base64"));
}

/**
 * @param {{ endpoint: string, accessToken?: string, method?: string, fields?: Record<string, string | boolean | number>, file?: { field: string, base64: string, filename: string }, query?: Record<string, string | number | boolean> }} options
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function submitStoreForm(options) {
  const formData = new FormData();
  const searchParams = new URLSearchParams();

  Object.entries(options.fields || {}).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  if (options.file) {
    const bytes = decodeBase64(options.file.base64);
    formData.append(
      options.file.field,
      new Blob([bytes]),
      options.file.filename,
    );
  }

  const queryString = searchParams.toString();
  const upstreamUrl = `${API_BASE_URL}${options.endpoint}${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(
    upstreamUrl,
    {
    method: options.method || "POST",
    headers: withInternalProxyHeaders(
      options.accessToken
        ? {
            Authorization: `JWT ${options.accessToken}`,
          }
        : undefined,
    ),
    body: formData,
    },
  );
  const text = await response.text();
  logProxyResponse({
    route: options.endpoint,
    method: options.method || "POST",
    upstreamUrl,
    status: response.status,
    contentType: response.headers.get("content-type"),
    text,
  });

  return {
    status: response.status,
    data: text ? parseUpstreamResponse(text) : {},
  };
}

/**
 * @param {string} endpoint
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function getStoreJson(endpoint) {
  const upstreamUrl = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(upstreamUrl, {
    headers: withInternalProxyHeaders(undefined),
  });
  const text = await response.text();
  logProxyResponse({
    route: endpoint,
    method: "GET",
    upstreamUrl,
    status: response.status,
    contentType: response.headers.get("content-type"),
    text,
  });

  return {
    status: response.status,
    data: text ? parseUpstreamResponse(text) : {},
  };
}

/**
 * @param {{ endpoint: string, accessToken?: string, query?: Record<string, string | number> }} options
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function getStoreJsonWithAuth(options) {
  const searchParams = new URLSearchParams();

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const upstreamUrl = `${API_BASE_URL}${options.endpoint}${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(
    upstreamUrl,
    {
      headers: withInternalProxyHeaders(
        options.accessToken
          ? {
              Authorization: `JWT ${options.accessToken}`,
            }
          : undefined,
      ),
    },
  );
  const text = await response.text();
  logProxyResponse({
    route: options.endpoint,
    method: "GET",
    upstreamUrl,
    status: response.status,
    contentType: response.headers.get("content-type"),
    text,
  });

  return {
    status: response.status,
    data: text ? parseUpstreamResponse(text) : {},
  };
}

/**
 * @param {{ endpoint: string, accessToken?: string, fields?: Record<string, string | boolean | number | string[]>, files?: Array<{ field: string, base64: string, filename: string }> }} options
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function submitStoreMultiForm(options) {
  const formData = new FormData();

  Object.entries(options.fields || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, String(item));
      });
      return;
    }

    formData.append(key, String(value));
  });

  (options.files || []).forEach((file) => {
    const bytes = decodeBase64(file.base64);
    formData.append(file.field, new Blob([bytes]), file.filename);
  });

  const upstreamUrl = `${API_BASE_URL}${options.endpoint}`;
  const response = await fetch(upstreamUrl, {
    method: options.method || "POST",
    headers: withInternalProxyHeaders(
      options.accessToken
        ? {
            Authorization: `JWT ${options.accessToken}`,
          }
        : undefined,
    ),
    body: formData,
  });
  const text = await response.text();
  logProxyResponse({
    route: options.endpoint,
    method: options.method || "POST",
    upstreamUrl,
    status: response.status,
    contentType: response.headers.get("content-type"),
    text,
  });

  return {
    status: response.status,
    data: text ? parseUpstreamResponse(text) : {},
  };
}

/**
 * @param {{ endpoint: string, accessToken?: string, method?: string, body?: unknown, query?: Record<string, string | number> }} options
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function requestStoreJsonWithAuth(options) {
  const searchParams = new URLSearchParams();

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const upstreamUrl = `${API_BASE_URL}${options.endpoint}${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(
    upstreamUrl,
    {
      method: options.method || "GET",
      headers: withInternalProxyHeaders({
        ...(options.accessToken
          ? {
              Authorization: `JWT ${options.accessToken}`,
            }
          : {}),
        ...(options.body !== undefined
          ? {
              "Content-Type": "application/json",
            }
          : {}),
      }),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    },
  );

  const text = await response.text();
  logProxyResponse({
    route: options.endpoint,
    method: options.method || "GET",
    upstreamUrl,
    status: response.status,
    contentType: response.headers.get("content-type"),
    text,
  });

  return {
    status: response.status,
    data: text ? parseUpstreamResponse(text) : {},
  };
}
