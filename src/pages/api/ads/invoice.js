import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { campaignId = "" } = req.query || {};
  const accessToken = getRequestAccessToken(req);

  if (!accessToken || !campaignId) {
    res.status(400).json({ message: "Access token and campaign ID are required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.campaignInvoice}${campaignId}/`,
    accessToken: String(accessToken),
  });

  res.status(result.status).json(result.data);
}
