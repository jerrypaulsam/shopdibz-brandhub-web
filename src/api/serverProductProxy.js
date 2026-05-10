import { requestStoreJsonWithAuth, submitStoreForm } from "./serverStoreProxy";

/**
 * @param {{ candidates: string[], accessToken: string, query?: Record<string, string | number>, method?: string, body?: unknown }} options
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function requestProductCandidates(options) {
  /** @type {{ status: number, data: unknown }} */
  let lastResult = {
    status: 404,
    data: {
      message: "Product endpoint not found",
    },
  };

  for (const endpoint of options.candidates) {
    const result = await requestStoreJsonWithAuth({
      endpoint,
      accessToken: options.accessToken,
      query: options.query,
      method: options.method,
      body: options.body,
    });

    if (result.status !== 404) {
      return result;
    }

    lastResult = result;
  }

  return lastResult;
}

/**
 * @param {{ candidates: string[], accessToken: string, fields?: Record<string, string | boolean | number>, method?: string }} options
 * @returns {Promise<{ status: number, data: unknown }>}
 */
export async function submitProductCandidates(options) {
  /** @type {{ status: number, data: unknown }} */
  let lastResult = {
    status: 404,
    data: {
      message: "Product endpoint not found",
    },
  };

  for (const endpoint of options.candidates) {
    const result = await submitStoreForm({
      endpoint,
      accessToken: options.accessToken,
      method: options.method || "POST",
      fields: options.fields,
    });

    if (result.status !== 404) {
      return result;
    }

    lastResult = result;
  }

  return lastResult;
}
