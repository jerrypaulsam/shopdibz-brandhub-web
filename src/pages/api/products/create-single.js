import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreMultiForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    storeUrl = "",
    images = [],
    ...data
  } = req.body || {};

  if (!accessToken || !storeUrl) {
    res.status(400).json({ message: "Access token and store URL are required" });
    return;
  }

  const result = await submitStoreMultiForm({
    endpoint: `${SHOPDIBZ_URLS.products}${storeUrl}/create/`,
    accessToken,
    fields: {
      data: JSON.stringify(data),
    },
    files: images.map((image, index) => ({
      field: "images",
      base64: image.base64,
      filename: image.filename || `${storeUrl}-product-${index + 1}.jpg`,
    })),
  });

  res.status(result.status).json(result.data);
}
