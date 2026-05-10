import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", orderId, reasonId, detail = "" } = req.body || {};

  if (!accessToken || !orderId || !reasonId || !detail) {
    res.status(400).json({ message: "Missing cancel order fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.orderCancel}${orderId}/seller/`,
    accessToken: String(accessToken),
    fields: {
      reason: reasonId,
      detail,
    },
  });

  res.status(result.status).json(result.data);
}
