import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", chartBase64 = "" } = req.body || {};

  if (!accessToken || !storeUrl || !chartBase64) {
    res.status(400).json({ message: "Size chart upload fields are missing" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.updateSizeChart}${storeUrl}/`,
    accessToken,
    method: "PUT",
    file: {
      field: "chart",
      base64: chartBase64,
      filename: `size-guide-${storeUrl}.jpg`,
    },
  });

  res.status(result.status).json(result.data);
}
