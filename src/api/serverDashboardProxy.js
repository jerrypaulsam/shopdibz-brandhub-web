import { API_BASE_URL } from "@/src/api/config";

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 * @param {{ endpoint: string, accessToken?: string, query?: Record<string, string | number> }} options
 */
export async function proxyDashboardGet(req, res, options) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const searchParams = new URLSearchParams();

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}${options.endpoint}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      headers: options.accessToken
        ? {
            Authorization: `JWT ${options.accessToken}`,
          }
        : undefined,
    });
    const text = await response.text();
    const data = text ? parseResponse(text) : {};

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Dashboard request failed",
    });
  }
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
