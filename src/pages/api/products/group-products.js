import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const authHeader = String(req.headers.authorization || "");
  const accessToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const { groupId = "", page = 1 } = req.query || {};

  if (!accessToken || !groupId) {
    res.status(400).json({ message: "Access token and group ID are required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.products}product_group/${groupId}/products/`,
    accessToken: String(accessToken),
    query: {
      page,
    },
  });

  res.status(result.status).json(result.data);
}
