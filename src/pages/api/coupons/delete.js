import { SHOPDIBZ_URLS } from "@/src/api/config";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", couponId = 0 } = req.body || {};

  if (!accessToken || !couponId) {
    res.status(400).json({ message: "Access token and coupon id are required" });
    return;
  }

  try {
    const response = await requestStoreJsonWithAuth({
      endpoint: `${SHOPDIBZ_URLS.coupon}${couponId}/delete/`,
      accessToken: String(accessToken),
      method: "DELETE",
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Coupon delete failed",
    });
  }
}
