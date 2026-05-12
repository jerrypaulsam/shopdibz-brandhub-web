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
    groupId = 0,
    name = "",
    active = false,
    show = false,
  } = req.body || {};

  if (!accessToken || !Number(groupId) || !String(name).trim()) {
    res.status(400).json({ message: "Missing product group update fields" });
    return;
  }

  const isActive = active === true || active === "true";
  const isShown = show === true || show === "true";

  try {
    const result = await submitStoreForm({
      endpoint: `${SHOPDIBZ_URLS.products}product_group/${Number(groupId)}/update/`,
      accessToken: String(accessToken),
      method: "PUT",
      fields: {
        name: String(name).trim(),
        active: isActive,
        show: isShown,
      },
    });

    res.status(result.status).json(result.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Product group update failed",
    });
  }
}
