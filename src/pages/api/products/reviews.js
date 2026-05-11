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

  const authHeader = String(req.headers.authorization || "");
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const { slug = "", page = "1" } = req.query || {};

  if (!accessToken || !slug) {
    res.status(400).json({ message: "Access token and slug are required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.products}${slug}/review/`,
    accessToken: String(accessToken),
    query: {
      page: toPage(String(page)),
    },
  });

  res.status(result.status).json(result.data);
}
