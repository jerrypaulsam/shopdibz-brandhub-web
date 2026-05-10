import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", orderId, status = "" } = req.body || {};

  if (!accessToken || !orderId || !status) {
    res.status(400).json({ message: "Access token, order ID, and status are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.orderStatus}${orderId}/all/`,
    accessToken: String(accessToken),
    method: "PUT",
    fields: {
      status,
    },
  });

  res.status(result.status).json(result.data);
}
