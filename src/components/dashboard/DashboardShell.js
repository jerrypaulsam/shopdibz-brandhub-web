import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import DashboardSidebar from "./DashboardSidebar";
import {
  getAuthSessionSnapshot,
  subscribeAuthSession,
} from "@/src/api/auth";

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function DashboardShell({ children }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  useEffect(() => {
    if (hasHydrated && router.isReady && !hasAccessToken) {
      router.replace("/login");
    }
  }, [hasAccessToken, hasHydrated, router, router.isReady]);

  if (!hasHydrated || !hasAccessToken) {
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
          <DashboardSidebar />
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
              <DashboardSidebar onNavigate={() => setIsMenuOpen(false)} />
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
