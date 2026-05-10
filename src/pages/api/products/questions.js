import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", slug = "", page = 1 } = req.query || {};

  if (!accessToken || !slug) {
    res.status(400).json({ message: "Access token and slug are required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.products}${slug}/questions/`,
    accessToken: String(accessToken),
    query: {
      page,
    },
  });

  res.status(result.status).json(result.data);
}
