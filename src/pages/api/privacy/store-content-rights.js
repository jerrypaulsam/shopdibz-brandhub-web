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

function readBooleanField(body, camelKey, snakeKey) {
  return resolveBoolean(body?.[camelKey] ?? body?.[snakeKey]);
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
  const referenceLink = String(req.body?.referenceLink || "").trim();

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
            store_url: normalizedStoreUrl,
            ownership_confirmed: readBooleanField(
              req.body,
              "ownershipConfirmed",
              "ownership_confirmed",
            ),
            photographer_permission: readBooleanField(
              req.body,
              "photographerPermission",
              "photographer_permission",
            ),
            model_release: readBooleanField(req.body, "modelRelease", "model_release"),
            influencer_endorsement: readBooleanField(
              req.body,
              "influencerEndorsement",
              "influencer_endorsement",
            ),
            paid_advertising: readBooleanField(req.body, "paidAdvertising", "paid_advertising"),
            ai_derivative: readBooleanField(req.body, "aiDerivative", "ai_derivative"),
            no_minors: readBooleanField(req.body, "noMinors", "no_minors"),
            reference_link: referenceLink,
          },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Content rights request failed",
    });
  }
}
