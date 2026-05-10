import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", variants = false, fileBase64 = "", fileName = "bulk-update.xlsm" } = req.body || {};

  if (!accessToken || !storeUrl || !fileBase64) {
    res.status(400).json({ message: "Missing bulk update fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.bulkUpdate}${storeUrl}/`,
    accessToken: String(accessToken),
    method: "PUT",
    fields: {
      var: variants ? 1 : 0,
    },
    file: {
      field: "sheet1",
      base64: String(fileBase64),
      filename: String(fileName),
    },
  });

  res.status(result.status).json(result.data);
}
