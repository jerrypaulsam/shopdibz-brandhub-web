import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email = "", otp = "" } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedOtp = String(otp || "").trim();

  if (!normalizedEmail || !normalizedOtp) {
    res.status(400).json({ message: "Email and OTP are required." });
    return;
  }

  try {
    const response = await postFormToShopdibz(SHOPDIBZ_URLS.forgotOtpVerify, {
      email: normalizedEmail,
      otp: normalizedOtp,
    });

    if (response.status === 200) {
      const authData =
        response.data && typeof response.data === "object" && "data" in response.data
          ? response.data.data
          : {};

      res.status(200).json({
        message: "OTP verified.",
        data: authData,
      });
      return;
    }

    if (response.status === 403) {
      res.status(403).json({
        message: "Invalid OTP. Please try again.",
      });
      return;
    }

    if (response.status === 408) {
      res.status(408).json({
        message: "OTP expired. Please request a new one.",
      });
      return;
    }

    if (response.status === 429) {
      const message =
        response.data && typeof response.data === "object" && "message" in response.data
          ? String(response.data.message || "")
          : "Too many failed attempts. Please request a new OTP.";

      res.status(429).json({
        message: message || "Too many failed attempts. Please request a new OTP.",
      });
      return;
    }

    res.status(response.status).json({
      message: "Unable to verify OTP right now.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to verify OTP right now.",
    });
  }
}
