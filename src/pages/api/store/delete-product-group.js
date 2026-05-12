import { SHOPDIBZ_URLS } from "@/src/api/config";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", groupId = 0 } = req.body || {};

  if (!accessToken || !Number(groupId)) {
    res.status(400).json({ message: "Missing product group delete fields" });
    return;
  }

  try {
    const result = await requestStoreJsonWithAuth({
      endpoint: `${SHOPDIBZ_URLS.products}product_group/${Number(groupId)}/delete/`,
      accessToken: String(accessToken),
      method: "DELETE",
    });

    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Product group delete failed",
    });
  }
}
