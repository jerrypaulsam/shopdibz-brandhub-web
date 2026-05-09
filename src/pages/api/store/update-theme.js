import { SHOPDIBZ_URLS } from "@/src/api/config";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", themeId = "" } = req.body || {};

  if (!accessToken || !themeId) {
    res.status(400).json({ message: "Theme fields are missing" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: SHOPDIBZ_URLS.storeThemeUpdate,
    accessToken,
    method: "PUT",
    fields: {
      theme: themeId,
    },
  });

  res.status(result.status).json(result.data);
}
