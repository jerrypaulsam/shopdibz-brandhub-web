import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "", storeUrl = "", logoBase64 = "" } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken || !logoBase64) {
    res.status(400).json({ message: "Access token and logo are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: SHOPDIBZ_URLS.updateStoreLogo,
    accessToken,
    method: "PUT",
    file: {
      field: "logo",
      base64: logoBase64,
      filename: storeUrl ? `storeLogo-${storeUrl}.jpg` : "storeLogo.jpg",
    },
  });

  res.status(result.status).json(result.data);
}
