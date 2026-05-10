import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    bannerId = 0,
    imageBase64 = "",
    productGroupSlug = "",
    link = "",
  } = req.body || {};

  if (!accessToken || !bannerId || !imageBase64) {
    res.status(400).json({ message: "Access token, banner ID, and image are required" });
    return;
  }

  try {
    const response = await submitStoreForm({
      endpoint: `${SHOPDIBZ_URLS.storeBanner}${bannerId}/update/`,
      accessToken,
      method: "PUT",
      fields: {
        lnk: "",
        pGroup: productGroupSlug,
        link,
      },
      file: {
        field: "img",
        base64: imageBase64,
        filename: `banner-${bannerId}.jpg`,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Banner update failed",
    });
  }
}
