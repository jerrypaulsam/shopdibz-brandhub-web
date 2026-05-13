import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import OnboardingPaywall from "@/src/components/dashboard/OnboardingPaywall";
import { fetchStoreInfo } from "@/src/api/dashboard";
import { getAuthSession } from "@/src/api/auth";

export default function OnboardPaymentPage() {
  const router = useRouter();
  const [storeInfo, setStoreInfo] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      if (!router.isReady) {
        return;
      }

      const authSession = getAuthSession();
      const accessToken = authSession?.data?.access || authSession?.access || "";

      if (!accessToken) {
        await router.replace("/login");
        return;
      }

      try {
        const data = await fetchStoreInfo().catch(() => ({}));

        if (!isCurrent) {
          return;
        }

        if (data?.close === true) {
          await router.replace("/store-closed");
          return;
        }

        if (data?.paywall === true) {
          await router.replace("/home");
          return;
        }

        setStoreInfo(data || {});
      } catch {
        if (isCurrent) {
          setStoreInfo({});
        }
      } finally {
        if (isCurrent) {
          setIsChecking(false);
        }
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, [router, router.isReady]);

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070707] text-brand-white">
        <p className="text-sm font-semibold text-white/60">
          Preparing onboarding...
        </p>
      </main>
    );
  }

  return <OnboardingPaywall storeInfo={storeInfo || {}} />;
}
