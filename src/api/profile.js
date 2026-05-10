import {
  getAccessToken,
  getAuthSession,
  postAuthJson,
  updateAuthSession,
} from "./auth";
import { getDashboardSession } from "./dashboard";

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postProfileJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Profile request failed");
  }

  return data;
}

export const CONTACT_TYPES = [
  { id: "GEN", desc: "General" },
  { id: "DEL", desc: "Delivery" },
  { id: "PRO", desc: "Product" },
  { id: "STO", desc: "Store" },
  { id: "ORD", desc: "Order" },
  { id: "SHI", desc: "Shipping" },
  { id: "ACC", desc: "Account" },
];

export function getProfileSession() {
  const authSession = getAuthSession() || {};
  const dashboardSession = getDashboardSession();

  return {
    accessToken: dashboardSession.accessToken || getAccessToken(),
    storeUrl: dashboardSession.storeUrl,
    user: authSession?.user || {},
  };
}

export function fetchSupportTickets(page = 1) {
  const session = getProfileSession();

  return postProfileJson("/api/profile/support-tickets", {
    accessToken: session.accessToken,
    page,
  });
}

export function fetchSupportMessages(ticketId, page = 1) {
  const session = getProfileSession();

  return postProfileJson("/api/profile/support-messages", {
    accessToken: session.accessToken,
    ticketId,
    page,
  });
}

export function sendSupportMessage(ticketId, message) {
  const session = getProfileSession();

  return postProfileJson("/api/profile/add-support-message", {
    accessToken: session.accessToken,
    ticketId,
    message,
  });
}

export function submitContactRequest(payload) {
  const session = getProfileSession();

  return postProfileJson("/api/profile/contact-us", {
    accessToken: session.accessToken,
    type: payload.type,
    message: payload.message,
    orderId: payload.orderId || "",
  });
}

export function verifyChangedEmailOtp(otp) {
  return postAuthJson("/api/auth/verify-email", {
    accessToken: getAccessToken(),
    otp,
  });
}

export function requestEmailChange(email) {
  const session = getProfileSession();

  return postAuthJson("/api/auth/update-account", {
    accessToken: session.accessToken,
    fName: session.user?.fName || "",
    lName: session.user?.lName || "",
    email,
  });
}

export function persistVerifiedEmail(email) {
  updateAuthSession({
    user: {
      email,
    },
  });
}

export function deactivateSellerAccount() {
  return postProfileJson("/api/profile/deactivate-account", {
    accessToken: getAccessToken(),
  });
}

export function updateStoreHeaderImage(imageBase64) {
  const session = getProfileSession();

  return postProfileJson("/api/profile/update-header-image", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    imageBase64,
  });
}

export function deleteStoreHeaderImage() {
  const session = getProfileSession();

  return postProfileJson("/api/profile/delete-header-image", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
  });
}

export function cancelSellerSubscription() {
  const session = getProfileSession();

  return postProfileJson("/api/profile/cancel-subscription", {
    accessToken: session.accessToken,
  });
}
