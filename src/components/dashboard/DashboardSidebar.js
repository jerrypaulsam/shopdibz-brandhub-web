import Image from "next/image";
import Link from "next/link";
import { clearAuthSession } from "@/src/api/auth";

const menuItems = [
  ["Dashboard", "/home", "D"],
  ["Products", "/products-list", "P"],
  ["Orders", "/orders-list", "O"],
  ["Coupons", "/coupons-list", "C"],
  ["Payments", "/payments-list", "Rs"],
  ["Ads", "/campaigns-list", "A"],
  ["Product Groups", "/product-groups", "G"],
  ["Activity", "/activity", "I"],
  ["Notifications", "/notifications", "N"],
  ["Store Preview", "/mystore/preview", "V"],
  ["Store Reviews", "/store-reviews", "Rv"],
  ["Store Sliders", "/store-slider-image-form", "Sl"],
  ["Penalties", "/penalties", "!"],
  ["Feeds", "/feeds", "F"],
  ["Customer Insights", "/customer-insights", "U"],
  ["Profile", "/profile", "R"],
  ["Change Password", "/settings/change-password", "*"],
  ["Downloads", "/downloads", "↓"],
];

/**
 * @param {{ onNavigate?: () => void }} props
 */
export default function DashboardSidebar({ onNavigate }) {
  function logout() {
    clearAuthSession();
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
        {menuItems.map(([label, href, icon]) => (
          <Link
            className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm font-semibold text-white/72 transition-colors hover:bg-white/5 hover:text-brand-gold"
            href={href}
            key={label}
            onClick={onNavigate}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-white/10 text-xs text-brand-gold">
              {icon}
            </span>
            {label}
          </Link>
        ))}
      </div>

      <Link
        className="mt-8 flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm font-semibold text-white/72 hover:bg-white/5 hover:text-brand-red"
        href="/"
        onClick={() => {
          logout();
          onNavigate?.();
        }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/10 text-xs text-brand-red">
          X
        </span>
        Logout
      </Link>
    </nav>
  );
}
