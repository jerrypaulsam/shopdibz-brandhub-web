import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import DashboardSidebar from "./DashboardSidebar";
import {
  clearCachedStoreInfo,
  getCachedStoreInfo,
  getSessionCachedStoreInfo,
  getSessionCachedStoreInfoSnapshot,
  getAuthSessionSnapshot,
  subscribeAuthSession,
} from "@/src/api/auth";
import {
  fetchStoreInfo,
  isClosedStoreAccessError,
} from "@/src/api/dashboard";
import { checkStoreVerification, fetchBannerImages } from "@/src/api/store";
import { resolveSellerAccessRoute } from "@/src/utils/sellerAccess";

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = String(router.pathname || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(
    () => !getSessionCachedStoreInfo(),
  );
  const [sidebarStoreInfo, setSidebarStoreInfo] = useState(
    () => getSessionCachedStoreInfo() || getCachedStoreInfo(),
  );
  const [sidebarBannerImages, setSidebarBannerImages] = useState([]);
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
  const session = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    () => null,
  );
  const sessionCachedStoreInfoSnapshot = useSyncExternalStore(
    subscribeAuthSession,
    getSessionCachedStoreInfoSnapshot,
    () => null,
  );
  const parsedSession = useMemo(() => {
    if (!session) {
      return null;
    }

    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  }, [session]);
  const sessionCachedStoreInfo = useMemo(() => {
    if (!sessionCachedStoreInfoSnapshot) {
      return null;
    }

    try {
      return JSON.parse(sessionCachedStoreInfoSnapshot);
    } catch {
      return null;
    }
  }, [sessionCachedStoreInfoSnapshot]);
  const hasAccessToken = Boolean(parsedSession?.data?.access || parsedSession?.access);
  const hasStoreUrl = Boolean(
    parsedSession?.user?.storeUrl ||
      parsedSession?.user?.store_url ||
      parsedSession?.storeUrl,
  );
  const isSetupRoute = [
    "/store-form",
    "/settings/bank/create",
    "/awaiting-verification",
    "/store-info-form",
    "/onboard-payment",
    "/subscription-payment-status",
    "/store-closed",
  ].includes(pathname);

  useEffect(() => {
    if (hasHydrated && router.isReady && !hasAccessToken) {
      router.replace("/login");
    }
  }, [hasAccessToken, hasHydrated, router, router.isReady]);

  useEffect(() => {
    let isCurrent = true;

    async function verifyWorkspaceAccess() {
      if (!hasHydrated || !router.isReady || !hasAccessToken) {
        return;
      }

      if (isSetupRoute) {
        if (isCurrent) {
          setIsCheckingAccess(false);
        }
        return;
      }

      if (sessionCachedStoreInfo) {
        setSidebarStoreInfo(sessionCachedStoreInfo);
        setIsCheckingAccess(false);

        fetchBannerImages()
          .then((banners) => {
            if (!isCurrent) {
              return;
            }

            setSidebarBannerImages(banners?.results || []);
          })
          .catch(() => {
            if (!isCurrent) {
              return;
            }

            setSidebarBannerImages([]);
          });
        return;
      }

      try {
        // Workspace routes still need the same onboarding/paywall resolution as
        // setup routes, otherwise direct URLs can bypass the expected seller flow.
        if (!getCachedStoreInfo()) {
          setIsCheckingAccess(true);
        }

        const access = await resolveSellerAccessRoute({
          session: parsedSession,
          cachedStoreInfo: getCachedStoreInfo(),
          fetchStoreInfo: () => fetchStoreInfo({ forceFresh: true }),
          checkStoreVerification,
        });

        if (!isCurrent) {
          return;
        }

        if (access.redirectTo) {
          if (access.redirectTo === "/store-closed") {
            clearCachedStoreInfo();
          }

          await router.replace(access.redirectTo);
          return;
        }

        const storeInfo = access.storeInfo || getCachedStoreInfo();

        if (!storeInfo) {
          setSidebarStoreInfo(null);
          setSidebarBannerImages([]);
          setIsCheckingAccess(false);
          return;
        }

        if (isStoreClosed(storeInfo)) {
          clearCachedStoreInfo();
          await router.replace("/store-closed");
          return;
        }

        setSidebarStoreInfo(storeInfo || null);

        fetchBannerImages()
          .then((banners) => {
            if (!isCurrent) {
              return;
            }

            setSidebarBannerImages(banners?.results || []);
          })
          .catch(() => {
            if (!isCurrent) {
              return;
            }

            setSidebarBannerImages([]);
          });
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        if (isClosedStoreAccessError(error)) {
          clearCachedStoreInfo();
          await router.replace("/store-closed");
          return;
        }
      }

      if (isCurrent) {
        setIsCheckingAccess(false);
      }
    }

    verifyWorkspaceAccess();

    return () => {
      isCurrent = false;
    };
  }, [hasAccessToken, hasHydrated, isSetupRoute, parsedSession, router, router.isReady, sessionCachedStoreInfo]);

  if (!hasHydrated || !hasAccessToken || isCheckingAccess) {
    return (
      <main className="theme-app flex min-h-screen items-center justify-center">
        <p className="theme-text-muted text-sm font-semibold">Loading seller workspace...</p>
      </main>
    );
  }

  return (
    <main className="theme-app min-h-screen">
      <div className="flex min-h-screen">
        <aside className="theme-surface hidden w-72 shrink-0 border-r xl:block">
          <DashboardSidebar
            hasStoreUrl={hasStoreUrl}
            storeInfo={sidebarStoreInfo}
            bannerImages={sidebarBannerImages}
          />
        </aside>

        {isMenuOpen ? (
          <div className="fixed inset-0 z-40 xl:hidden">
            <button
              className="theme-overlay absolute inset-0"
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            />
            <aside className="theme-surface relative h-full w-72 overflow-y-auto">
              <DashboardSidebar
                hasStoreUrl={hasStoreUrl}
                storeInfo={sidebarStoreInfo}
                bannerImages={sidebarBannerImages}
                onNavigate={() => setIsMenuOpen(false)}
              />
            </aside>
          </div>
        ) : null}

        <section className="min-w-0 flex-1">
          <button
            className="theme-surface fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-sm border xl:hidden"
            type="button"
            aria-label="Open dashboard menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="h-0.5 w-5 bg-current" />
          </button>
          {children}
        </section>
      </div>
    </main>
  );
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

/**
 * @param {any} storeInfo
 * @returns {boolean}
 */
function isStoreClosed(storeInfo) {
  const value = storeInfo?.close ?? storeInfo?.closed;

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return false;
}

