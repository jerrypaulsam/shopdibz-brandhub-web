import { API_BASE_URL } from "@/src/api/config";
import {
  logProxyResponse,
  parseUpstreamResponse,
  withInternalProxyHeaders,
} from "./serverProxyUtils";

/**
 * @param {string} endpoint
 * @param {Record<string, string>} fields
 * @param {string} [accessToken]
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function postFormToShopdibz(endpoint, fields, accessToken) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const upstreamUrl = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(upstreamUrl, {
    method: "POST",
    headers: withInternalProxyHeaders(
      accessToken
        ? {
            Authorization: `JWT ${accessToken}`,
          }
        : undefined,
    ),
    body: formData,
  });

  const text = await response.text();
  logProxyResponse({
    route: endpoint,
    method: "POST",
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
 * @param {string} accessToken
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function postEmptyToShopdibz(endpoint, accessToken) {
  const upstreamUrl = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(upstreamUrl, {
    method: "POST",
    headers: withInternalProxyHeaders({
      Authorization: `JWT ${accessToken}`,
    }),
  });

  const text = await response.text();
  logProxyResponse({
    route: endpoint,
    method: "POST",
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
 * @param {Record<string, string>} fields
 * @param {string} accessToken
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function putFormToShopdibz(endpoint, fields, accessToken) {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const upstreamUrl = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(upstreamUrl, {
    method: "PUT",
    headers: withInternalProxyHeaders({
      Authorization: `JWT ${accessToken}`,
    }),
    body: formData,
  });

  const text = await response.text();
  logProxyResponse({
    route: endpoint,
    method: "PUT",
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
