import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";
import { resolveOrderTab } from "@/src/utils/orders";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", storeUrl = "", tab = "pending", page = "1" } = req.query || {};

  if (!accessToken || !storeUrl) {
    res.status(400).json({ message: "Access token and store URL are required" });
    return;
  }

  const activeTab = resolveOrderTab(String(tab || "pending"));

  const result = await getStoreJsonWithAuth({
    endpoint: `${SHOPDIBZ_URLS.orderList}${storeUrl}/`,
    accessToken: String(accessToken),
    query: {
      status: activeTab.status,
      page: Number(page || 1) || 1,
    },
  });

  res.status(result.status).json(result.data);
}
