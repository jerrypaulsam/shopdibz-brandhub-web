import { resolveApiErrorMessage } from "./error";

async function postWalletJson(url, payload, fallback) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      resolveApiErrorMessage({
        status: response.status,
        data,
        fallback,
      }),
    );
  }

  return data;
}

export function initiateAdWalletRecharge(payload) {
  return postWalletJson(
    "/api/ads/wallet-recharge-initiate",
    payload,
    "Unable to start ad wallet recharge.",
  );
}

export function verifyAdWalletRecharge(payload) {
  return postWalletJson(
    "/api/ads/wallet-recharge-verify",
    payload,
    "Wallet recharge verification failed.",
  );
}
