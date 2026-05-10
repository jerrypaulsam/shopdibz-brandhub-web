import { SHOPDIBZ_URLS } from "@/src/api/config";
import { requestStoreJsonWithAuth, submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", slug = "", action = "", type = 0 } = req.body || {};

  if (!accessToken || !slug || !action) {
    res.status(400).json({ message: "Access token, slug, and action are required" });
    return;
  }

  if (String(action) === "remove") {
    const result = await requestStoreJsonWithAuth({
      endpoint: `${SHOPDIBZ_URLS.sellerPanel}${slug}/store_featured/`,
      accessToken: String(accessToken),
      method: "DELETE",
    });

    res.status(result.status).json(result.data);
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.sellerPanel}${slug}/store_featured/`,
    accessToken: String(accessToken),
    method: "POST",
    fields: {
      type: Number(type || 0),
    },
  });

  res.status(result.status).json(result.data);
}
