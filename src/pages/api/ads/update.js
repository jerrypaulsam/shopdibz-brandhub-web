import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "", campaignId, budget = 0, dailyBudget = 0, endDate = "" } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken || !campaignId || !endDate) {
    res.status(400).json({ message: "Missing campaign update fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.adCampaignUpdate}update/${campaignId}/`,
    accessToken: String(accessToken),
    method: "PATCH",
    fields: {
      budget,
      daily_budget: dailyBudget,
      end_date: endDate,
    },
  });

  res.status(result.status).json(result.data);
}
