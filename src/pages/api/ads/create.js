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
    storeUrl = "",
    budgetType = "Total",
    budget = 0,
    dailyBudget = 0,
    startDate = "",
    endDate = "",
    productSlug = "",
    campaignType = "All",
    biddingType = "CPC",
  } = req.body || {};

  if (!accessToken || !storeUrl || !startDate || !endDate) {
    res.status(400).json({ message: "Missing campaign create fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.adCampaignCreate}${storeUrl}/`,
    accessToken: String(accessToken),
    fields: {
      budget_type: budgetType === "Total" ? "TOTAL" : "DAILY",
      budget,
      daily_budget: dailyBudget,
      start_date: startDate,
      end_date: endDate,
      slug: productSlug,
      type: campaignType === "All" ? "STORE" : "PRODUCT",
      bidding: biddingType,
    },
  });

  res.status(result.status).json(result.data);
}
