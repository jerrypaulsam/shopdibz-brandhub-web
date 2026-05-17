import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken = "", otp = "" } = req.body || {};
  const normalizedOtp = String(otp || "").replace(/\D/g, "").trim();

  if (!accessToken || !normalizedOtp) {
    res.status(400).json({ message: "Access token and OTP are required" });
    return;
  }

  try {
    const result = await postFormToShopdibz(
      SHOPDIBZ_URLS.verifyMobileUpdate,
      {
        otp: normalizedOtp,
      },
      accessToken,
    );

    if (result.status === 200) {
      res.status(200).json({
        message: "Mobile number updated successfully.",
      });
      return;
    }

    if (result.status === 400) {
      res.status(400).json({
        message: "Invalid OTP or mobile update session expired.",
      });
      return;
    }

    if (result.status === 429) {
      const apiMessage =
        result.data && typeof result.data === "object" && "message" in result.data
          ? String(result.data.message || "")
          : "";

      res.status(429).json({
        message: apiMessage || "Too many failed attempts. Please request a new OTP.",
      });
      return;
    }

    res.status(result.status).json({
      message: "Unable to verify mobile OTP.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to verify mobile OTP.",
    });
  }
}
