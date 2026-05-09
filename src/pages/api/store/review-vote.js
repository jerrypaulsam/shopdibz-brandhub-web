import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";

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

  try {
    const formData = new FormData();
    formData.append("vote", String(vote));

    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.reviewVoting}${reviewId}/upvote/`,
      {
        method: "POST",
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
        body: formData,
      },
    );
    const text = await response.text();

    res.status(response.status).json(text ? parseResponse(text) : {});
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Review voting failed",
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
