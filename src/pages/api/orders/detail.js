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
  const { orderId = "" } = req.query || {};

  if (!accessToken || !orderId) {
    res.status(400).json({ message: "Access token and order ID are required" });
    return;
  }

  try {
    const result = await getStoreJsonWithAuth({
      endpoint: `${SHOPDIBZ_URLS.orderDetail}${orderId}/`,
      accessToken: String(accessToken),
    });

    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Order detail request failed",
    });
  }
}
