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

  const {
    razorpay_order_id: razorpayOrderId = "",
    razorpay_payment_id: razorpayPaymentId = "",
    razorpay_signature: razorpaySignature = "",
  } = req.body || {};

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400).json({ message: "Missing payment verification fields" });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.adWalletRechargeVerifyJson}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: String(razorpayOrderId),
          razorpay_payment_id: String(razorpayPaymentId),
          razorpay_signature: String(razorpaySignature),
        }),
      },
    );
    const data = await parseJsonResponse(response);

    if (response.status === 400) {
      res.status(400).json({
        success: false,
        message:
          data?.message ||
          "Wallet recharge verification failed. Please contact support if you were charged.",
      });
      return;
    }

    if (response.status !== 200) {
      res.status(response.status).json({
        success: false,
        message:
          data?.message || "Wallet recharge verification failed. Please try again.",
      });
      return;
    }

    res.status(200).json({
      success: Boolean(data?.success),
      message: data?.message || "",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Wallet recharge verification failed.",
    });
  }
}
