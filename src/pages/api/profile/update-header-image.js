import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", imageBase64 = "" } = req.body || {};

  if (!accessToken || !storeUrl || !imageBase64) {
    res.status(400).json({ message: "Access token, store URL, and image are required" });
    return;
  }

  try {
    const response = await submitStoreForm({
      endpoint: `${SHOPDIBZ_URLS.headerImage}${storeUrl}/update/`,
      accessToken,
      method: "PUT",
      file: {
        field: "headerImg",
        base64: imageBase64,
        filename: `header-image-${storeUrl}.jpg`,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Header image update failed",
    });
  }
}
