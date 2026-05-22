import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  clearPendingOnboardingPayment,
  getAuthSession,
  getPendingOnboardingPayment,
} from "@/src/api/auth";
import { fetchStoreInfo } from "@/src/api/dashboard";

const POLL_INTERVAL_MS = 3000;
const POLL_ATTEMPTS = 20;

export default function OnboardPaymentStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Confirming your onboarding payment...");

  useEffect(() => {
    let isCurrent = true;

    async function checkStatus() {
      if (!router.isReady) {
        return;
      }

      const authSession = getAuthSession();
      const accessToken = authSession?.data?.access || authSession?.access || "";

      if (!accessToken) {
        await router.replace("/login");
        return;
      }

      const pendingPayment = getPendingOnboardingPayment();

      if (!pendingPayment?.storeUrl) {
        try {
          const storeInfo = await fetchStoreInfo({ forceFresh: true });

          if (!isCurrent) {
            return;
          }

          if (isPaywallResolved(storeInfo)) {
            await router.replace("/home");
            return;
          }

          await router.replace("/onboard-payment");
          return;
        } catch {
          if (!isCurrent) {
            return;
          }
        }

        setStatus("error");
        setMessage("We could not find a payment verification session. Please return to onboarding.");
        return;
      }

      setStatus("processing");
      setMessage("Confirming your onboarding payment...");

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
        try {
          const storeInfo = await fetchStoreInfo({ forceFresh: true });

          if (!isCurrent) {
            return;
          }

          if (isPaywallResolved(storeInfo)) {
            clearPendingOnboardingPayment();
            setStatus("success");
            setMessage("Your onboarding payment is verified. Redirecting to your workspace...");
            await router.replace("/home");
            return;
          }
        } catch {
          if (!isCurrent) {
            return;
          }
        }

        await delay(POLL_INTERVAL_MS);
      }

      if (!isCurrent) {
        return;
      }

      setStatus("pending");
      setMessage(
        "Your payment was received. We are still waiting for the backend to finish verification. Please reload again in a few moments.",
      );
    }

    checkStatus();

    return () => {
      isCurrent = false;
    };
  }, [router, router.isReady]);

  return (
    <main className="theme-app flex min-h-screen items-center justify-center px-4 py-8 text-brand-white sm:px-6 lg:px-8">
      <section className="theme-surface w-full max-w-2xl rounded-[28px] border p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
          Onboarding Payment
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-brand-white">
          {status === "success"
            ? "Your onboarding is unlocked"
            : status === "pending"
              ? "Your payment is being verified"
              : status === "error"
                ? "We could not confirm your payment yet"
                : "We are confirming your payment"}
        </h1>
        <p className="theme-text-muted mt-4 text-sm leading-6">
          {message}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            className="theme-action-accent inline-flex min-h-11 items-center justify-center rounded-sm border px-5 text-sm font-semibold transition-colors"
            href="/home"
          >
            Go to Home
          </Link>
          <Link
            className="theme-action-neutral inline-flex min-h-11 items-center justify-center rounded-sm border px-5 text-sm font-semibold transition-colors"
            href="/onboard-payment"
          >
            Return to Payment
          </Link>
        </div>
      </section>
    </main>
  );
}

function isPaywallResolved(storeInfo) {
  const paywall = storeInfo?.paywall;

  if (typeof paywall === "boolean") {
    return paywall;
  }

  if (typeof paywall === "number") {
    return paywall === 1;
  }

  if (typeof paywall === "string") {
    const normalized = paywall.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }

  return false;
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
