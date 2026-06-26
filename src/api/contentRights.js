import { getAccessToken } from "./auth";
import { getProfileSession } from "./profile";

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postContentRightsJson(payload) {
  const response = await fetch("/api/privacy/store-content-rights", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.detail || "Content rights request failed";
    throw new Error(message);
  }

  return data;
}

/**
 * @param {string} storeUrl
 * @returns {Promise<any>}
 */
export function fetchStoreContentRightsPreferences(storeUrl) {
  const session = getProfileSession();

  return postContentRightsJson({
    action: "get",
    accessToken: session.accessToken || getAccessToken(),
    storeUrl,
  });
}

/**
 * @param {string} storeUrl
 * @param {Record<string, unknown>} preferences
 * @returns {Promise<any>}
 */
export function saveStoreContentRightsPreferences(storeUrl, preferences) {
  const session = getProfileSession();

  return postContentRightsJson({
    action: "save",
    accessToken: session.accessToken || getAccessToken(),
    storeUrl,
    ownershipConfirmed: preferences.ownershipConfirmed,
    photographerPermission: preferences.photographerPermission,
    modelRelease: preferences.modelRelease,
    influencerEndorsement: preferences.influencerEndorsement,
    paidAdvertising: preferences.paidAdvertising,
    aiDerivative: preferences.aiDerivative,
    noMinors: preferences.noMinors,
    referenceLink: preferences.referenceLink || "",
  });
}
