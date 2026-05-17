import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { verifyStoreSubscription } from "@/src/api/subscriptionPayment";

const POLL_INTERVAL_MS = 3000;
const POLL_ATTEMPTS = 10;

export default function SubscriptionPaymentStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Checking your subscription status...");

  const storeUrl = useMemo(() => {
    if (Array.isArray(router.query.store_url)) {
      return String(router.query.store_url[0] || "").trim();
    }

    return String(router.query.store_url || "").trim();
  }, [router.query.store_url]);

  const paymentState = useMemo(() => {
    if (Array.isArray(router.query.payment)) {
      return String(router.query.payment[0] || "").trim();
    }

    return String(router.query.payment || "").trim();
  }, [router.query.payment]);

  const errorDescription = useMemo(() => {
    if (Array.isArray(router.query.error_description)) {
      return String(router.query.error_description[0] || "").trim();
    }

    return String(router.query.error_description || "").trim();
  }, [router.query.error_description]);

  useEffect(() => {
    let isCurrent = true;

    async function checkStatus() {
      if (!router.isReady) {
        return;
      }

      if (!storeUrl) {
        if (!isCurrent) {
          return;
        }

        setStatus("error");
        setMessage("Store details are missing. Please return to the dashboard.");
        return;
      }

      if (paymentState === "failed") {
        if (!isCurrent) {
          return;
        }

        setStatus("error");
        setMessage(
          errorDescription ||
            "Your subscription payment did not complete. Please try again.",
        );
        return;
      }

      if (isCurrent) {
        setStatus("processing");
        setMessage("Checking your subscription status...");
      }

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
        try {
          const verification = await verifyStoreSubscription({ storeUrl });

          if (!isCurrent) {
            return;
          }

          if (
            verification?.verified &&
            verification?.status === "success" &&
            verification?.subscriptionActive
          ) {
            setStatus("success");
            setMessage("Your plan is active. Redirecting to your dashboard...");
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
        "Your payment was received. Your subscription is being activated and you will also receive an email once the backend completes the update.",
      );
    }

    checkStatus();

    return () => {
      isCurrent = false;
    };
  }, [errorDescription, paymentState, router, router.isReady, storeUrl]);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[880px] px-4 py-8 md:px-6">
        <section className="theme-panel rounded-sm border p-6 text-center sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Subscription Update
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-brand-white">
            {status === "success"
              ? "Your plan is ready"
              : status === "error"
                ? "We could not confirm your plan yet"
                : status === "pending"
                  ? "Your subscription is being activated"
                  : "We are confirming your subscription"}
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
              href="/profile/subscription"
            >
              View Subscription
            </Link>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
