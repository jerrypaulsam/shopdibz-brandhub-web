import { resolveApiErrorMessage } from "./error";

async function postSubscriptionJson(url, payload, fallback) {
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

export function fetchSubscriptionPlans(payload) {
  return postSubscriptionJson(
    "/api/store/subscription-plans",
    payload,
    "Unable to load subscription plans.",
  );
}

export function createStoreSubscription(payload) {
  return postSubscriptionJson(
    "/api/store/subscription-create",
    payload,
    "Unable to start subscription checkout.",
  );
}

export function verifyStoreSubscription(payload) {
  return postSubscriptionJson(
    "/api/store/subscription-verify",
    payload,
    "Subscription verification failed.",
  );
}
