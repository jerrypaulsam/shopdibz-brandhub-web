import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  checkSellerEmailVerification,
  getAuthSession,
  getCachedStoreInfo,
} from "@/src/api/auth";
import { fetchStoreInfo } from "@/src/api/dashboard";
import { checkStoreVerification } from "@/src/api/store";

export function useAppBootstrap() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function bootstrap() {
      const resumePath = resolveResumePath(router.asPath);
      const authSession = getAuthSession();
      const accessToken = authSession?.data?.access || authSession?.access || "";

      if (!accessToken) {
        if (isCurrent) {
          setIsChecking(false);
        }
        return;
      }

      try {
        const emailVerified = await resolveEmailVerification(authSession);

        if (!emailVerified) {
          await router.replace("/init-email-verify");
          return;
        }

        const storeUrl =
          authSession?.user?.storeUrl ||
          authSession?.user?.store_url ||
          authSession?.storeUrl ||
          getCachedStoreInfo()?.url ||
          "";
        const storeCreated = resolveBoolean(
          authSession?.user?.cre ?? authSession?.storeCreated,
        );
        const verified = resolveBoolean(
          authSession?.user?.ver ?? authSession?.verified,
        );

        if (!storeUrl) {
          if (verified) {
            await router.replace("/store-info-form");
            return;
          }

          if (storeCreated) {
            const verification = await checkStoreVerification();

            if (verification?.status === 200 || verification?.status === 201) {
              await router.replace("/store-info-form");
              return;
            }

            if (verification?.status === 403) {
              await router.replace("/awaiting-verification");
              return;
            }

            if (verification?.status === 404) {
              await router.replace("/settings/bank/create");
              return;
            }
          }

          await router.replace("/store-form");
          return;
        }

        if (storeCreated && !verified) {
          await router.replace("/awaiting-verification");
          return;
        }

        const storeInfo =
          (await fetchStoreInfo().catch(() => null)) || getCachedStoreInfo();

        if (storeInfo?.bankVerify === false) {
          await router.replace("/settings/bank/create");
          return;
        }

        if (storeInfo?.paywall === false) {
          await router.replace("/onboard-payment");
          return;
        }

        if (storeInfo?.close === true) {
          await router.replace("/store-closed");
          return;
        }

        await router.replace(resumePath || "/home");
      } catch (bootstrapError) {
        if (isCurrent) {
          setError(
            bootstrapError instanceof Error
              ? bootstrapError.message
              : "App bootstrap failed",
          );
          setIsChecking(false);
        }
      }
    }

    bootstrap();

    return () => {
      isCurrent = false;
    };
  }, [router]);

  return {
    isChecking,
    error,
  };
}

/**
 * @param {string} value
 * @returns {string}
 */
function resolveResumePath(value) {
  const path = String(value || "").trim();

  if (!path || path === "/" || path === "/home") {
    return "";
  }

  if (!path.startsWith("/")) {
    return "";
  }

  const blockedPrefixes = [
    "/login",
    "/sign-up",
    "/hub",
    "/new-mobile-verify",
    "/init-email-verify",
    "/store-form",
    "/settings/bank/create",
    "/awaiting-verification",
    "/store-info-form",
    "/onboard-payment",
    "/store-closed",
  ];

  if (blockedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}?`))) {
    return "";
  }

  return path;
}

/**
 * @param {any} authSession
 * @returns {Promise<boolean>}
 */
async function resolveEmailVerification(authSession) {
  const sessionFlag =
    authSession?.user?.eV ??
    authSession?.user?.emailVerified ??
    authSession?.emailVerified;

  if (sessionFlag !== undefined && sessionFlag !== null && sessionFlag !== "") {
    return resolveBoolean(sessionFlag);
  }

  return checkSellerEmailVerification();
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function resolveBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }

  return Boolean(value);
}
