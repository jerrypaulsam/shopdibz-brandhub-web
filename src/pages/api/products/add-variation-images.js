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

  const { accessToken = "", variationId = 0, images = [] } = req.body || {};

  if (!accessToken || !variationId) {
    res.status(400).json({ message: "Access token and variation id are required" });
    return;
  }

  const result = await submitStoreMultiForm({
    endpoint: `${SHOPDIBZ_URLS.products}add_images/${variationId}/variation/`,
    accessToken,
    files: images.map((image, index) => ({
      field: "img",
      base64: image.base64,
      filename: image.filename || `variation-image-${index + 1}.jpg`,
    })),
  });

  res.status(result.status).json(result.data);
}
