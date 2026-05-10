import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", variationId = 0, data = {} } = req.body || {};

  if (!accessToken || !variationId) {
    res.status(400).json({ message: "Access token and variation id are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.products}update/var/${variationId}/`,
    accessToken,
    method: "PUT",
    fields: {
      data: JSON.stringify(data),
    },
  });

  res.status(result.status).json(result.data);
}
