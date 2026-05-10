import { getAccessToken } from "./auth";

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postBankJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Bank request failed");
  }

  return data;
}

/**
 * @param {{ accountName: string, accountNumber: string, bankName: string, ifscCode: string }} payload
 * @returns {Promise<any>}
 */
export function updateBankDetails(payload) {
  return postBankJson("/api/auth/update-bank", {
    accessToken: getAccessToken(),
    accountName: payload.accountName,
    accountNumber: payload.accountNumber,
    bankName: payload.bankName,
    ifscCode: payload.ifscCode,
  });
}

/**
 * @returns {Promise<any>}
 */
export function fetchBankDetails() {
  return postBankJson("/api/auth/get-bank", {
    accessToken: getAccessToken(),
  });
}

/**
 * @param {string} ifscCode
 * @returns {Promise<any>}
 */
export function lookupBankIfsc(ifscCode) {
  return postBankJson("/api/auth/bank-ifsc", {
    ifscCode,
  });
}
