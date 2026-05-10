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
    couponCode = "",
    type = "",
    minAmount = "",
    discountAmount = "",
    validFrom = "",
    validTo = "",
    quantity = "",
    percentage = "",
    maxDiscountAmount = "",
  } = req.body || {};

  if (
    !accessToken ||
    !storeUrl ||
    !couponCode ||
    !type ||
    !minAmount ||
    !validFrom ||
    !validTo ||
    !quantity
  ) {
    res.status(400).json({ message: "Missing coupon create fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.coupon}${storeUrl}/create/`,
    accessToken: String(accessToken),
    fields: {
      code: couponCode,
      type,
      min_amt: minAmount,
      amount: discountAmount || "",
      valid_from: validFrom,
      valid_to: validTo,
      max_value: quantity,
      per: percentage || "",
      max_perc_amt: maxDiscountAmount || "",
    },
  });

  res.status(result.status).json(result.data);
}
