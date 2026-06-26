export const CONTENT_RIGHTS_STORAGE_KEY = "shopdibz_content_rights_preferences";
export const CONTENT_RIGHTS_REMINDER_DISMISSED_KEY = "shopdibz_content_rights_reminder_dismissed";

export const DEFAULT_CONTENT_RIGHTS = {
  ownershipConfirmed: false,
  photographerPermission: false,
  modelRelease: false,
  influencerEndorsement: false,
  paidAdvertising: false,
  aiDerivative: false,
  noMinors: true,
  referenceLink: "",
};

export const ACCEPT_ALL_CONTENT_RIGHTS = {
  ownershipConfirmed: true,
  photographerPermission: true,
  modelRelease: true,
  influencerEndorsement: true,
  paidAdvertising: true,
  aiDerivative: true,
  noMinors: true,
  referenceLink: "",
};

export function normalizeContentRightsPreferences(preferences) {
  if (!preferences || typeof preferences !== "object") {
    return DEFAULT_CONTENT_RIGHTS;
  }

  return {
    ownershipConfirmed: resolvePreferenceBoolean(
      preferences.ownershipConfirmed ?? preferences.ownership_confirmed,
      DEFAULT_CONTENT_RIGHTS.ownershipConfirmed,
    ),
    photographerPermission: resolvePreferenceBoolean(
      preferences.photographerPermission ?? preferences.photographer_permission,
      DEFAULT_CONTENT_RIGHTS.photographerPermission,
    ),
    modelRelease: resolvePreferenceBoolean(
      preferences.modelRelease ?? preferences.model_release,
      DEFAULT_CONTENT_RIGHTS.modelRelease,
    ),
    influencerEndorsement: resolvePreferenceBoolean(
      preferences.influencerEndorsement ?? preferences.influencer_endorsement,
      DEFAULT_CONTENT_RIGHTS.influencerEndorsement,
    ),
    paidAdvertising: resolvePreferenceBoolean(
      preferences.paidAdvertising ?? preferences.paid_advertising,
      DEFAULT_CONTENT_RIGHTS.paidAdvertising,
    ),
    aiDerivative: resolvePreferenceBoolean(
      preferences.aiDerivative ?? preferences.ai_derivative,
      DEFAULT_CONTENT_RIGHTS.aiDerivative,
    ),
    noMinors: resolvePreferenceBoolean(
      preferences.noMinors ?? preferences.no_minors,
      DEFAULT_CONTENT_RIGHTS.noMinors,
    ),
    referenceLink: String(preferences.referenceLink ?? preferences.reference_link ?? "").trim(),
  };
}

export function loadContentRightsPreferences(storeUrl) {
  if (typeof window === "undefined") {
    return DEFAULT_CONTENT_RIGHTS;
  }

  try {
    const saved = JSON.parse(
      window.localStorage.getItem(CONTENT_RIGHTS_STORAGE_KEY) || "{}",
    );
    return normalizeContentRightsPreferences(saved?.[storeUrl]);
  } catch {
    return DEFAULT_CONTENT_RIGHTS;
  }
}

export function saveContentRightsPreferences(storeUrl, preferences) {
  if (typeof window === "undefined") {
    return;
  }

  let saved = {};
  try {
    saved = JSON.parse(
      window.localStorage.getItem(CONTENT_RIGHTS_STORAGE_KEY) || "{}",
    );
  } catch {
    saved = {};
  }

  window.localStorage.setItem(
    CONTENT_RIGHTS_STORAGE_KEY,
    JSON.stringify({
      ...saved,
      [storeUrl]: normalizeContentRightsPreferences(preferences),
    }),
  );
}

export function hasSavedContentRightsPreferences(storeUrl) {
  if (typeof window === "undefined" || !storeUrl) {
    return false;
  }

  try {
    const saved = JSON.parse(
      window.localStorage.getItem(CONTENT_RIGHTS_STORAGE_KEY) || "{}",
    );
    return Boolean(saved?.[storeUrl]);
  } catch {
    return false;
  }
}

export function isContentRightsReminderDismissed() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(CONTENT_RIGHTS_REMINDER_DISMISSED_KEY) === "1";
}

export function dismissContentRightsReminder() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(CONTENT_RIGHTS_REMINDER_DISMISSED_KEY, "1");
}

function resolvePreferenceBoolean(value, fallback) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  if (value === undefined || value === null) {
    return fallback;
  }

  return Boolean(value);
}
