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
    slug = "",
    variant = "",
    name = "",
    typeMap = "",
    mrp = 0,
    price = 0,
    skuCode = "",
    inStock = "S",
    maxStock = 0,
  } = req.body || {};

  if (!accessToken || !slug) {
    res.status(400).json({ message: "Access token and slug are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.products}add/new_variation/${slug}/`,
    accessToken,
    fields: {
      variant,
      name,
      type_map: typeMap,
      mrp,
      price,
      sku_code: skuCode,
      in_stock: inStock,
      max_stock: maxStock,
    },
  });

  res.status(result.status).json(result.data);
}
