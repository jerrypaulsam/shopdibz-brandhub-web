import { SHOPDIBZ_URLS } from "@/src/api/config";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", imageId = 0 } = req.body || {};

  if (!accessToken || !imageId) {
    res.status(400).json({ message: "Access token and image id are required" });
    return;
  }

  const result = await requestStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.products}${imageId}/make_it_cover/`,
    accessToken,
    method: "PUT",
  });

  res.status(result.status).json(result.data);
}
