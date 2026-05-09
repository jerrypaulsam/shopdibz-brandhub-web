import { SHOPDIBZ_URLS } from "@/src/api/config";
import { proxyDashboardGet } from "@/src/api/serverDashboardProxy";

export default function handler(req, res) {
  const {
    accessToken = "",
    storeUrl = "",
    status = "AC",
    page = 1,
  } = req.query;

  return proxyDashboardGet(req, res, {
    endpoint: `${SHOPDIBZ_URLS.orders}${storeUrl}/`,
    accessToken,
    query: {
      status,
      page,
    },
  });
}
