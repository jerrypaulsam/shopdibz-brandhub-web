import { SHOPDIBZ_URLS } from "@/src/api/config";
import { putFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    refreshToken = "",
    newPassword = "",
    confirmPassword = "",
  } = req.body || {};

  if (!accessToken || !refreshToken || !newPassword || !confirmPassword) {
    res.status(400).json({ message: "Missing password reset fields." });
    return;
  }

  try {
    const response = await putFormToShopdibz(
      SHOPDIBZ_URLS.forgotPasswordReset,
      {
        new: String(newPassword),
        confirm: String(confirmPassword),
        refresh: String(refreshToken),
      },
      String(accessToken),
    );

    if (response.status === 200) {
      res.status(200).json({
        message: "Password reset successful. Please log in.",
      });
      return;
    }

    if (response.status === 400) {
      res.status(400).json({
        message: "Passwords do not match.",
      });
      return;
    }

    if (response.status === 401 || response.status === 403) {
      res.status(response.status).json({
        message: "Reset session expired. Please request a new OTP.",
      });
      return;
    }

    res.status(response.status).json({
      message: "Unable to reset password right now.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Unable to reset password right now.",
    });
  }
}
