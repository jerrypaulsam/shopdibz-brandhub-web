import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import DashboardSidebar from "./DashboardSidebar";
import {
  getAuthSessionSnapshot,
  subscribeAuthSession,
} from "@/src/api/auth";
import { fetchStoreInfo, getDashboardSession } from "@/src/api/dashboard";

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function DashboardShell({ children }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
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
  const hasAccessToken = Boolean(parsedSession?.data?.access || parsedSession?.access);
  const hasStoreUrl = Boolean(
    parsedSession?.user?.storeUrl ||
      parsedSession?.user?.store_url ||
      parsedSession?.storeUrl,
  );

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

      if (isPaywallAllowedPath(router.asPath)) {
        if (isCurrent) {
          setIsCheckingAccess(false);
        }
        return;
      }

      const session = getDashboardSession();

      if (!session.storeUrl) {
        if (isCurrent) {
          setIsCheckingAccess(false);
        }
        return;
      }

      try {
        const storeInfo = await fetchStoreInfo();

        if (!isCurrent) {
          return;
        }

        if (storeInfo?.close === true) {
          await router.replace("/store-closed");
          return;
        }

        if (storeInfo?.paywall === false) {
          await router.replace("/onboard-payment");
          return;
        }
      } catch {
        if (!isCurrent) {
          return;
        }
      }

      if (isCurrent) {
        setIsCheckingAccess(false);
      }
    }

    setIsCheckingAccess(true);
    verifyWorkspaceAccess();

    return () => {
      isCurrent = false;
    };
  }, [hasAccessToken, hasHydrated, router, router.asPath, router.isReady]);

  if (!hasHydrated || !hasAccessToken || isCheckingAccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-brand-white">
        <p className="text-sm font-semibold text-white/60">Loading seller workspace...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-brand-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#121212] xl:block">
          <DashboardSidebar hasStoreUrl={hasStoreUrl} />
        </aside>

        {isMenuOpen ? (
          <div className="fixed inset-0 z-40 xl:hidden">
            <button
              className="absolute inset-0 bg-black/70"
              type="button"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            />
            <aside className="relative h-full w-72 overflow-y-auto bg-[#121212]">
              <DashboardSidebar
                hasStoreUrl={hasStoreUrl}
                onNavigate={() => setIsMenuOpen(false)}
              />
            </aside>
          </div>
        ) : null}

        <section className="min-w-0 flex-1">
          <button
            className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-sm border border-white/20 bg-[#121212] xl:hidden"
            type="button"
            aria-label="Open dashboard menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <span className="h-0.5 w-5 bg-brand-white" />
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
 * @param {string} path
 * @returns {boolean}
 */
function isPaywallAllowedPath(path) {
  const value = String(path || "");

  return [
    "/onboard-payment",
    "/awaiting-verification",
    "/store-form",
    "/store-info-form",
    "/settings/bank/create",
  ].some((prefix) => value === prefix || value.startsWith(`${prefix}?`));
}
