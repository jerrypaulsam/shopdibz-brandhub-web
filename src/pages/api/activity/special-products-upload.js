import { SHOPDIBZ_URLS } from "@/src/api/config";
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

  const { accessToken = "", storeUrl = "", type = "", fileBase64 = "", fileName = "special-products.xlsm" } = req.body || {};

  if (!accessToken || !storeUrl || !type || !fileBase64) {
    res.status(400).json({ message: "Missing special upload fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.bulkSpecial}${storeUrl}/`,
    accessToken: String(accessToken),
    method: "PUT",
    fields: {},
    query: {
      type,
    },
    file: {
      field: "sheet1",
      base64: String(fileBase64),
      filename: String(fileName),
    },
  });

  res.status(result.status).json({
    ...result.data,
    __queryType: type,
  });
}
