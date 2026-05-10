import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreMultiForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", slug = "", images = [] } = req.body || {};

  if (!accessToken || !slug) {
    res.status(400).json({ message: "Access token and slug are required" });
    return;
  }

  const result = await submitStoreMultiForm({
    endpoint: `${SHOPDIBZ_URLS.products}add/images/product/${slug}/`,
    accessToken,
    files: images.map((image, index) => ({
      field: "imgs",
      base64: image.base64,
      filename: image.filename || `product-image-${index + 1}.jpg`,
    })),
  });

  res.status(result.status).json(result.data);
}
