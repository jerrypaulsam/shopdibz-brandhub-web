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
    groupId = 0,
    imageBase64 = "",
    fileName = "group-cover.jpg",
  } = req.body || {};

  if (!accessToken || !Number(groupId) || !imageBase64) {
    res.status(400).json({ message: "Missing product group cover fields" });
    return;
  }

  try {
    const result = await submitStoreForm({
      endpoint: `${SHOPDIBZ_URLS.products}product_group/${Number(groupId)}/cover/update/`,
      accessToken: String(accessToken),
      method: "PUT",
      fields: {},
      file: {
        field: "cImg",
        base64: String(imageBase64),
        filename: String(fileName),
      },
    });

    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Product group cover update failed",
    });
  }
}
