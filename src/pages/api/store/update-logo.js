import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", logoBase64 = "" } = req.body || {};

  if (!accessToken || !storeUrl || !logoBase64) {
    res.status(400).json({ message: "Logo upload fields are missing" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: SHOPDIBZ_URLS.updateStoreLogo,
    accessToken,
    method: "PUT",
    file: {
      field: "logo",
      base64: logoBase64,
      filename: `store-logo-${storeUrl}.jpg`,
    },
  });

  res.status(result.status).json(result.data);
}
