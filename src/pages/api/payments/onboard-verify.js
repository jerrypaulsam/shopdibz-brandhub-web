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
    storeUrl = "",
    code = "",
  } = req.body || {};

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !storeUrl) {
    res.status(400).json({ message: "Missing payment verification fields" });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.onboardPaymentVerifyJson}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: String(razorpayOrderId),
          razorpay_payment_id: String(razorpayPaymentId),
          razorpay_signature: String(razorpaySignature),
          storeUrl: String(storeUrl),
          code: code ? String(code) : "",
        }),
      },
    );
    const data = await parseJsonResponse(response);

    if (response.status === 400 || response.status === 404) {
      res.status(response.status).json({
        success: false,
        message:
          data?.message ||
          "Payment verification failed. Please contact support if you were charged.",
      });
      return;
    }

    if (response.status !== 200) {
      res.status(response.status).json({
        success: false,
        message: data?.message || "Payment verification failed. Please try again.",
      });
      return;
    }

    if (data?.status === "pending") {
      res.status(409).json({
        success: false,
        message:
          data?.message ||
          "Payment verification is still pending. Please try again in a moment.",
      });
      return;
    }

    res.status(200).json({
      success: Boolean(data?.success),
      message: data?.message || "",
      redirectTo: data?.redirect_to || "/home",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Payment verification failed.",
    });
  }
}
