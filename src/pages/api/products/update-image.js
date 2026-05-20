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

  const {
    accessToken: explicitAccessToken = "",
    imageId = 0,
    imageBase64 = "",
    filename = "",
    cover = false,
  } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken || !imageId || !imageBase64) {
    res.status(400).json({ message: "Access token, image id, and image are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.products}${imageId}/update/image/`,
    accessToken,
    method: "PUT",
    fields: {
      cover,
    },
    file: {
      field: "images",
      base64: imageBase64,
      filename: filename || `update-image-${imageId}.jpg`,
    },
  });

  res.status(result.status).json(result.data);
}
