import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "" } = req.body || {};

  if (!accessToken) {
    res.status(400).json({ message: "Access token is required" });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.checkStoreVerification}`,
      {
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
      },
    );
    const text = await response.text();
    const data = text ? parseResponse(text) : {};

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Store verification request failed",
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
