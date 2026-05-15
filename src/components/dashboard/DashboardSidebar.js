import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { clearAuthSession, logoutSeller } from "@/src/api/auth";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import { useToast } from "@/src/components/app/ToastProvider";
import { PRODUCT_BULK_TEMPLATE_URLS } from "@/src/data/product-variation-options";

const menuItems = [
  { label: "Dashboard", href: "/home", icon: "dashboard", kind: "route" },
  { label: "Products", href: "/products-list", icon: "tag", kind: "route" },
  { label: "New Product", href: "/products/new/category", icon: "plus-box", kind: "route" },
  { label: "Orders", href: "/orders-list?tab=pending", icon: "stream", kind: "route" },
  { label: "Coupons", href: "/coupons-list", icon: "ticket", kind: "route" },
  { label: "Payments", href: "/payments-list?tab=pending", icon: "wallet", kind: "route" },
  { label: "Ads", href: "/campaigns-list", icon: "rocket", kind: "route" },
  { label: "Product Groups", href: "/product-groups", icon: "grid", kind: "route" },
  { label: "Activity", href: "/activity", icon: "activity", kind: "route" },
  { label: "Store Preview", icon: "eye", kind: "preview" },
  { label: "Penalties", href: "/penalty-reasons", icon: "alert", kind: "route" },
  { label: "Notifications", href: "/notifications", icon: "bell", kind: "route" },
  { label: "Store Reviews", href: "/store-reviews", icon: "star", kind: "route" },
  { label: "Store Sliders", href: "/store-slider-management", icon: "image", kind: "route" },
  { label: "New Sliders", href: "/store-slider-image-form", icon: "image-plus", kind: "route" },
  { label: "Profile", href: "/profile", icon: "user", kind: "route" },
  { label: "Bank Details", href: "/settings/bank", icon: "bank", kind: "route" },
  { label: "Change Password", href: "/settings/change-password", icon: "key", kind: "route" },
  { label: "Feeds", icon: "megaphone", kind: "notice", notice: "Feeds is still coming soon." },
  {
    label: "Customer Insights",
    icon: "users",
    kind: "notice",
    notice: "Customer Insights is a premium feature and is still coming soon.",
  },
  {
    label: "Downloads",
    icon: "download",
    kind: "notice",
    notice: "Download templates will be available soon.",
  },
];

/**
 * @param {{ hasStoreUrl?: boolean, onNavigate?: () => void }} props
 */
export default function DashboardSidebar({ hasStoreUrl = true, onNavigate }) {
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);

  function showStoreUrlRequiredToast() {
    showToast({
      message: "Complete store setup first. Other sections unlock after your store URL is created.",
      type: "info",
    });
  }

  async function logout() {
    await logoutSeller().catch(() => null);
    clearAuthSession();

    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  function openPreview() {
    if (typeof window === "undefined") {
      return;
    }

    let parsed = {};

    try {
      const rawSession = window.localStorage.getItem("shopdibz_seller_auth");
      parsed = rawSession ? JSON.parse(rawSession) : {};
    } catch {
      parsed = {};
    }

    const storeUrl =
      parsed?.user?.storeUrl ||
      parsed?.user?.store_url ||
      parsed?.storeUrl ||
      "";

    if (!storeUrl) {
      showToast({
        message: "Store preview will appear after your store URL is available.",
        type: "info",
      });
      return;
    }

    window.open(`https://www.shopdibz.com/store/${storeUrl}`, "_blank", "noopener,noreferrer");
    onNavigate?.();
  }

  return (
    <nav className="flex min-h-full flex-col px-5 py-6">
      <div className="mx-auto rounded-full bg-brand-red px-5 py-1 text-[10px] font-bold uppercase text-brand-white">
        Beta
      </div>

      <div className="mt-7 flex flex-col items-center border-b border-white/10 pb-7">
        <Image
          src="/assets/logo/seller-logo.png"
          alt="Shopdibz seller logo"
          width={60}
          height={60}
          style={{ height: "auto" }}
          priority
        />
        <p className="mt-3 text-sm font-extrabold tracking-wide text-brand-white">
          Brand Hub
        </p>
      </div>

      <div className="mt-6 space-y-2">
        {menuItems.map((item) => {
          const isLocked = !hasStoreUrl;
          const classes =
            `flex min-h-11 w-full items-center gap-3 rounded-sm px-3 text-sm font-semibold transition-colors ${
              isLocked
                ? "cursor-not-allowed text-white/35"
                : "text-white/72 hover:bg-white/5 hover:text-brand-gold"
            }`;

          if (item.kind === "route") {
            return (
              <Link
                className={classes}
                href={item.href}
                key={item.label}
                aria-disabled={isLocked}
                onClick={(event) => {
                  if (isLocked) {
                    event.preventDefault();
                    showStoreUrlRequiredToast();
                    return;
                  }

                  onNavigate?.();
                }}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border ${isLocked ? "border-white/5 text-white/25" : "border-white/10 text-brand-gold"}`}>
                  <SidebarGlyph name={item.icon} />
                </span>
                {item.label}
              </Link>
            );
          }

          return (
            <button
              className={classes}
              key={item.label}
              type="button"
              onClick={() => {
                if (isLocked) {
                  showStoreUrlRequiredToast();
                  return;
                }

                if (item.kind === "preview") {
                  openPreview();
                  return;
                }

                if (item.label === "Downloads") {
                  setIsDownloadsOpen(true);
                  return;
                }

                showToast({
                  message:
                    item.label === "Feeds"
                      ? "Feeds is available in the Brand Hub app. Please view it there."
                      : item.label === "Customer Insights"
                        ? "Customer Insights is coming soon."
                        : item.notice || "This section will be available soon.",
                  type: "info",
                });
                onNavigate?.();
              }}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border ${isLocked ? "border-white/5 text-white/25" : "border-white/10 text-brand-gold"}`}>
                <SidebarGlyph name={item.icon} />
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      <Link
        className="mt-8 flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm font-semibold text-white/72 hover:bg-white/5 hover:text-brand-red"
        href="/"
        onClick={async (event) => {
          event.preventDefault();
          const accepted = await confirm({
            title: "Logout",
            message: "Are you sure you want to log out of Brand Hub?",
            confirmLabel: "Logout",
            cancelLabel: "Stay Logged In",
          });

          if (!accepted) {
            return;
          }

          await logout();
          onNavigate?.();
        }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-xs text-brand-red">
          <SidebarGlyph className="h-4 w-4" name="logout" />
        </span>
        Logout
      </Link>

      {isDownloadsOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-sm border border-white/10 bg-[#121212] p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Downloads
                </p>
                <h2 className="mt-2 text-lg font-extrabold text-brand-white">
                  Templates
                </h2>
              </div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-white/65 transition-colors hover:border-white/20 hover:text-brand-white"
                type="button"
                onClick={() => setIsDownloadsOpen(false)}
              >
                x
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {DOWNLOAD_ITEMS.map((item) => (
                <button
                  key={item.label}
                  className="flex min-h-12 w-full items-center justify-between rounded-sm border border-white/10 px-4 text-left text-sm font-semibold text-white/75 transition-colors hover:border-brand-gold hover:text-brand-white"
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open(item.href, "_blank", "noopener,noreferrer");
                    }
                    showToast({
                      message: `${item.label} opened in a new tab.`,
                      type: "success",
                    });
                  }}
                >
                  <span>{item.label}</span>
                  <SidebarGlyph className="h-4 w-4" name="download" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

const DOWNLOAD_ITEMS = [
  {
    label: "Bulk Listing Without Variation",
    href: PRODUCT_BULK_TEMPLATE_URLS.create["without-variant"],
  },
  {
    label: "Bulk Listing With Variation",
    href: PRODUCT_BULK_TEMPLATE_URLS.create["with-variant"],
  },
  {
    label: "Bulk Update Product Attributes",
    href: "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/bulkUpdatewVar.xlsx",
  },
  {
    label: "Bulk Update Variation Attributes",
    href: "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/bulkUpdatewithVar.xlsx",
  },
  {
    label: "Template for Product/Offer Groups",
    href: "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/ProductCodeAdd.xlsx",
  },
  {
    label: "Template For Featured Products",
    href: "https://shopdibz-main-1.s3.ap-south-1.amazonaws.com/Bulk+create+Template/ProductCodeAdd.xlsx",
  },
  {
    label: "Example Bulk Listing Without Variation",
    href: PRODUCT_BULK_TEMPLATE_URLS.sample["without-variant"],
  },
  {
    label: "Example Bulk Listing With Variation",
    href: PRODUCT_BULK_TEMPLATE_URLS.sample["with-variant"],
  },
];

/**
 * @param {{ name: string, className?: string }} props
 */
function SidebarGlyph({ name, className = "h-4 w-4" }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </>
    ),
    tag: (
      <>
        <path d="M20 10 12 18l-8-8V4h6z" />
        <circle cx="9" cy="9" r="1" />
      </>
    ),
    "plus-box": (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </>
    ),
    stream: (
      <>
        <path d="M4 7h16" />
        <path d="M7 12h13" />
        <path d="M10 17h10" />
      </>
    ),
    ticket: (
      <>
        <path d="M3 9V7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2h-7l-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4Z" />
      </>
    ),
    wallet: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M16 12h4" />
        <circle cx="16" cy="12" r="1" />
      </>
    ),
    rocket: (
      <>
        <path d="M4.5 19.5 9 15l0-4 6-6c2-2 5-2 5-2s0 3-2 5l-6 6H8l-4.5 4.5Z" />
        <path d="M13 11 9 7" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    activity: (
      <>
        <path d="M3 12h4l2-4 4 8 2-4h6" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.5 20h19Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
    bell: (
      <>
        <path d="M6 8a6 6 0 1 1 12 0c0 7 3 6 3 8H3c0-2 3-1 3-8" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </>
    ),
    star: (
      <>
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9Z" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="m21 15-4-4-6 6-3-3-5 5" />
      </>
    ),
    "image-plus": (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="m21 15-4-4-6 6-3-3-5 5" />
        <path d="M18 2v4" />
        <path d="M16 4h4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0 1 16 0" />
      </>
    ),
    key: (
      <>
        <circle cx="8" cy="15" r="4" />
        <path d="M12 15h9" />
        <path d="M18 12v6" />
        <path d="M21 13v4" />
      </>
    ),
    bank: (
      <>
        <path d="M3 10 12 4l9 6" />
        <path d="M5 10v8" />
        <path d="M9 10v8" />
        <path d="M15 10v8" />
        <path d="M19 10v8" />
        <path d="M3 20h18" />
      </>
    ),
    megaphone: (
      <>
        <path d="M3 11v2a2 2 0 0 0 2 2h2l3 5h2l-1.5-5H14l5 3V6l-5 3H5a2 2 0 0 0-2 2Z" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M4 19a5 5 0 0 1 10 0" />
        <circle cx="17" cy="9" r="2" />
        <path d="M15 19a4 4 0 0 1 6 0" />
      </>
    ),
    download: (
      <>
        <path d="M12 4v10" />
        <path d="m8 10 4 4 4-4" />
        <path d="M4 20h16" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17 21 12 16 7" />
        <path d="M21 12H9" />
      </>
    ),
  };

  return <svg {...common}>{icons[name] || icons.dashboard}</svg>;
}
