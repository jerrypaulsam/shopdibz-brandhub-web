import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const authHeader = String(req.headers.authorization || "");
  const accessToken =
    authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const {
    orderId,
    company = "",
    trackingNo = "",
    trackingUrl = "",
  } = req.body || {};

  if (!accessToken || !orderId || !company || !trackingNo) {
    res.status(400).json({ message: "Missing tracking update fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.orderTracking}${orderId}/`,
    accessToken: String(accessToken),
    method: "PUT",
    fields: {
      shComp: company,
      trackNo: trackingNo,
      tUrl: trackingUrl,
    },
  });

  res.status(result.status).json(result.data);
}
