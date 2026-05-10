import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", ticketId = 0, message = "" } = req.body || {};

  if (!accessToken || !ticketId || !message) {
    res.status(400).json({ message: "Access token, ticket ID, and message are required" });
    return;
  }

  try {
    const response = await postFormToShopdibz(
      `${SHOPDIBZ_URLS.createSupportMessage}${ticketId}/create/user/`,
      { msg: message },
      accessToken,
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Support message send failed",
    });
  }
}
