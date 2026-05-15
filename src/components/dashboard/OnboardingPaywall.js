import { useEffect, useState } from "react";
import Link from "next/link";
import { clearAuthSession, logoutSeller } from "@/src/api/auth";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import { logScreenView } from "@/src/api/analytics";
import { API_BASE_URL, SHOPDIBZ_URLS } from "@/src/api/config";

const advantages = [
  "Increase your profit per sale with lower commission rates.",
  "Build your own brand page inside the Shopdibz mall.",
  "Grow a loyal customer community across India.",
  "Use seller tools and analytics built for modern D2C teams.",
  "Get dedicated support from the seller success team.",
];

/**
 * @param {{ storeInfo: any }} props
 */
export default function OnboardingPaywall({ storeInfo }) {
  const { confirm } = useConfirm();
  const [clickedButton, setClickedButton] = useState(false);

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

  function handlePay() {
    const storeUrl = String(storeInfo?.url || "").trim();
    const userCode = String(
      storeInfo?.userCode ||
        storeInfo?.uCode ||
        storeInfo?.user?.userCode ||
        storeInfo?.user?.uCode ||
        "",
    ).trim();

    if (!storeUrl) {
      return;
    }

    if (!clickedButton) {
      setClickedButton(true);
      window.open(
        `${API_BASE_URL}${SHOPDIBZ_URLS.onboardPaymentInit}?storeUrl=${encodeURIComponent(storeUrl)}${userCode ? `&code=${encodeURIComponent(userCode)}` : ""}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070707] px-4 py-8 text-brand-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
        <div className="absolute right-[-8%] top-[12%] h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[18%] h-96 w-96 rounded-full bg-[#1d3d2f]/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_35%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="flex justify-end">
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/80 transition-colors hover:border-white/20 hover:bg-white/8 hover:text-brand-white"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
          <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(18,18,18,0.96),rgba(8,8,8,0.92))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:p-8 lg:p-10">
            <div className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-gold">
              Onboarding Fee
            </div>

            <div className="mt-6 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-[-0.03em] text-brand-white sm:text-5xl">
                Launch your store with a cleaner, faster seller setup.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
                Activate your Brand Hub onboarding and unlock the seller workspace,
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
                helper="Open pricing in a new tab"
              />
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/38">
                    Seller Activation
                  </p>
                  <div className="mt-3 flex items-end gap-3">
                    <p className="text-4xl font-extrabold text-brand-white sm:text-5xl">
                      Rs. 499
                    </p>
                    <p className="pb-2 text-lg font-semibold text-white/28 line-through">
                      Rs. 999
                    </p>
                  </div>
                </div>
                <div className="inline-flex rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
                  Limited Time Offer
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">
                Use this one-time onboarding flow to complete seller activation and continue the rest of your Brand Hub setup with full access.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-extrabold text-brand-white">
                Why brands choose Shopdibz
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {advantages.map((item) => (
                  <div
                    className="flex gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-4"
                    key={item}
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-xs font-bold text-brand-gold">
                      +
                    </span>
                    <p className="text-sm leading-6 text-white/68">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="rounded-[24px] border border-brand-gold/20 bg-[#111111] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                Next Step
              </p>
              <h2 className="mt-3 text-2xl font-extrabold text-brand-white">
                Complete onboarding
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/58">
                Open the onboarding payment flow, finish payment, then return here to continue into your seller workspace.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#caa13a,#f0d482)] px-5 text-base font-extrabold text-black transition-transform hover:-translate-y-0.5"
                  type="button"
                  onClick={handlePay}
                >
                  {clickedButton ? "Continue to Brand Hub" : "Pay and Start"}
                </button>
                <Link
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-white/12 bg-white/4 px-5 text-base font-semibold text-white/80 transition-colors hover:border-white/20 hover:bg-white/7 hover:text-brand-white"
                  href="/hub"
                >
                  Back to Public Hub
                </Link>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/8 bg-black/20 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/38">
                What happens after payment
              </p>
              <ol className="mt-4 space-y-4 text-sm text-white/62">
                <li className="flex gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xs font-bold text-brand-white">
                    1
                  </span>
                  <span>Pricing opens in a separate tab so you can complete activation securely.</span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xs font-bold text-brand-white">
                    2
                  </span>
                  <span>After payment, use the same button again to continue back into your seller flow.</span>
                </li>
                <li className="flex gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xs font-bold text-brand-white">
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
    <div className="rounded-[22px] border border-white/10 bg-black/20 px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="mt-3 text-2xl font-extrabold text-brand-white">{value}</p>
      <p className="mt-2 text-sm text-white/50">{helper}</p>
    </div>
  );
}
