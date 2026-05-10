import { useMemo, useState } from "react";
import { useRouter } from "next/router";

const actions = [
  ["Product", "product", "+"],
  ["Store", "store", "E"],
  ["Coupon", "coupon", "+"],
  ["Campaign", "campaign", "+"],
];

/**
 * @param {{ storeInfo: any }} props
 */
export default function CreateActions({ storeInfo }) {
  const router = useRouter();
  const [showProductModal, setShowProductModal] = useState(false);
  const [message, setMessage] = useState("");

  const isOwner = useMemo(
    () => Boolean(storeInfo?.user?.owner ?? storeInfo?.owner ?? true),
    [storeInfo],
  );
  const hasVerifiedMobile = useMemo(
    () => Boolean(storeInfo?.user?.mobile),
    [storeInfo],
  );

  function requireMobile() {
    router.push("/new-mobile-verify");
  }

  function handleAction(key) {
    setMessage("");

    if (key === "store") {
      if (!isOwner) {
        setMessage("Only store owners can edit store info.");
        return;
      }

      router.push("/store-info-form");
      return;
    }

    if (!hasVerifiedMobile) {
      requireMobile();
      return;
    }

    if (key === "product") {
      setShowProductModal(true);
      return;
    }

    if (key === "coupon") {
      router.push("/coupons/create");
      return;
    }

    if (key === "campaign") {
      router.push("/campaigns/create?mode=store");
    }
  }

  function openProductFlow(query) {
    setShowProductModal(false);
    router.push({
      pathname: query["listing-mode"] === "bulk" ? "/products/new/bulk" : "/products/new/category",
      query,
    });
  }

  return (
    <>
      <section className="space-y-3">
        {message ? (
          <div className="rounded-sm border border-brand-gold/20 bg-brand-gold/10 px-4 py-3 text-sm text-brand-gold">
            {message}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {actions.map(([label, key, icon]) => (
            <button
              className="flex min-h-16 items-center justify-center gap-3 rounded-sm border border-white/10 bg-[#121212] px-4 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              key={label}
              type="button"
              onClick={() => handleAction(key)}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-gold text-sm font-black text-brand-black">
                {icon}
              </span>
              {label}
            </button>
          ))}
        </div>
      </section>

      {showProductModal ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 md:items-center">
          <button
            className="absolute inset-0"
            type="button"
            aria-label="Close product create options"
            onClick={() => setShowProductModal(false)}
          />
          <section className="relative z-10 w-full max-w-2xl rounded-[18px] border border-white/10 bg-[#0f0f0f] p-5 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                  Verify & List Products
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-brand-white">
                  Choose your listing branch
                </h2>
              </div>
              <button
                className="rounded-sm border border-white/15 px-3 py-1.5 text-sm font-bold text-white/70 transition-colors hover:text-brand-white"
                type="button"
                onClick={() => setShowProductModal(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <ActionOption
                description="List a single product without variation management."
                label="Without Variation"
                onClick={() =>
                  openProductFlow({
                    "listing-mode": "single",
                    "variant-mode": "without-variant",
                  })
                }
              />
              <ActionOption
                description="List a product with variation support from the first step."
                label="With Variation"
                onClick={() =>
                  openProductFlow({
                    "listing-mode": "single",
                    "variant-mode": "with-variant",
                  })
                }
              />
              <ActionOption
                description="Upload and validate a bulk sheet in the dedicated bulk workspace."
                label="Verify Listing Sheet"
                onClick={() =>
                  openProductFlow({
                    "listing-mode": "bulk",
                    "variant-mode": "without-variant",
                  })
                }
              />
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

/**
 * @param {{ label: string, description: string, onClick: () => void }} props
 */
function ActionOption({ label, description, onClick }) {
  return (
    <button
      className="rounded-sm border border-white/10 bg-[#151515] p-5 text-left transition-colors hover:border-brand-gold/40 hover:bg-[#181818]"
      type="button"
      onClick={onClick}
    >
      <p className="text-base font-bold text-brand-white">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
    </button>
  );
}
