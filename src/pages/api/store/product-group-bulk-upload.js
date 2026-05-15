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

  const {
    accessToken = "",
    storeUrl = "",
    groupId = 0,
    fileBase64 = "",
    fileName = "product-group.xlsm",
  } = req.body || {};

  if (!accessToken || !storeUrl || !Number(groupId) || !fileBase64) {
    res.status(400).json({ message: "Missing product group bulk upload fields" });
    return;
  }

  try {
    const result = await submitStoreForm({
      endpoint: `${SHOPDIBZ_URLS.bulkProductGroup}${storeUrl}/`,
      accessToken: String(accessToken),
      method: "PUT",
      fields: {},
      query: {
        gId: Number(groupId),
      },
      file: {
        field: "sheet1",
        base64: String(fileBase64),
        filename: String(fileName),
      },
    });

    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Product group bulk upload failed",
    });
  }
}
