import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    orderId,
    packageWidth,
    packageLength,
    packageHeight,
    packageWeight,
  } = req.body || {};

  if (!accessToken || !orderId) {
    res.status(400).json({ message: "Access token and order ID are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.orderStatus}${orderId}/packed/`,
    accessToken: String(accessToken),
    method: "PUT",
    fields: {
      width: packageWidth,
      length: packageLength,
      height: packageHeight,
      weight: packageWeight,
    },
  });

  res.status(result.status).json(result.data);
}
