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

  const { storeUrl = "", planType = "" } = req.body || {};
  const normalizedPlanType = String(planType || "").trim().toUpperCase();

  if (!storeUrl || !["S", "G", "P"].includes(normalizedPlanType)) {
    res.status(400).json({ message: "Store URL and plan type are required" });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.subscriptionCreateJson}${encodeURIComponent(String(storeUrl))}/json/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: normalizedPlanType,
        }),
      },
    );
    const data = await parseJsonResponse(response);

    if (response.status === 400 || response.status === 406 || response.status === 409) {
      res.status(response.status).json({
        message: data?.message || "Unable to start subscription checkout.",
      });
      return;
    }

    if (response.status !== 200) {
      res.status(response.status).json({
        message: data?.message || "Unable to start subscription checkout.",
      });
      return;
    }

    const key = String(data?.key || "").trim();
    const subscriptionId = String(data?.subscription_id || "").trim();
    const callbackUrl = String(data?.callback_url || "").trim();

    if (!key || !subscriptionId || !callbackUrl) {
      res.status(502).json({
        message: "Subscription checkout details were not returned by the backend.",
      });
      return;
    }

    res.status(200).json({
      key,
      subscriptionId,
      companyName: String(data?.company_name || "Shopdibz Private Limited").trim(),
      description: String(data?.description || "Subscription Plan").trim(),
      image: String(data?.company_logo_url || "").trim(),
      callbackUrl,
      userName: String(data?.user_name || "").trim(),
      userEmail: String(data?.user_email || "").trim(),
      userContact: String(data?.user_contact || "").trim(),
      storeUrl: String(data?.store_url || storeUrl),
      planType: String(data?.plan_code || normalizedPlanType).trim().toUpperCase(),
      displayAmount: Number(data?.display_amount || 0),
      planName: String(data?.plan_name || "").trim(),
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to start subscription checkout.",
    });
  }
}
