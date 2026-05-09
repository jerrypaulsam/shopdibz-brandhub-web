import { SHOPDIBZ_URLS } from "@/src/api/config";
import { proxyDashboardGet } from "@/src/api/serverDashboardProxy";

export default function handler(req, res) {
  const { accessToken = "", storeUrl = "" } = req.query;

  return proxyDashboardGet(req, res, {
    endpoint: `${SHOPDIBZ_URLS.storeInfo}${storeUrl}/`,
    accessToken,
  });
}
