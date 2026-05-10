import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", url = "", key = "", secret = "" } = req.body || {};

  if (!accessToken || !storeUrl || !url || !key || !secret) {
    res.status(400).json({ message: "Missing required WooCommerce fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.createWooCommerceCredentials}${storeUrl}/`,
    accessToken,
    method: "POST",
    fields: {
      url,
      key,
      secret,
    },
  });

  res.status(result.status).json(result.data);
}
