import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken, otp } = req.body || {};

  if (!accessToken || !otp) {
    res.status(400).json({ message: "Access token and OTP are required" });
    return;
  }

  const result = await postFormToShopdibz(
    SHOPDIBZ_URLS.verifyEmail,
    {
      otp,
    },
    accessToken,
  );

  res.status(result.status).json(result.data);
}
