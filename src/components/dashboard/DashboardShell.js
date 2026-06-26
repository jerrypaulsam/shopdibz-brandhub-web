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
import {
  dismissContentRightsReminder,
  hasSavedContentRightsPreferences,
  isContentRightsReminderDismissed,
} from "@/src/utils/contentRightsPreferences";
import {
  resolveSellerAccessRoute,
  shouldForceFreshSellerAccess,
} from "@/src/utils/sellerAccess";

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = String(router.pathname || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
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
    "/onboard-payment-status",
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
      }

      try {
        // Workspace routes still need the same onboarding/paywall resolution as
        // setup routes, otherwise direct URLs can bypass the expected seller flow.
        setIsCheckingAccess(true);

        const access = await resolveSellerAccessRoute({
          session: parsedSession,
          cachedStoreInfo: sessionCachedStoreInfo || getCachedStoreInfo(),
          fetchStoreInfo: () => fetchStoreInfo({ forceFresh: true }),
          checkStoreVerification,
          forceFresh: shouldForceFreshSellerAccess(pathname),
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
  }, [hasAccessToken, hasHydrated, isSetupRoute, parsedSession, pathname, router, router.isReady, sessionCachedStoreInfo]);

  if (!hasHydrated || !hasAccessToken || isCheckingAccess) {
    return (
      <main className="theme-app flex min-h-screen items-center justify-center">
        <p className="theme-text-muted text-sm font-semibold">Loading Brand Workspace...</p>
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
          <ContentRightsReminder
            pathname={pathname}
            router={router}
            storeInfo={sidebarStoreInfo}
          />
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

function ContentRightsReminder({ pathname, router, storeInfo }) {
  const [isDismissed, setIsDismissed] = useState(
    () => isContentRightsReminderDismissed(),
  );
  const storeUrl = String(storeInfo?.url || "").trim();
  const currentPath = String(router.asPath || pathname || "").split("?")[0];
  const shouldShow =
    Boolean(storeUrl) &&
    currentPath !== "/profile/content-rights" &&
    !isDismissed &&
    !hasSavedContentRightsPreferences(storeUrl);

  if (!shouldShow) {
    return null;
  }

  function remindLater() {
    dismissContentRightsReminder();
    setIsDismissed(true);
  }

  async function reviewRights() {
    await router.push("/profile/content-rights");
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 w-screen max-w-full overflow-hidden border-t border-brand-gold/25 bg-[#121212] p-3 shadow-2xl shadow-black/30 sm:bottom-4 sm:left-4 sm:right-4 sm:mx-auto sm:w-[calc(100vw-2rem)] sm:max-w-3xl sm:rounded-sm sm:border">
      <div className="mx-auto grid w-full min-w-0 max-w-3xl gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-brand-white">
            Confirm default content rights once so uploads stay quick.
          </p>
          <p className="mt-1 text-xs leading-5 text-white/55 md:max-w-xl">
            Review or accept defaults for images, banners, logos, ads, and AI-assisted creative use.
          </p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2 md:flex md:shrink-0 md:flex-wrap">
          <button
            className="inline-flex min-h-10 min-w-0 items-center justify-center whitespace-normal rounded-sm border border-brand-gold bg-brand-gold px-3 text-center text-sm font-extrabold leading-5 text-brand-black transition-colors hover:border-brand-white hover:bg-brand-white md:px-4"
            type="button"
            onClick={reviewRights}
          >
            Review Rights
          </button>
          <button
            className="inline-flex min-h-10 min-w-0 items-center justify-center whitespace-normal rounded-sm border border-white/15 px-3 text-center text-sm font-bold leading-5 text-white/70 transition-colors hover:border-white/35 hover:text-brand-white md:px-4"
            type="button"
            onClick={remindLater}
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
}
