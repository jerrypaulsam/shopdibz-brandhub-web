import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreMultiForm } from "@/src/api/serverStoreProxy";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    storeUrl = "",
    forMobile = false,
    images = [],
    productGroupSlugs = [],
    links = [],
  } = req.body || {};

  if (!accessToken || !storeUrl || !Array.isArray(images) || images.length !== 2) {
    res.status(400).json({ message: "Access token, store URL, and exactly 2 images are required" });
    return;
  }

  try {
    const response = await submitStoreMultiForm({
      endpoint: `${SHOPDIBZ_URLS.storeBanner}create/${storeUrl}/`,
      accessToken,
      fields: {
        pGroup: productGroupSlugs,
        links,
        lnk: "",
        forMobile,
      },
      files: images.map((imageBase64, index) => ({
        field: "img",
        base64: imageBase64,
        filename: `${storeUrl}_banner-${index}.jpg`,
      })),
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Banner publish failed",
    });
  }
}
