import { useEffect, useState } from "react";
import Link from "next/link";
import { clearAuthSession, logoutSeller } from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

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
  const [clickedButton, setClickedButton] = useState(false);

  useEffect(() => {
    if (!storeInfo?.url) {
      return;
    }

    logScreenView("onboard_fee_screen", storeInfo.url || "Anonymous", "store");
  }, [storeInfo?.url]);

  async function handleLogout() {
    await logoutSeller().catch(() => null);
    clearAuthSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  function handlePay() {
    if (!storeInfo?.url) {
      return;
    }

    if (!clickedButton) {
      setClickedButton(true);
      window.open(
        `https://loadapp.shopdibz.com/api/store/get/subscription_plans/?store_url=${storeInfo.url}`,
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
    <main className="min-h-screen bg-[linear-gradient(135deg,#000000,#000033)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-[14px] bg-brand-white p-6 text-brand-black shadow-2xl sm:p-8">
        <div className="flex justify-end">
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-sm border border-black/10 px-4 text-sm font-semibold text-black/80 transition-colors hover:border-black/30"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="mt-8 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-brand-soft" />
          <h1 className="mt-6 text-3xl font-extrabold text-[#000033] sm:text-4xl">
            Shopdibz Seller Hub Onboarding
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#000033]/75">
            Join Shopdibz to connect with customers, build your brand, and
            operate from a seller workspace designed for scale.
          </p>
        </div>

        <div className="mt-8 rounded-[12px] bg-[#f5f5f5] p-6 text-center shadow-sm">
          <p className="text-base text-[#000033] line-through">Rs. 999</p>
          <p className="mt-2 text-2xl font-extrabold text-[#000033]">
            Just Rs. 499 (50% Off)
          </p>
          <p className="mt-2 text-sm font-bold text-brand-red">Limited Time Offer</p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#000033]">
            Advantages of Selling with Shopdibz
          </h2>
          <ul className="mt-4 space-y-3 text-base leading-7 text-[#000033]/80">
            {advantages.map((item) => (
              <li className="flex gap-3" key={item}>
                <span className="pt-1 text-brand-red">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm bg-[#28A745] px-5 text-base font-bold text-brand-white transition-colors hover:bg-[#24933d]"
            type="button"
            onClick={handlePay}
          >
            {clickedButton ? "Payment Complete" : "Pay and Start"}
          </button>
          <Link
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm border border-[#000033]/15 px-5 text-base font-semibold text-[#000033] transition-colors hover:border-[#000033]/35"
            href="/hub"
          >
            Back to Public Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
