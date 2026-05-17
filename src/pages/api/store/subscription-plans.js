import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { storeUrl = "" } = req.body || {};

  if (!storeUrl) {
    res.status(400).json({ message: "Store URL is required" });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.subscriptionPlansJson}?store_url=${encodeURIComponent(String(storeUrl))}`,
    );
    const data = await parseJsonResponse(response);

    if (response.status === 400) {
      res.status(400).json({
        message: data?.message || "Subscription plans are unavailable for this store.",
      });
      return;
    }

    if (response.status !== 200) {
      res.status(response.status).json({
        message: data?.message || "Unable to load subscription plans.",
      });
      return;
    }

    if (!Array.isArray(data?.plans) || !data.plans.length) {
      res.status(502).json({
        message: "Subscription plan details were not returned by the backend.",
      });
      return;
    }

    res.status(200).json({
      currentPlan: String(data?.current_plan || "F").trim().toUpperCase(),
      plans: data.plans.map((plan) => ({
        code: String(plan?.code || "").trim().toUpperCase(),
        name: String(plan?.name || "").trim(),
        price: Number(plan?.price || 0),
        priceLabel: String(plan?.price_label || "").trim(),
        features: Array.isArray(plan?.features) ? plan.features : [],
        recommended: Boolean(plan?.recommended),
      })),
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to load subscription plans.",
    });
  }
}
