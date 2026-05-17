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
      `${API_BASE_URL}${SHOPDIBZ_URLS.subscriptionVerifyJson}?store_url=${encodeURIComponent(String(storeUrl))}`,
    );
    const data = await parseJsonResponse(response);

    if (response.status === 400) {
      res.status(400).json({
        verified: false,
        statusCode: 400,
        message: data?.message || "Subscription verification request was rejected by the backend.",
      });
      return;
    }

    if (response.status !== 200) {
      res.status(response.status).json({
        verified: false,
        statusCode: response.status,
        message: data?.message || "Subscription verification could not be completed.",
      });
      return;
    }

    res.status(200).json({
      verified: Boolean(data?.success),
      statusCode: 200,
      status: String(data?.status || ""),
      subscriptionActive: Boolean(data?.subscription_active),
      currentPlan: String(data?.current_plan || "F").trim().toUpperCase(),
      storeUrl: String(data?.store_url || storeUrl),
    });
  } catch (error) {
    res.status(500).json({
      verified: false,
      message:
        error instanceof Error
          ? error.message
          : "Subscription verification failed.",
    });
  }
}
