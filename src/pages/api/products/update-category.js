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
    categoryId = 0,
    subCategoryId = 0,
    itemSubCategoryId = null,
  } = req.body || {};

  if (!accessToken || !slug || !categoryId || !subCategoryId) {
    res.status(400).json({ message: "Access token, slug, category, and subcategory are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.updateCategory}${slug}/update/`,
    accessToken,
    method: "PUT",
    fields: {
      cat: String(categoryId),
      sCat: String(subCategoryId),
      ...(itemSubCategoryId ? { iSub: String(itemSubCategoryId) } : {}),
    },
  });

  res.status(result.status).json(result.data);
}
