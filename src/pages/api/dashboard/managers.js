import { SHOPDIBZ_URLS } from "@/src/api/config";
import { proxyDashboardGet } from "@/src/api/serverDashboardProxy";

export default function handler(req, res) {
  const authHeader = String(req.headers.authorization || "");
  const accessToken =
    authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const { storeUrl = "" } = req.query;

  return proxyDashboardGet(req, res, {
    endpoint: `${SHOPDIBZ_URLS.managers}${storeUrl}/`,
    accessToken,
  });
}
