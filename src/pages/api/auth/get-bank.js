import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "" } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken) {
    res.status(400).json({ message: "Access token is required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: SHOPDIBZ_URLS.updateBankDetails,
    accessToken: String(accessToken),
  });

  res.status(result.status).json(result.data);
}
