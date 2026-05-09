import { API_BASE_URL } from "@/src/api/config";

/**
 * @param {string} value
 * @returns {Uint8Array}
 */
function decodeBase64(value) {
  return Uint8Array.from(Buffer.from(value, "base64"));
}

/**
 * @param {string} text
 * @returns {unknown}
 */
function parseResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

/**
 * @param {{ endpoint: string, accessToken?: string, method?: string, fields?: Record<string, string | boolean | number>, file?: { field: string, base64: string, filename: string } }} options
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function submitStoreForm(options) {
  const formData = new FormData();

  Object.entries(options.fields || {}).forEach(([key, value]) => {
    formData.append(key, String(value));
  });

  if (options.file) {
    const bytes = decodeBase64(options.file.base64);
    formData.append(
      options.file.field,
      new Blob([bytes]),
      options.file.filename,
    );
  }

  const response = await fetch(`${API_BASE_URL}${options.endpoint}`, {
    method: options.method || "POST",
    headers: options.accessToken
      ? {
          Authorization: `JWT ${options.accessToken}`,
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
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function getStoreJson(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  const text = await response.text();

  return {
    status: response.status,
    data: text ? parseResponse(text) : {},
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
  const response = await fetch(
    `${API_BASE_URL}${options.endpoint}${queryString ? `?${queryString}` : ""}`,
    {
      headers: options.accessToken
        ? {
            Authorization: `JWT ${options.accessToken}`,
          }
        : undefined,
    },
  );
  const text = await response.text();

  return {
    status: response.status,
    data: text ? parseResponse(text) : {},
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

  const response = await fetch(`${API_BASE_URL}${options.endpoint}`, {
    method: "POST",
    headers: options.accessToken
      ? {
          Authorization: `JWT ${options.accessToken}`,
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
