import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { submitStoreForm } from "@/src/api/serverStoreProxy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const accessToken = getRequestAccessToken(req);
  const { refundId, decision = "" } = req.body || {};

  if (!accessToken || !refundId || !decision) {
    res.status(400).json({ message: "Missing exchange response fields" });
    return;
  }

  const result = await submitStoreForm({
    endpoint: `${SHOPDIBZ_URLS.refundBrandExchangeResponse}${refundId}/respond/`,
    accessToken: String(accessToken),
    method: "PUT",
    fields: {
      decision,
    },
  });

  res.status(result.status).json(result.data);
}
