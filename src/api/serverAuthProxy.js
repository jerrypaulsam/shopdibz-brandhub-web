import { API_BASE_URL } from "@/src/api/config";

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: accessToken
      ? {
          Authorization: `JWT ${accessToken}`,
        }
      : undefined,
    body: formData,
  });

  const text = await response.text();

  return {
    status: response.status,
    data: text ? parseResponse(text) : {},
  };
}

/**
 * @param {string} endpoint
 * @param {string} accessToken
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function postEmptyToShopdibz(endpoint, accessToken) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });

  const text = await response.text();

  return {
    status: response.status,
    data: text ? parseResponse(text) : {},
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
    body: formData,
  });

  const text = await response.text();

  return {
    status: response.status,
    data: text ? parseResponse(text) : {},
  };
}

/**
 * @param {string} text
 * @returns {unknown}
 */
function parseResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
}
