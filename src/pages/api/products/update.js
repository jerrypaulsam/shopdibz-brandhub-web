import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "", slug = "", data = {} } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken || !slug) {
    res.status(400).json({ message: "Access token and slug are required" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.products}${slug}/update/`,
    accessToken,
    method: "PUT",
    fields: {
      data: JSON.stringify(data),
    },
  });

  res.status(result.status).json(result.data);
}
