import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { postEmptyToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "" } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken) {
    res.status(401).json({ message: "Access token is required" });
    return;
  }

  try {
    const result = await postEmptyToShopdibz(
      SHOPDIBZ_URLS.resendMobileUpdateOtp,
      accessToken,
    );

    if (result.status === 200) {
      res.status(200).json({
        message: "OTP resent successfully.",
      });
      return;
    }

    res.status(result.status).json({
      message: "Unable to resend OTP right now.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Unable to resend OTP right now.",
    });
  }
}
