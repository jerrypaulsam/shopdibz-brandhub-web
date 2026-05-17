import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", mobile = "" } = req.body || {};
  const normalizedMobile = String(mobile || "").replace(/\D/g, "").slice(-10);

  if (!accessToken || normalizedMobile.length !== 10) {
    res.status(400).json({ message: "Access token and valid mobile number are required" });
    return;
  }

  try {
    const result = await postFormToShopdibz(
      SHOPDIBZ_URLS.generateMobileUpdateOtp,
      {
        mobNo: normalizedMobile,
      },
      accessToken,
    );

    if (result.status === 429) {
      const apiMessage =
        result.data && typeof result.data === "object" && "message" in result.data
          ? String(result.data.message || "")
          : "";

      res.status(429).json({
        message: apiMessage || "Too many OTP requests. Please try again later.",
      });
      return;
    }

    if (result.status === 200) {
      res.status(200).json({
        message: "OTP sent to your mobile number.",
      });
      return;
    }

    res.status(result.status).json({
      message: "Unable to send mobile verification OTP.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to send mobile verification OTP.",
    });
  }
}
