import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  initiateAdWalletRecharge,
  verifyAdWalletRecharge,
} from "@/src/api/adWalletPayment";

const QUICK_AMOUNTS = [100, 200, 500, 1000, 5000, 10000];

/**
 * @param {{ storeInfo: any, className: string, onSuccess?: () => Promise<void> | void, children: import("react").ReactNode }} props
 */
export default function AdWalletRechargeButton({
  storeInfo,
  className,
  onSuccess = async () => {},
  children,
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("500");
  const [isScriptReady, setIsScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.Razorpay),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    if (window.Razorpay) {
      return undefined;
    }

    const existingScript = document.querySelector(
      'script[data-shopdibz-razorpay="true"]',
    );

    if (existingScript) {
      const handleLoad = () => setIsScriptReady(true);
      const handleError = () =>
        setMessage("Payment gateway failed to load. Refresh and try again.");

      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.shopdibzRazorpay = "true";
    script.onload = () => setIsScriptReady(true);
    script.onerror = () =>
      setMessage("Payment gateway failed to load. Refresh and try again.");
    document.body.appendChild(script);

    return undefined;
  }, []);

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setOpen(false);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const storeUrl = String(storeInfo?.url || "").trim();
    const numericAmount = Number(amount);

    if (!storeUrl) {
      setMessage("Store details are unavailable. Please refresh and try again.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 100) {
      setMessage("Please enter an amount of Rs. 100 or more.");
      return;
    }

    if (typeof window === "undefined" || !window.Razorpay) {
      setMessage("Payment gateway is still loading. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const paymentOrder = await initiateAdWalletRecharge({
        storeUrl,
        amount: numericAmount,
      });

      await openRazorpayCheckout({
        paymentOrder,
        storeInfo,
        onVerify: async (paymentResponse) => {
          await verifyAdWalletRecharge(paymentResponse);
        },
      });

      await onSuccess();
      setOpen(false);
      await router.replace(router.asPath);
    } catch (error) {
      const nextMessage =
        error instanceof Error
          ? error.message
          : "Wallet recharge could not be completed.";

      if (nextMessage !== "CHECKOUT_DISMISSED") {
        setMessage(nextMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        className={className}
        type="button"
        onClick={() => {
          setOpen(true);
          setMessage("");
        }}
      >
        {children}
      </button>

      {open ? (
        <div className="theme-overlay fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
          <button
            className="absolute inset-0"
            type="button"
            aria-label="Close ad wallet recharge"
            onClick={closeModal}
          />
          <section className="theme-surface relative z-10 w-full max-w-xl overflow-hidden rounded-[24px] border p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-7">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-[-10%] top-[-12%] h-52 w-52 rounded-full bg-brand-gold/10 blur-3xl" />
              <div className="absolute bottom-[-18%] right-[-8%] h-60 w-60 rounded-full bg-brand-red/10 blur-3xl" />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                    Ad Wallet Recharge
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold text-brand-white">
                    Top up your campaign balance
                  </h2>
                  <p className="theme-text-muted mt-3 text-sm leading-6">
                    Recharge your Shopdibz ad wallet here and continue running campaigns without leaving Brand Hub.
                  </p>
                </div>
                <button
                  className="theme-action-neutral rounded-sm border px-3 py-1.5 text-sm font-bold transition-colors"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>

              <div className="theme-surface-soft mt-6 rounded-[20px] border p-5">
                <p className="theme-text-muted text-xs font-bold uppercase tracking-[0.16em]">
                  Current Balance
                </p>
                <p className="mt-3 text-3xl font-extrabold text-brand-white">
                  Rs. {Number(storeInfo?.wallet || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm font-semibold text-brand-white">
                    Recharge Amount
                  </span>
                  <div className="theme-field mt-3 flex items-center overflow-hidden rounded-[18px] border">
                    <span className="border-r border-white/10 px-4 py-4 text-base font-bold text-brand-gold">
                      Rs.
                    </span>
                    <input
                      className="w-full bg-transparent px-4 py-4 text-lg font-bold text-brand-white outline-none"
                      type="number"
                      inputMode="numeric"
                      min="100"
                      step="1"
                      value={amount}
                      placeholder="Enter amount"
                      onChange={(event) => setAmount(event.target.value)}
                    />
                  </div>
                  <p className="theme-text-muted mt-2 text-xs">
                    Minimum recharge amount is Rs. 100.
                  </p>
                </label>

                <div className="flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((value) => (
                    <button
                      className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                        Number(amount) === value
                          ? "theme-action-accent"
                          : "theme-action-neutral"
                      }`}
                      key={value}
                      type="button"
                      onClick={() => setAmount(String(value))}
                    >
                      Rs. {value.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                {message ? (
                  <div className="theme-toast theme-toast-error rounded-[18px] border px-4 py-3 text-sm">
                    {message}
                  </div>
                ) : !isScriptReady ? (
                  <div className="theme-toast theme-toast-info rounded-[18px] border px-4 py-3 text-sm">
                    Loading secure payment gateway...
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="theme-action-accent inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border px-5 text-base font-extrabold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={!isScriptReady || isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Recharge Wallet"}
                  </button>
                  <button
                    className="theme-action-neutral inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border px-5 text-base font-semibold transition-colors"
                    type="button"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function openRazorpayCheckout({ paymentOrder, storeInfo, onVerify }) {
  return new Promise((resolve, reject) => {
    const accentColor =
      typeof window !== "undefined"
        ? getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
        : "";

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
        name: String(storeInfo?.storeName || storeInfo?.name || "").trim(),
        email: String(storeInfo?.storeEmail || storeInfo?.user?.email || "").trim(),
        contact: String(storeInfo?.contactNo || storeInfo?.contact_no || "").trim(),
      },
      notes: {
        store_url: String(paymentOrder.storeUrl || "").trim(),
        recharge_amount: String(paymentOrder.displayAmount || "").trim(),
      },
      theme: {
        color: accentColor || "#d4af37",
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
