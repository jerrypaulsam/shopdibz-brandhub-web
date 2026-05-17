import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { getAuthSession, hasAuthenticatedSellerSession, subscribeAuthSession } from "@/src/api/auth";
import { useToast } from "@/src/components/app/ToastProvider";

const PROMPT_SESSION_KEY = "shopdibz_push_prompted_session";
const PROMPT_TIMESTAMP_KEY = "shopdibz_push_prompted_at";
const TOKEN_STORAGE_KEY = "shopdibz_push_token";
const PROMPT_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const PROMPT_DELAY_MS = 8000;

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

/**
 * @returns {boolean}
 */
function supportsPushMessaging() {
  return (
    typeof window !== "undefined"
    && typeof navigator !== "undefined"
    && "serviceWorker" in navigator
    && "Notification" in window
  );
}

/**
 * @returns {boolean}
 */
function hasFirebaseMessagingConfig() {
  return Boolean(
    FIREBASE_CONFIG.apiKey
    && FIREBASE_CONFIG.authDomain
    && FIREBASE_CONFIG.projectId
    && FIREBASE_CONFIG.storageBucket
    && FIREBASE_CONFIG.messagingSenderId
    && FIREBASE_CONFIG.appId,
  );
}

/**
 * @returns {boolean}
 */
function shouldThrottlePermissionPrompt() {
  if (typeof window === "undefined") {
    return true;
  }

  if (window.sessionStorage.getItem(PROMPT_SESSION_KEY) === "1") {
    return true;
  }

  const lastPromptAt = Number(window.localStorage.getItem(PROMPT_TIMESTAMP_KEY) || 0);

  return Boolean(lastPromptAt && Date.now() - lastPromptAt < PROMPT_COOLDOWN_MS);
}

function markPermissionPromptAttempt() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PROMPT_SESSION_KEY, "1");
  window.localStorage.setItem(PROMPT_TIMESTAMP_KEY, String(Date.now()));
}

/**
 * @param {any} payload
 * @returns {{ title: string, body: string }}
 */
function normalizePayload(payload) {
  const notification = payload?.notification || {};
  const data = payload?.data || {};

  return {
    title: notification.title || data.title || "Shopdibz Brand Hub",
    body: notification.body || data.body || "You have a new notification.",
  };
}

export default function FirebaseNotificationsBootstrap() {
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    hasAuthenticatedSellerSession(getAuthSession()),
  );
  const [appScriptReady, setAppScriptReady] = useState(false);
  const [messagingScriptReady, setMessagingScriptReady] = useState(false);
  const isInitializedRef = useRef(false);
  const toastSignatureRef = useRef("");

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

  useEffect(() => subscribeAuthSession(() => {
    setIsAuthenticated(hasAuthenticatedSellerSession(getAuthSession()));
  }), []);

  useEffect(() => {
    if (
      !supportsPushMessaging()
      || !isAuthenticated
      || !vapidKey
      || !hasFirebaseMessagingConfig()
    ) {
      return undefined;
    }

    if (!appScriptReady || !messagingScriptReady || isInitializedRef.current) {
      return undefined;
    }

    if (typeof window.firebase === "undefined") {
      return undefined;
    }

    let active = true;
    let unsubscribeForeground;
    let promptTimeoutId = 0;

    async function setupMessaging() {
      try {
        if (!window.firebase.apps?.length) {
          window.firebase.initializeApp(FIREBASE_CONFIG);
        }

        const messaging = window.firebase.messaging();
        const serviceWorkerUrl = new URL("/firebase-messaging-sw.js", window.location.origin);

        Object.entries(FIREBASE_CONFIG).forEach(([key, value]) => {
          if (value) {
            serviceWorkerUrl.searchParams.set(key, value);
          }
        });

        const serviceWorkerRegistration = await navigator.serviceWorker.register(
          serviceWorkerUrl.toString(),
        );

        isInitializedRef.current = true;

        unsubscribeForeground = messaging.onMessage((payload) => {
          if (!active) {
            return;
          }

          const { title, body } = normalizePayload(payload);
          const signature = `${title}:${body}`;

          if (toastSignatureRef.current === signature) {
            return;
          }

          toastSignatureRef.current = signature;
          showToast({
            message: body ? `${title}: ${body}` : title,
            type: "info",
            duration: 5200,
          });

          window.setTimeout(() => {
            if (toastSignatureRef.current === signature) {
              toastSignatureRef.current = "";
            }
          }, 6000);
        });

        const ensureToken = async () => {
          try {
            const token = await messaging.getToken({
              vapidKey,
              serviceWorkerRegistration,
            });

            if (token) {
              window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
            }
          } catch {
            // Keep notification setup quiet if token generation fails.
          }
        };

        if (Notification.permission === "granted") {
          await ensureToken();
          return;
        }

        if (Notification.permission !== "default" || shouldThrottlePermissionPrompt()) {
          return;
        }

        promptTimeoutId = window.setTimeout(async () => {
          if (!active) {
            return;
          }

          markPermissionPromptAttempt();

          try {
            const permission = await Notification.requestPermission();

            if (permission === "granted") {
              await ensureToken();
              showToast({
                message: "Browser notifications enabled.",
                type: "success",
                duration: 2600,
              });
            }
          } catch {
            // Keep permission flow silent on unsupported/blocked browsers.
          }
        }, PROMPT_DELAY_MS);
      } catch {
        // Avoid breaking app boot if Firebase messaging setup fails.
      }
    }

    setupMessaging();

    return () => {
      active = false;
      if (promptTimeoutId) {
        window.clearTimeout(promptTimeoutId);
      }
      if (typeof unsubscribeForeground === "function") {
        unsubscribeForeground();
      }
    };
  }, [appScriptReady, isAuthenticated, messagingScriptReady, showToast, vapidKey]);

  if (!supportsPushMessaging() || !vapidKey || !hasFirebaseMessagingConfig()) {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"
        strategy="lazyOnload"
        onLoad={() => setAppScriptReady(true)}
      />
      <Script
        src="https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
        strategy="lazyOnload"
        onLoad={() => setMessagingScriptReady(true)}
      />
    </>
  );
}
