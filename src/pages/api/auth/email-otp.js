import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postEmptyToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken } = req.body || {};

  if (!accessToken) {
    res.status(401).json({ message: "Access token is required" });
    return;
  }

  const result = await postEmptyToShopdibz(
    SHOPDIBZ_URLS.resendEmailOtp,
    accessToken,
  );

  res.status(result.status).json(result.data);
}
