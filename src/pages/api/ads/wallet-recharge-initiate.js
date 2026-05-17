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

  const { storeUrl = "", amount = "" } = req.body || {};
  const numericAmount = Number(amount);

  if (!storeUrl) {
    res.status(400).json({ message: "Store URL is required" });
    return;
  }

  if (!Number.isFinite(numericAmount) || numericAmount < 100) {
    res.status(400).json({ message: "Please enter an amount of Rs. 100 or more." });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.adWalletRechargeInitiateJson}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeUrl: String(storeUrl),
          amount: numericAmount,
        }),
      },
    );
    const data = await parseJsonResponse(response);

    if (response.status === 400) {
      res.status(400).json({
        message: data?.message || "Unable to start ad wallet recharge.",
      });
      return;
    }

    if (response.status !== 200) {
      res.status(response.status).json({
        message: data?.message || "Unable to start ad wallet recharge.",
      });
      return;
    }

    const key = String(data?.key || "").trim();
    const orderId = String(data?.order_id || "").trim();
    const currency = String(data?.currency || "").trim();
    const callbackUrl = String(data?.callback_url || "").trim();
    const razorpayAmount = Number(data?.amount || 0);

    if (!key || !orderId || !currency || !callbackUrl || !razorpayAmount) {
      res.status(502).json({
        message: "Payment gateway details were not returned by the backend.",
      });
      return;
    }

    res.status(200).json({
      key,
      orderId,
      amount: razorpayAmount,
      currency,
      callbackUrl,
      companyName: String(data?.company_name || DEFAULT_COMPANY_NAME).trim(),
      image: String(data?.company_logo_url || DEFAULT_PAYMENT_IMAGE).trim(),
      storeUrl: String(data?.store_url || storeUrl),
      displayAmount: Number(data?.display_amount || numericAmount),
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to start ad wallet recharge.",
    });
  }
}
