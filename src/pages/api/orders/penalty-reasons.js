import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", page = "1" } = req.query || {};

  if (!accessToken || !storeUrl) {
    res.status(400).json({ message: "Access token and store URL are required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.penaltyReasons}${storeUrl}/list/`,
    accessToken: String(accessToken),
    query: {
      page: Number(page || 1) || 1,
    },
  });

  res.status(result.status).json(result.data);
}
