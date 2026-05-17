import { resolveApiErrorMessage } from "./error";

async function postPaymentJson(url, payload, fallback) {
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

export function initiateOnboardingPayment(payload) {
  return postPaymentJson(
    "/api/payments/onboard-initiate",
    payload,
    "Unable to start onboarding payment.",
  );
}

export function verifyOnboardingPayment(payload) {
  return postPaymentJson(
    "/api/payments/onboard-verify",
    payload,
    "Payment verification failed.",
  );
}
