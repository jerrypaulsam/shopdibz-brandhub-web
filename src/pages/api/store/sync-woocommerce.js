import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "", storeUrl = "" } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken || !storeUrl) {
    res.status(400).json({ message: "Missing WooCommerce sync fields" });
    return;
  }

  const result = await requestStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.syncWooCommerceProducts}${storeUrl}/`,
    accessToken,
    method: "GET",
  });

  res.status(result.status).json(result.data);
}
