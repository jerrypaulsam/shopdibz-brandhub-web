import { SHOPDIBZ_URLS } from "@/src/api/config";
import {
  clearAuthCookies,
  getRequestRefreshToken,
} from "@/src/api/authCookies";
import { postFormToShopdibz } from "@/src/api/serverAuthProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { refreshToken = "", userCode = "" } = req.body || {};
  const resolvedRefreshToken = getRequestRefreshToken(req, refreshToken);

  if (!resolvedRefreshToken) {
    clearAuthCookies(res);
    res.status(200).json({ message: "Logout completed." });
    return;
  }

  const result = await postFormToShopdibz(SHOPDIBZ_URLS.logout, {
    refresh: resolvedRefreshToken,
    userCode,
  });

  clearAuthCookies(res);

  if ([400, 401, 403, 404].includes(result.status)) {
    res.status(200).json({ message: "Logout completed." });
    return;
  }

  res.status(result.status).json(result.data);
}
