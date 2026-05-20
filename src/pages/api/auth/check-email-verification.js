import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { parseUpstreamResponse, withInternalProxyHeaders } from "@/src/api/serverProxyUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { accessToken: explicitAccessToken = "" } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);

  if (!accessToken) {
    res.status(400).json({ message: "Access token is required" });
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${SHOPDIBZ_URLS.checkEmailVerification}`,
      {
        headers: withInternalProxyHeaders({
          Authorization: `JWT ${accessToken}`,
        }),
      },
    );
    const text = await response.text();

    res.status(response.status).json(text ? parseUpstreamResponse(text) : {});
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Email verification check failed",
    });
  }
}

