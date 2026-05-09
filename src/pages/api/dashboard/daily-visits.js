import { SHOPDIBZ_URLS } from "@/src/api/config";
import { proxyDashboardGet } from "@/src/api/serverDashboardProxy";

export default function handler(req, res) {
  const { accessToken = "", storeUrl = "", page = 1 } = req.query;

  return proxyDashboardGet(req, res, {
    endpoint: `${SHOPDIBZ_URLS.dailyVisits}${storeUrl}/daily_visits/`,
    accessToken,
    query: {
      page,
    },
  });
}
