import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", query = "" } = req.query || {};

  if (!accessToken) {
    res.status(400).json({ message: "Access token is required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.search}sellerPrdtTitle/`,
    accessToken: String(accessToken),
    query: {
      search: String(query || ""),
      store: String(storeUrl || ""),
      page: 1,
    },
  });

  res.status(result.status).json(result.data);
}
