import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", imageBase64 = "" } = req.body || {};

  if (!accessToken || !imageBase64) {
    res.status(400).json({ message: "Access token and image are required" });
    return;
  }

  try {
    const bytes = Uint8Array.from(Buffer.from(imageBase64, "base64"));
    const formData = new FormData();
    formData.append("proPic", new Blob([bytes]), "profile-picture.jpg");

    const response = await fetch(`${API_BASE_URL}${SHOPDIBZ_URLS.updateProfilePicture}`, {
      method: "PUT",
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
      body: formData,
    });
    const text = await response.text();

    res.status(response.status).json(text ? parseResponse(text) : {});
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Profile picture update failed",
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
