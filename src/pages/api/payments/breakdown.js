import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", paymentId = "" } = req.query || {};

  if (!accessToken || !paymentId) {
    res.status(400).json({ message: "Access token and payment ID are required" });
    return;
  }

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.payments}seller_payment/breakdown/${paymentId}/`,
    accessToken: String(accessToken),
  });

  res.status(result.status).json(result.data);
}
