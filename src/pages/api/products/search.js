import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

/**
 * @param {string} value
 * @returns {number}
 */
function toPage(value) {
  const page = Number(value || 1);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    storeUrl = "",
    query = "",
    sort = "",
    page = "1",
  } = req.query || {};

  if (!accessToken) {
    res.status(400).json({ message: "Access token is required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.search}sellerPrdtSearch/`,
    accessToken: String(accessToken),
    query: {
      search: String(query || ""),
      store: String(storeUrl || ""),
      page: toPage(String(page)),
    },
  });

  res.status(result.status).json(result.data);
}
