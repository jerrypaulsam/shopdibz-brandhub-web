import { SHOPDIBZ_URLS } from "@/src/api/config";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", slug = "" } = req.body || {};

  if (!accessToken || !slug) {
    res.status(400).json({ message: "Access token and slug are required" });
    return;
  }

  const result = await requestStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.products}${slug}/delete/`,
    accessToken: String(accessToken),
    method: "DELETE",
  });

  res.status(result.status).json(result.data);
}
