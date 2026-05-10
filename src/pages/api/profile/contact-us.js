import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    type = "",
    message = "",
    orderId = "",
  } = req.body || {};

  if (!accessToken || !type || !message) {
    res.status(400).json({ message: "Access token, type, and message are required" });
    return;
  }

  try {
    const response = await postFormToShopdibz(
      SHOPDIBZ_URLS.contactUs,
      {
        type,
        message,
        orderId,
      },
      accessToken,
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Contact request failed",
    });
  }
}
