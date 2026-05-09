import { SHOPDIBZ_URLS } from "@/src/api/config";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { refreshToken, userCode = "" } = req.body || {};

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  const result = await postFormToShopdibz(SHOPDIBZ_URLS.logout, {
    refresh: refreshToken,
    userCode,
  });

  res.status(result.status).json(result.data);
}
