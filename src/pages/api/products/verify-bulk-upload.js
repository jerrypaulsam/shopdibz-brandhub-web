import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreMultiForm } from "@/src/api/serverStoreProxy";

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

  const {
    accessToken = "",
    storeUrl = "",
    variants = false,
    fileBase64 = "",
    fileName = "",
  } = req.body || {};

  if (!accessToken || !storeUrl || !fileBase64) {
    res.status(400).json({ message: "Access token, store URL, and sheet are required" });
    return;
  }

  const result = await submitStoreMultiForm({
    endpoint: `${SHOPDIBZ_URLS.verifyBulkUpload}${storeUrl}/`,
    accessToken,
    fields: {
      var: variants ? 1 : 0,
    },
    files: [
      {
        field: "sheet1",
        base64: fileBase64,
        filename: fileName || `bulk-verification-${storeUrl}.xlsm`,
      },
    ],
  });

  res.status(result.status).json(result.data);
}
