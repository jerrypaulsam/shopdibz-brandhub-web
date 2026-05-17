export default async function handler(req, res) {
  const payload = req.method === "POST" ? req.body || {} : req.query || {};
  const storeUrl = String(
    payload.store_url ||
      payload.storeUrl ||
      req.query.store_url ||
      req.query.storeUrl ||
      "",
  ).trim();
  const paymentId = String(payload.razorpay_payment_id || "").trim();
  const orderId = String(payload.razorpay_order_id || "").trim();
  const signature = String(payload.razorpay_signature || "").trim();
  const errorCode = String(payload.error?.code || payload.error_code || "").trim();
  const errorDescription = String(
    payload.error?.description || payload.error_description || "",
  ).trim();

  const query = new URLSearchParams();

  if (storeUrl) {
    query.set("store_url", storeUrl);
  }

  if (paymentId) {
    query.set("payment_id", paymentId);
  }

  if (orderId) {
    query.set("order_id", orderId);
  }

  if (signature) {
    query.set("signature", signature);
  }

  if (errorCode || errorDescription) {
    query.set("payment", "failed");
  } else {
    query.set("payment", "processing");
  }

  if (errorCode) {
    query.set("error_code", errorCode);
  }

  if (errorDescription) {
    query.set("error_description", errorDescription);
  }

  res.redirect(
    303,
    `/subscription-payment-status${query.toString() ? `?${query.toString()}` : ""}`,
  );
}
