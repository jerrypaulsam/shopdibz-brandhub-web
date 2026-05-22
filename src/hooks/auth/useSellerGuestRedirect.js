import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import {
  getAuthSessionSnapshot,
  hasAuthenticatedSellerSession,
  subscribeAuthSession,
} from "@/src/api/auth";

export function useSellerGuestRedirect() {
  const router = useRouter();
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
  const rawSession = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    () => null,
  );

  const hasAuthenticatedSession = useMemo(() => {
    if (!rawSession) {
      return false;
    }

    try {
      const parsedSession = JSON.parse(rawSession);
      return hasAuthenticatedSellerSession(parsedSession);
    } catch {
      return false;
    }
  }, [rawSession]);

  useEffect(() => {
    if (hasHydrated && hasAuthenticatedSession) {
      router.replace("/");
    }
  }, [hasAuthenticatedSession, hasHydrated, router]);

  return hasHydrated && hasAuthenticatedSession;
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
