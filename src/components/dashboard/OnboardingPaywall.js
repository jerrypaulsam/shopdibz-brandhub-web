import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/router";
import { clearAuthSession, logoutSeller } from "@/src/api/auth";
import { fetchStoreInfo } from "@/src/api/dashboard";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import { logScreenView } from "@/src/api/analytics";
import {
  initiateOnboardingPayment,
  verifyOnboardingPayment,
} from "@/src/api/onboardingPayment";

const advantages = [
  "Increase your profit per sale with lower commission rates.",
  "Build your own brand page inside the Shopdibz mall.",
  "Grow a loyal customer community across India.",
  "Use brand tools and analytics built for modern D2C teams.",
  "Get dedicated support from the brand success team.",
];

/**
 * @param {{ storeInfo: any }} props
 */
export default function OnboardingPaywall({ storeInfo }) {
  const router = useRouter();
  const { confirm } = useConfirm();
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    if (!storeInfo?.url) {
      return;
    }

    logScreenView("onboard_fee_screen", storeInfo.url || "Anonymous", "store");
  }, [storeInfo?.url]);

  async function handleLogout() {
    const accepted = await confirm({
      title: "Logout",
      message: "Are you sure you want to log out of Brand Hub?",
      confirmLabel: "Logout",
      cancelLabel: "Stay Logged In",
    });

    if (!accepted) {
      return;
    }

    await logoutSeller().catch(() => null);
    clearAuthSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  async function handlePay() {
    const storeUrl = String(storeInfo?.url || "").trim();
    const userCode = String(
      storeInfo?.userCode ||
        storeInfo?.uCode ||
        storeInfo?.user?.userCode ||
        storeInfo?.user?.uCode ||
        "",
    ).trim();

    if (!storeUrl) {
      setPaymentMessage("Store details are still loading. Please try again.");
      return;
    }

    if (!userCode) {
      setPaymentMessage("User session is incomplete. Please sign in again.");
      return;
    }

    if (typeof window === "undefined" || !window.Razorpay) {
      setPaymentMessage("Payment gateway is still loading. Please wait a moment.");
      return;
    }

    setIsPaying(true);
    setPaymentMessage("");

    try {
      const paymentOrder = await initiateOnboardingPayment({
        storeUrl,
        code: userCode,
      });

      await openRazorpayCheckout({
        paymentOrder,
        storeInfo,
        onVerify: async (paymentResponse) => {
          await verifyOnboardingPayment({
            ...paymentResponse,
            storeUrl,
            code: userCode,
          });
        },
      });

      await fetchStoreInfo().catch(() => null);
      await router.replace("/home");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Payment could not be completed.";

      if (message !== "CHECKOUT_DISMISSED") {
        setPaymentMessage(message);
      }
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <main className="theme-app relative min-h-screen overflow-hidden px-4 py-8 text-brand-white sm:px-6 lg:px-8 [html[data-theme='light']_&]:text-[#2f2622]">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setIsRazorpayReady(true)}
        onError={() => setPaymentMessage("Payment gateway failed to load. Refresh and try again.")}
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[12%] h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[18%] h-96 w-96 rounded-full bg-[#1d3d2f]/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex justify-end">
          <button
            className="theme-action-neutral inline-flex min-h-10 items-center gap-2 rounded-sm border px-4 text-sm font-semibold transition-colors"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
          <section className="theme-surface rounded-[28px] border p-6 shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:p-8 lg:p-10">
            <div className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-gold">
              Onboarding Fee
            </div>

            <div className="mt-6 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-brand-white sm:text-5xl">
                Launch your store with a cleaner, faster brand setup.
              </h1>
              <p className="theme-text-muted mt-5 max-w-2xl text-base leading-7 sm:text-lg">
                Activate your Brand Hub onboarding and unlock the brand workspace,
                brand presence, and growth tools built for modern D2C teams.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <MetricCard
                label="Offer Price"
                value="Rs. 499"
                helper="Limited-time activation"
              />
              <MetricCard
                label="Savings"
                value="50%"
                helper="Compared to Rs. 999"
              />
              <MetricCard
                label="Access"
                value="Instant"
                helper="Secure Razorpay checkout"
              />
            </div>

            <div className="theme-surface-soft mt-8 rounded-[24px] border p-5 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="theme-text-muted text-sm font-semibold uppercase tracking-[0.16em]">
                    Brand Activation
                  </p>
                  <div className="mt-3 flex items-end gap-3">
                    <p className="text-4xl font-extrabold text-brand-white sm:text-5xl">
                      Rs. 499
                    </p>
                    <p className="theme-text-muted pb-2 text-lg font-semibold line-through">
                      Rs. 999
                    </p>
                  </div>
                </div>
                <div className="inline-flex rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
                  Limited Time Offer
                </div>
              </div>
              <p className="theme-text-muted mt-4 max-w-2xl text-sm leading-6">
                Use this one-time onboarding flow to complete brand activation and continue the rest of your Brand Hub setup with full access.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-extrabold text-brand-white">
                Why brands choose Shopdibz
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {advantages.map((item) => (
                  <div
                    className="theme-surface-soft flex gap-3 rounded-2xl border px-4 py-4"
                    key={item}
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-xs font-bold text-brand-gold">
                      +
                    </span>
                    <p className="theme-text-muted text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="theme-surface rounded-[28px] border p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="theme-surface-soft rounded-[24px] border border-brand-gold/20 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                Next Step
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-brand-white">
                Complete onboarding
              </h2>
              <p className="theme-text-muted mt-3 text-sm leading-6">
                Complete your onboarding payment here in Brand Hub and continue straight into your brand workspace.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#caa13a,#f0d482)] px-5 text-base font-extrabold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  type="button"
                  disabled={!isRazorpayReady || isPaying}
                  onClick={handlePay}
                >
                  {isPaying ? "Processing..." : "Pay and Start"}
                </button>
                {paymentMessage ? (
                  <p className="text-sm font-medium text-red-200 [html[data-theme='light']_&]:text-red-700">{paymentMessage}</p>
                ) : !isRazorpayReady ? (
                  <p className="theme-text-muted text-sm font-medium">
                    Loading secure payment gateway...
                  </p>
                ) : null}
                <Link
                  className="theme-action-neutral inline-flex min-h-12 w-full items-center justify-center rounded-2xl border px-5 text-base font-semibold transition-colors"
                  href="/hub"
                >
                  Back to Brand Hub
                </Link>
              </div>
            </div>

            <div className="theme-surface-soft mt-5 rounded-[24px] border p-5">
              <p className="theme-text-muted text-xs font-bold uppercase tracking-[0.18em]">
                What happens after payment
              </p>
              <ol className="theme-text-muted mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="theme-surface inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold text-brand-white">
                    1
                  </span>
                  <span>Razorpay opens in-page so you can complete activation without leaving Brand Hub.</span>
                </li>
                <li className="flex gap-3">
                  <span className="theme-surface inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold text-brand-white">
                    2
                  </span>
                  <span>Once the payment is verified, you are redirected back into your brand flow automatically.</span>
                </li>
                <li className="flex gap-3">
                  <span className="theme-surface inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold text-brand-white">
                    3
                  </span>
                  <span>Finish store details, payments setup, and product onboarding from the Brand Hub.</span>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/**
 * @param {{ label: string, value: string, helper: string }} props
 */
function MetricCard({ label, value, helper }) {
  return (
    <div className="theme-surface-soft rounded-[22px] border px-5 py-4">
      <p className="theme-text-muted text-[11px] font-bold uppercase tracking-[0.16em]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-extrabold text-brand-white">{value}</p>
      <p className="theme-text-muted mt-2 text-sm">{helper}</p>
    </div>
  );
}

function openRazorpayCheckout({ paymentOrder, storeInfo, onVerify }) {
  return new Promise((resolve, reject) => {
    const razorpay = new window.Razorpay({
      key: paymentOrder.key,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: paymentOrder.companyName || "Shopdibz Private Limited",
      image: paymentOrder.image,
      order_id: paymentOrder.orderId,
      handler: async (response) => {
        try {
          await onVerify(response);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => {
          reject(new Error("CHECKOUT_DISMISSED"));
        },
      },
      prefill: {
        name: String(storeInfo?.storeName || "").trim(),
        email: String(storeInfo?.storeEmail || storeInfo?.user?.email || "").trim(),
        contact: String(storeInfo?.contactNo || storeInfo?.contact_no || "").trim(),
      },
      notes: {
        store_url: String(paymentOrder.storeUrl || "").trim(),
      },
      theme: {
        color: "#caa13a",
      },
    });

    razorpay.on("payment.failed", (event) => {
      const description =
        event?.error?.description ||
        event?.error?.reason ||
        "Payment failed. Please try again.";

      reject(new Error(String(description)));
    });

    razorpay.open();
  });
}
