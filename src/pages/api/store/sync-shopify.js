import { SHOPDIBZ_URLS } from "@/src/api/config";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "" } = req.body || {};

  if (!accessToken || !storeUrl) {
    res.status(400).json({ message: "Missing Shopify sync fields" });
    return;
  }

  const result = await requestStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.createShopifyWebhooks}${storeUrl}/`,
    accessToken,
    method: "POST",
  });

  res.status(result.status).json(result.data);
}
