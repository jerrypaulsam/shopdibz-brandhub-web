import { API_BASE_URL } from "@/src/api/config";

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", reviewId = 0, vote = "" } = req.body || {};

  if (!accessToken || !reviewId || vote === "") {
    res.status(400).json({ message: "Access token, review ID, and vote are required" });
    return;
  }

  const candidates = [
    `${API_BASE_URL}/api/products/product_feedback/${reviewId}/upvote/`,
  ];

  let lastStatus = 404;
  let lastData = { message: "Product review voting endpoint not found" };

  for (const endpoint of candidates) {
    const formData = new FormData();
    formData.append("vote", String(vote));

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
      body: formData,
    });

    const text = await response.text();
    const data = text ? parseResponse(text) : {};

    if (response.status !== 404) {
      res.status(response.status).json(data);
      return;
    }

    lastStatus = response.status;
    lastData = data;
  }

  res.status(lastStatus).json(lastData);
}
