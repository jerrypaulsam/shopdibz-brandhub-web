/**
 * @param {string} value
 * @returns {string}
 */
function readField(value) {
  return Array.isArray(value) ? String(value[0] || "") : String(value || "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    pickupPin = "",
    deliveryPin = "",
    weight = "",
    length = "",
    width = "",
    height = "",
    shippingMode = "air",
  } = req.body || {};

  const query = new URLSearchParams({
    md: shippingMode === "air" ? "E" : "S",
    ss: "Delivered",
    d_pin: readField(deliveryPin),
    o_pin: readField(pickupPin),
    cgm: readField(weight),
    pt: "Pre-paid",
  });

  const response = await fetch(
    `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?${query.toString()}`,
    {
      headers: {
        Authorization: `Token ${process.env.DELHIVERY_TRACK_TOKEN || ""}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json().catch(() => ({}));

  res.status(response.status).json({
    ...data,
    meta: {
      pickupPin,
      deliveryPin,
      weight,
      length,
      width,
      height,
      shippingMode,
    },
  });
}
