import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "", page = 1 } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken) {
    res.status(400).json({ message: "Access token is required" });
    return;
  }

  try {
    const response = await getStoreJsonWithAuth({
      endpoint: SHOPDIBZ_URLS.supportTickets,
      accessToken,
      query: { page },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Support tickets request failed",
    });
  }
}
