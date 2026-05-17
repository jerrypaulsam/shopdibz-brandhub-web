import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email = "" } = req.body || {};
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail) {
    res.status(400).json({ message: "Email is required." });
    return;
  }

  try {
    const response = await postFormToShopdibz(SHOPDIBZ_URLS.forgotOtp, {
      email: normalizedEmail,
    });

    if (response.status === 200) {
      res.status(200).json({
        message: "OTP sent to your email.",
      });
      return;
    }

    if (response.status === 404) {
      res.status(404).json({
        message: "No account found for this email.",
      });
      return;
    }

    if (response.status === 400) {
      res.status(400).json({
        message: "Too many OTP requests. Please wait a few minutes and try again.",
      });
      return;
    }

    res.status(response.status).json({
      message: "Unable to send OTP right now.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to send OTP right now.",
    });
  }
}
