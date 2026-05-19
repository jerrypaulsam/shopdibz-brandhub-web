import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  checkSellerEmailVerification,
  getAuthSession,
  getCachedStoreInfo,
  requestEmailOtp,
  updateAuthSession,
} from "@/src/api/auth";
import { fetchStoreInfo } from "@/src/api/dashboard";
import { checkStoreVerification } from "@/src/api/store";
import { resolveSellerAccessRoute } from "@/src/utils/sellerAccess";

export function useAppBootstrap() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function bootstrap() {
      if (!router.isReady) {
        return;
      }

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
        const emailVerified = await checkSellerEmailVerification();

        if (!emailVerified) {
          updateAuthSession({
            emailVerified: false,
            user: {
              emailVerified: false,
              eV: false,
            },
          });
          await requestEmailOtp().catch(() => null);
          await router.replace("/init-email-verify");
          return;
        }

        updateAuthSession({
          emailVerified: true,
          user: {
            emailVerified: true,
            eV: true,
          },
        });

        const access = await resolveSellerAccessRoute({
          session: getAuthSession() || authSession,
          cachedStoreInfo: getCachedStoreInfo(),
          fetchStoreInfo: () => fetchStoreInfo({ forceFresh: true }),
          checkStoreVerification,
        });

        if (access.redirectTo) {
          await router.replace(access.redirectTo);
          return;
        }

        if (resumePath) {
          await router.replace(resumePath);
          return;
        }

        await router.replace("/home");
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
  }, [router, router.asPath, router.isReady]);

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

