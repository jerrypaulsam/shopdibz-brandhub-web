import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import { fetchStoreInfo } from "@/src/api/dashboard";
import {
  createStoreSubscription,
  fetchSubscriptionPlans,
  verifyStoreSubscription,
} from "@/src/api/subscriptionPayment";

const POLL_INTERVAL_MS = 3000;
const POLL_ATTEMPTS = 10;
const TOAST_TIMEOUT_MS = 4200;

export default function SubscriptionPlansPage() {
  const router = useRouter();
  const toastIdRef = useRef(0);
  const [plans, setPlans] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [statusTone, setStatusTone] = useState("info");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState(null);

  const currentPlanCode = String(storeInfo?.plan || "F").trim().toUpperCase();
  const currentPlanName = useMemo(
    () => resolvePlanName(currentPlanCode),
    [currentPlanCode],
  );
  const hasActiveSubscription = currentPlanCode !== "F";

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const nextStoreInfo = await fetchStoreInfo().catch(() => ({}));

        if (!isCurrent) {
          return;
        }

        setStoreInfo(nextStoreInfo || {});

        const nextStoreUrl = String(nextStoreInfo?.url || "").trim();

        if (!nextStoreUrl) {
          setStatusTone("error");
          setMessage("Store details are unavailable. Refresh and try again.");
          setPlans([]);
          return;
        }

        const planResponse = await fetchSubscriptionPlans({
          storeUrl: nextStoreUrl,
        });

        if (!isCurrent) {
          return;
        }

        setPlans(Array.isArray(planResponse?.plans) ? planResponse.plans : []);
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setStatusTone("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load subscription plans.",
        );
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!toast?.id) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast((currentToast) =>
        currentToast?.id === toast.id ? null : currentToast,
      );
    }, TOAST_TIMEOUT_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  function showToast(nextMessage, tone = "info") {
    toastIdRef.current += 1;
    setToast({
      id: toastIdRef.current,
      tone,
      message: String(nextMessage || "").trim(),
    });
  }

  async function handleSubscribe(planCode) {
    const storeUrl = String(storeInfo?.url || "").trim();
    const isCurrentPlan = currentPlanCode === planCode;

    if (!storeUrl) {
      setStatusTone("error");
      setMessage("Store details are unavailable. Refresh and try again.");
      return;
    }

    if (isCurrentPlan) {
      showToast(`Your store is already on the ${currentPlanName}.`, "info");
      return;
    }

    if (hasActiveSubscription) {
      showToast(
        `Your store is already on the ${currentPlanName}. Cancel the current plan from Account Settings before upgrading.`,
        "error",
      );
      return;
    }

    if (typeof window === "undefined" || !window.Razorpay) {
      setStatusTone("info");
      setMessage("Secure payment gateway is still loading. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);
    setSelectedPlan(planCode);
    setStatusTone("info");
    setMessage("");

    try {
      const subscription = await createStoreSubscription({
        storeUrl,
        planType: planCode,
      });

      await openSubscriptionCheckout({
        storeInfo,
        subscription,
      });

      setStatusTone("info");
      setMessage("Payment received. Activating your plan...");

      const activated = await waitForActivation({
        initialPlanCode: currentPlanCode,
      });

      if (activated) {
        setStatusTone("success");
        setMessage("Your plan is active. Redirecting to your dashboard...");
        await router.replace("/home");
        return;
      }

      setStatusTone("info");
      setMessage(
        "Payment was received. Your plan is being activated. Please refresh this page shortly or return to the dashboard.",
      );
    } catch (error) {
      const nextMessage =
        error instanceof Error
          ? error.message
          : "Subscription checkout could not be completed.";

      if (nextMessage !== "CHECKOUT_DISMISSED") {
        setStatusTone("error");
        setMessage(nextMessage);
      }
    } finally {
      setIsSubmitting(false);
      setSelectedPlan("");
    }
  }

  async function waitForActivation({ initialPlanCode }) {
    const storeUrl = String(storeInfo?.url || "").trim();

    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
      await delay(POLL_INTERVAL_MS);

      await verifyStoreSubscription({ storeUrl }).catch(() => null);

      const latestStoreInfo = await fetchStoreInfo().catch(() => null);
      const latestPlanCode = String(latestStoreInfo?.plan || "F")
        .trim()
        .toUpperCase();

      if (latestStoreInfo?.url) {
        setStoreInfo(latestStoreInfo);
      }

      if (latestPlanCode !== initialPlanCode && latestPlanCode !== "F") {
        return true;
      }
    }

    return false;
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setIsRazorpayReady(true)}
        onError={() => {
          setStatusTone("error");
          setMessage("Payment gateway failed to load. Refresh and try again.");
        }}
      />

      {toast?.message ? (
        <div className="pointer-events-none fixed right-4 top-20 z-50 w-full max-w-sm">
          <div
            className={`pointer-events-auto rounded-sm border px-4 py-3 text-sm shadow-2xl backdrop-blur ${
              toast.tone === "error"
                ? "theme-toast theme-toast-error"
                : toast.tone === "success"
                  ? "theme-toast theme-toast-success"
                  : "theme-toast theme-toast-info"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-6">
        <section className="theme-panel rounded-sm border p-6 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                Subscription Plans
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-brand-white">
                Choose the right plan for your brand
              </h1>
              <p className="theme-text-muted mt-4 text-sm leading-6">
                Get more visibility, stronger campaign support, and better tools to grow your store with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="theme-action-neutral inline-flex min-h-11 items-center justify-center rounded-sm border px-5 text-sm font-semibold transition-colors"
                href="/profile/subscription"
              >
                Manage Current Plan
              </Link>
              <Link
                className="theme-action-neutral inline-flex min-h-11 items-center justify-center rounded-sm border px-5 text-sm font-semibold transition-colors"
                href="/home"
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Current Plan"
              value={currentPlanName}
              helper={
                hasActiveSubscription
                  ? "Cancel the active plan first if you want to switch."
                  : "Choose any paid plan to unlock more growth features."
              }
            />
            <SummaryCard
              label="Built For"
              value="Growing Brands"
              helper="Pick the level that fits your team, campaigns, and store goals."
            />
            <SummaryCard
              label="Access"
              value="Fast Activation"
              helper="Your store updates as soon as the subscription is confirmed."
            />
          </div>

          {message ? (
            <div
              className={`theme-toast mt-6 rounded-sm border px-4 py-3 text-sm ${
                statusTone === "error"
                  ? "theme-toast-error"
                  : statusTone === "success"
                    ? "theme-toast-success"
                    : "theme-toast-info"
              }`}
            >
              {message}
            </div>
          ) : null}
        </section>

        <section className="mt-6">
          {isLoading ? (
            <div className="theme-panel rounded-sm border px-5 py-16 text-center text-sm theme-text-muted">
              Loading subscription plans...
            </div>
          ) : !plans.length ? (
            <div className="theme-panel rounded-sm border px-5 py-16 text-center">
              <p className="text-base font-bold text-brand-white">
                No plans available
              </p>
              <p className="theme-text-muted mt-2 text-sm">
                Try refreshing this page in a moment.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">
              {plans.map((plan) => {
                const isCurrentPlan = currentPlanCode === plan.code;
                const isDisabled = isSubmitting || !isRazorpayReady;

                return (
                  <article
                    className={`theme-surface flex h-full flex-col rounded-[24px] border p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] ${
                      plan.code === "G" ? "ring-1 ring-brand-gold/20" : ""
                    }`}
                    key={plan.code}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                          {plan.code === "G"
                            ? "Recommended"
                            : plan.code === "P"
                              ? "Advanced"
                              : "Starter"}
                        </p>
                        <h2 className="mt-3 text-2xl font-extrabold text-brand-white">
                          {plan.name}
                        </h2>
                      </div>
                      {isCurrentPlan ? (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-200 [html[data-theme='light']_&]:text-emerald-700">
                          Current
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-4 text-3xl font-extrabold text-brand-white">
                      Rs. {Number(plan.price || 0).toLocaleString("en-IN")}
                      <span className="theme-text-muted ml-2 text-sm font-semibold">
                        / month
                      </span>
                    </p>

                    <ul className="mt-5 flex-1 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          className="theme-surface-soft flex items-start gap-3 rounded-sm border px-4 py-3 text-sm leading-6"
                          key={`${plan.code}-${feature}`}
                        >
                          <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-[11px] font-bold text-brand-gold">
                            +
                          </span>
                          <span className="theme-text-muted-strong">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-col gap-3">
                      <button
                        className={`inline-flex min-h-12 w-full items-center justify-center rounded-2xl border px-5 text-base font-extrabold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isCurrentPlan ? "theme-action-neutral" : "theme-action-accent"
                        }`}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleSubscribe(plan.code)}
                      >
                        {selectedPlan === plan.code && isSubmitting
                          ? "Opening checkout..."
                          : isCurrentPlan
                            ? "Current Plan"
                            : "Upgrade Plan"}
                      </button>
                      <p className="theme-text-muted min-h-[40px] text-center text-xs leading-5">
                        {!isRazorpayReady
                          ? "Loading secure payment gateway..."
                          : isCurrentPlan
                            ? "This is the plan your store is currently using."
                            : hasActiveSubscription
                              ? "Tap upgrade to see how to switch from your current subscription."
                              : "Upgrade here and unlock more for your brand."}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function SummaryCard({ label, value, helper }) {
  return (
    <div className="theme-panel-soft rounded-sm border px-4 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-base font-extrabold text-brand-white">{value}</p>
      <p className="theme-text-muted mt-2 text-xs leading-5">{helper}</p>
    </div>
  );
}

function resolvePlanName(planCode) {
  if (planCode === "S") {
    return "Silver Plan";
  }

  if (planCode === "G") {
    return "Gold Plan";
  }

  if (planCode === "P") {
    return "Platinum Plan";
  }

  return "Free Plan";
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function openSubscriptionCheckout({ storeInfo, subscription }) {
  return new Promise((resolve, reject) => {
    const accentColor =
      typeof window !== "undefined"
        ? getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
        : "";

    const razorpay = new window.Razorpay({
      key: subscription.key,
      subscription_id: subscription.subscriptionId,
      name: subscription.companyName,
      description: subscription.description,
      image: subscription.image,
      callback_url: subscription.callbackUrl,
      handler: (response) => {
        resolve(response);
      },
      modal: {
        ondismiss: () => {
          reject(new Error("CHECKOUT_DISMISSED"));
        },
      },
      prefill: {
        name: String(
          subscription.userName || storeInfo?.storeName || storeInfo?.name || "",
        ).trim(),
        email: String(
          subscription.userEmail || storeInfo?.storeEmail || storeInfo?.user?.email || "",
        ).trim(),
        contact: String(
          subscription.userContact ||
            storeInfo?.contactNo ||
            storeInfo?.contact_no ||
            "",
        ).trim(),
      },
      notes: {
        plan_type: String(subscription.planType || "").trim(),
        store_url: String(subscription.storeUrl || "").trim(),
      },
      theme: {
        color: accentColor || "#d4af37",
      },
    });

    razorpay.on("payment.failed", (event) => {
      const description =
        event?.error?.description ||
        event?.error?.reason ||
        "Subscription payment failed. Please try again.";

      reject(new Error(String(description)));
    });

    razorpay.open();
  });
}
