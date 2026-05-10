import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", slug = "", action = "" } = req.body || {};

  if (!accessToken || !slug || !action) {
    res.status(400).json({ message: "Access token, slug, and action are required" });
    return;
  }

  const method = String(action) === "restore" ? "DELETE" : "POST";
  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.products}${slug}/archive/`,
    accessToken: String(accessToken),
    method,
    fields: {
      action: String(action),
    },
  });

  res.status(result.status).json(result.data);
}
