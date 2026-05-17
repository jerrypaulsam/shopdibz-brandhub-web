import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";

const DEFAULT_COMPANY_NAME = "Shopdibz Private Limited";
const DEFAULT_PAYMENT_IMAGE =
  "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/logo1.png";

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

  const { storeUrl = "", code = "" } = req.body || {};

  if (!storeUrl || !code) {
    res.status(400).json({ message: "Store URL and user code are required" });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.onboardPaymentJson}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeUrl: String(storeUrl),
          code: String(code),
        }),
      },
    );
    const data = await parseJsonResponse(response);

    if (response.status === 400 || response.status === 409) {
      res.status(response.status).json({
        message: data?.message || "Unable to start payment.",
      });
      return;
    }

    if (response.status !== 200) {
      res.status(response.status).json({
        message: data?.message || "Unable to start payment.",
      });
      return;
    }

    const key = String(data?.key || "").trim();
    const amount = Number(data?.amount || 0);
    const currency = String(data?.currency || "").trim();
    const orderId = String(data?.order_id || "").trim();
    const callbackUrl = String(data?.callback_url || "").trim();

    if (!key || !amount || !currency || !orderId || !callbackUrl) {
      res.status(502).json({
        message: "Payment gateway details were not returned by the backend.",
      });
      return;
    }

    res.status(200).json({
      key,
      amount,
      currency,
      orderId,
      callbackUrl,
      companyName: String(data?.company_name || DEFAULT_COMPANY_NAME).trim(),
      image: String(data?.company_logo_url || DEFAULT_PAYMENT_IMAGE).trim(),
      code: String(data?.code || code),
      storeUrl: String(data?.store_url || storeUrl),
      displayAmount: Number(data?.display_amount || 0),
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Unable to start payment.",
    });
  }
}
