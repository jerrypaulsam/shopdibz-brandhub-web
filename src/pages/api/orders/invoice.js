import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const authHeader = String(req.headers.authorization || "");
  const accessToken =
    authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const { storeUrl = "", orderId = "" } = req.query || {};

  if (!accessToken || !storeUrl || !orderId) {
    res.status(400).json({ message: "Access token, store URL, and order ID are required" });
    return;
  }

  try {
    const result = await getStoreJsonWithAuth({
      endpoint: `${SHOPDIBZ_URLS.payments}invoice/${storeUrl}/order/${orderId}/web/`,
      accessToken: String(accessToken),
    });

    if (result.status === 404) {
      res.status(404).json({ message: "Invoice unavailable" });
      return;
    }

    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Invoice request failed",
    });
  }
}
