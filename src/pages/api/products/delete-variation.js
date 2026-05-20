import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "", variationId = 0 } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken || !variationId) {
    res.status(400).json({ message: "Access token and variation id are required" });
    return;
  }

  const result = await requestStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.products}delete/var/${variationId}/`,
    accessToken,
    method: "DELETE",
  });

  res.status(result.status).json(result.data);
}
