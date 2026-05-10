import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "" } = req.body || {};

  if (!accessToken || !storeUrl) {
    res.status(400).json({ message: "Access token and store URL are required" });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.headerImage}${storeUrl}/delete/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
      },
    );
    const text = await response.text();

    res.status(response.status).json(text ? parseResponse(text) : {});
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Header image deletion failed",
    });
  }
}

function parseResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
