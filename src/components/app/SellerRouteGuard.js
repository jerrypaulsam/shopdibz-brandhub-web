import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import BrandHubLogo from "@/src/components/app/BrandHubLogo";
import {
  clearCachedStoreInfo,
  getAuthSessionSnapshot,
  getCachedStoreInfo,
  subscribeAuthSession,
} from "@/src/api/auth";
import { fetchStoreInfo } from "@/src/api/dashboard";
import { checkStoreVerification } from "@/src/api/store";
import {
  isAllowedSellerRoute,
  isOnboardingOnlyRoute,
  resolveSellerAccessRoute,
  shouldBlockSellerRouteUntilResolved,
  shouldGuardSellerRoute,
} from "@/src/utils/sellerAccess";

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function SellerRouteGuard({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
  const sessionSnapshot = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    () => null,
  );
  const session = useMemo(() => {
    if (!sessionSnapshot) {
      return null;
    }

    try {
      return JSON.parse(sessionSnapshot);
    } catch {
      return null;
    }
  }, [sessionSnapshot]);

  const pathname = String(router.pathname || "");
  const hasAccessToken = Boolean(session?.data?.access || session?.access);
  const shouldBlockUntilResolved = shouldBlockSellerRouteUntilResolved(pathname);
  const shouldGuard = router.isReady && shouldGuardSellerRoute(pathname);

  useEffect(() => {
    let isCurrent = true;

    async function verifySellerRoute() {
      if (!router.isReady) {
        return;
      }

      if (!shouldGuard) {
        if (isCurrent) {
          setIsChecking(false);
        }
        return;
      }

      setIsChecking(true);

      if (shouldBlockUntilResolved && !hasAccessToken) {
        await router.replace("/login");
        return;
      }

      if (!hasAccessToken) {
        if (isCurrent) {
          setIsChecking(false);
        }
        return;
      }

      try {
        const access = await resolveSellerAccessRoute({
          session,
          cachedStoreInfo: getCachedStoreInfo(),
          fetchStoreInfo,
          checkStoreVerification,
        });

        if (!isCurrent) {
          return;
        }

        if (access.redirectTo) {
          if (access.redirectTo === "/store-closed") {
            clearCachedStoreInfo();
          }

          if (!isAllowedSellerRoute(pathname, access.redirectTo)) {
            await router.replace(access.redirectTo);
            return;
          }
        } else if (access.resolved && isOnboardingOnlyRoute(pathname)) {
          await router.replace("/home");
          return;
        }
      } catch {
        if (!isCurrent) {
          return;
        }
      }

      if (isCurrent) {
        setIsChecking(false);
      }
    }

    verifySellerRoute();

    return () => {
      isCurrent = false;
    };
  }, [hasAccessToken, pathname, router, router.isReady, session, shouldBlockUntilResolved, shouldGuard]);

  if ((shouldBlockUntilResolved && (!hasHydrated || !router.isReady)) || (shouldGuard && isChecking)) {
    return (
      <main className="theme-app flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full">
            <BrandHubLogo alt="Shopdibz Brand Hub" width={80} height={80} priority />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em]">
            Checking Seller Access
          </p>
        </div>
      </main>
    );
  }

  return children;
}

function subscribeToHydration() {
  return () => {};
}

function getHydratedSnapshot() {
  return true;
}

function getServerHydrationSnapshot() {
  return false;
}
