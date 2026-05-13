import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { storeUrl = "", status = "DRAFT", page = "1" } = req.query || {};
  const authHeader = String(req.headers.authorization || "");
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!accessToken || !storeUrl) {
    res.status(400).json({ message: "Access token and store URL are required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.adCampaignList}${storeUrl}/`,
    accessToken: String(accessToken),
    query: {
      status: String(status || "DRAFT"),
      page: Number(page || 1) || 1,
    },
  });

  res.status(result.status).json(result.data);
}
