import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    storeUrl = "",
    name = "",
    discountType = "0",
    discount = 0,
    showOnHome = false,
    imageBase64 = "",
    fileName = "group-cover.jpg",
  } = req.body || {};

  if (!accessToken || !storeUrl || !name || !imageBase64) {
    res.status(400).json({ message: "Missing product group create fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.products}${storeUrl}/product_group/create/`,
    accessToken: String(accessToken),
    fields: {
      name,
      disType: discountType,
      discount,
      show: Boolean(showOnHome),
    },
    file: {
      field: "cImg",
      base64: String(imageBase64),
      filename: String(fileName),
    },
  });

  res.status(result.status).json(result.data);
}
