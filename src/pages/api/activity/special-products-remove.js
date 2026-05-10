import { SHOPDIBZ_URLS } from "@/src/api/config";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", type = "" } = req.body || {};

  if (!accessToken || !storeUrl || !type) {
    res.status(400).json({ message: "Missing special remove fields" });
    return;
  }

  const result = await requestStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.bulkSpecialRemove}${storeUrl}/`,
    accessToken: String(accessToken),
    method: "DELETE",
    query: {
      type,
    },
  });

  res.status(result.status).json(result.data);
}
