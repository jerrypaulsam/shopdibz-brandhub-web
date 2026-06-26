import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getRequestAccessToken } from "@/src/api/authCookies";
import { requestStoreJsonWithAuth } from "@/src/api/serverStoreProxy";

function resolveBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken: explicitAccessToken = "",
    action = "save",
    storeUrl = "",
  } = req.body || {};
  const accessToken = getRequestAccessToken(req, explicitAccessToken);
  const normalizedStoreUrl = String(storeUrl || "").trim();

  if (!accessToken || !normalizedStoreUrl) {
    res.status(400).json({ message: "Access token and store URL are required" });
    return;
  }

  try {
    const isRead = action === "get";
    const response = await requestStoreJsonWithAuth({
      endpoint: SHOPDIBZ_URLS.storeContentRights,
      accessToken,
      method: isRead ? "GET" : "POST",
      query: isRead ? { store_url: normalizedStoreUrl } : undefined,
      body: isRead
        ? undefined
        : {
            storeUrl: normalizedStoreUrl,
            ownershipConfirmed: resolveBoolean(req.body.ownershipConfirmed),
            photographerPermission: resolveBoolean(req.body.photographerPermission),
            modelRelease: resolveBoolean(req.body.modelRelease),
            influencerEndorsement: resolveBoolean(req.body.influencerEndorsement),
            paidAdvertising: resolveBoolean(req.body.paidAdvertising),
            aiDerivative: resolveBoolean(req.body.aiDerivative),
            noMinors: resolveBoolean(req.body.noMinors),
            referenceLink: String(req.body.referenceLink || "").trim(),
          },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Content rights request failed",
    });
  }
}
