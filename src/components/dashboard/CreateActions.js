import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import {
  getAuthSessionSnapshot,
  subscribeAuthSession,
} from "@/src/api/auth";

const actions = [
  ["Product", "product", "plus-box"],
  ["Store", "store", "edit"],
  ["Coupon", "coupon", "ticket-plus"],
  ["Campaign", "campaign", "rocket-plus"],
];

/**
 * @param {{ storeInfo: any }} props
 */
export default function CreateActions({ storeInfo }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const authSession = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    () => null,
  );
  const parsedAuthSession = useMemo(() => {
    if (!authSession) {
      return null;
    }

    try {
      return JSON.parse(authSession);
    } catch {
      return null;
    }
  }, [authSession]);

  const isOwner = useMemo(
    () =>
      Boolean(
        storeInfo?.user?.owner ??
          storeInfo?.owner ??
          parsedAuthSession?.user?.owner ??
          false,
      ),
    [parsedAuthSession?.user?.owner, storeInfo],
  );
  const hasVerifiedMobile = useMemo(
    () => Boolean(storeInfo?.user?.mobile || parsedAuthSession?.user?.mobile),
    [parsedAuthSession?.user?.mobile, storeInfo],
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
      setIsProductDialogOpen(true);
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
  return (
    <section className="space-y-3">
      {message ? (
        <div className="rounded-sm border border-brand-gold/20 bg-brand-gold/10 px-4 py-3 text-sm text-brand-gold">
          {message}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
        {actions.map(([label, key, icon]) => (
          <button
            className="grid min-h-16 grid-cols-[32px_minmax(0,1fr)] items-center gap-3 rounded-sm border border-white/10 bg-[#121212] px-4 text-left text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
            key={label}
            type="button"
            onClick={() => handleAction(key)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-gold text-sm font-black text-brand-black">
              <ActionGlyph name={icon} />
            </span>
            <span className="block truncate">{label}</span>
          </button>
        ))}
      </div>
      {isProductDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-xl rounded-sm border border-white/10 bg-[#121212] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                  Product Actions
                </p>
                <h2 className="mt-2 text-2xl font-black text-brand-white">
                  Verify And List Products
                </h2>
              </div>
              <button
                className="rounded-sm border border-white/10 px-3 py-1.5 text-sm font-bold text-white/60 hover:border-white/30 hover:text-brand-white"
                type="button"
                onClick={() => setIsProductDialogOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3">
              <ProductRouteButton
                label="Without Variation"
                description="Open the single-product flow with the non-variation contract."
                onClick={() => {
                  setIsProductDialogOpen(false);
                  router.push({
                    pathname: "/products/new/category",
                    query: {
                      "listing-mode": "single",
                      "variant-mode": "without-variant",
                    },
                  });
                }}
              />
              <ProductRouteButton
                label="With Variation"
                description="Open the single-product flow with variation mapping enabled."
                onClick={() => {
                  setIsProductDialogOpen(false);
                  router.push({
                    pathname: "/products/new/category",
                    query: {
                      "listing-mode": "single",
                      "variant-mode": "with-variant",
                    },
                  });
                }}
              />
              <ProductRouteButton
                label="Bulk Listing"
                description="Choose category, pick with or without variant, then upload the bulk sheet."
                onClick={() => {
                  setIsProductDialogOpen(false);
                  router.push({
                    pathname: "/products/new/category",
                    query: {
                      "listing-mode": "bulk",
                      "variant-mode": "without-variant",
                    },
                  });
                }}
              />
              <ProductRouteButton
                label="Verify Listing Sheet"
                description="Open a dedicated sheet-check workspace before you submit any bulk listing."
                onClick={() => {
                  setIsProductDialogOpen(false);
                  router.push("/products/verify-listing-sheet");
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

/**
 * @param {{ label: string, description: string, onClick: () => void }} props
 */
function ProductRouteButton({ label, description, onClick }) {
  return (
    <button
      className="rounded-sm border border-white/10 bg-black/20 p-4 text-left transition-colors hover:border-brand-gold hover:bg-brand-gold/10"
      type="button"
      onClick={onClick}
    >
      <p className="text-sm font-bold text-brand-white">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
    </button>
  );
}

/**
 * @param {{ name: string, className?: string }} props
 */
function ActionGlyph({ name, className = "h-4 w-4" }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
  };

  if (name === "edit") {
    return (
      <svg {...common}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L8 18l-4 1 1-4z" />
      </svg>
    );
  }

  if (name === "ticket-plus") {
    return (
      <svg {...common}>
        <path d="M3 9V7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2h-7l-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
        <path d="M12 10v6" />
        <path d="M9 13h6" />
      </svg>
    );
  }

  if (name === "rocket-plus") {
    return (
      <svg {...common}>
        <path d="M4.5 19.5 9 15l0-4 6-6c2-2 5-2 5-2s0 3-2 5l-6 6H8l-4.5 4.5Z" />
        <path d="M13 11 9 7" />
        <path d="m5 14-2 2" />
        <path d="M19 9v4" />
        <path d="M17 11h4" />
      </svg>
    );
  }

  if (name === "external") {
    return (
      <svg {...common}>
        <path d="M14 5h5v5" />
        <path d="M10 14 19 5" />
        <path d="M19 14v5h-14v-14h5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}
