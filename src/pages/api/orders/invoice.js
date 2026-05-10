import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", orderId = "" } = req.query || {};

  if (!accessToken || !storeUrl || !orderId) {
    res.status(400).json({ message: "Access token, store URL, and order ID are required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.payments}invoice/${storeUrl}/order/${orderId}/web/`,
    accessToken: String(accessToken),
  });

  res.status(result.status).json(result.data);
}
