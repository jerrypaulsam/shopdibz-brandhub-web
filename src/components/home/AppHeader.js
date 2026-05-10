import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginModal from "./LoginModal";

const callbackUrl =
  "https://www.shopdibz.com/activity/callback-seller?utm_source=brand-hub&utm_medium=organic";

const menuItems = [
  {
    label: "Download App",
    href: "https://play.google.com/store/apps/details?id=com.shopdibz.shopdibz_seller_hub",
    accent: true,
  },
  {
    label: "Selling Fees",
    href: "https://www.shopdibz.com/store-services?utm_source=brand-hub&utm_medium=organic",
  },
  {
    label: "Contact",
    href: "https://www.shopdibz.com/contact?utm_source=brand-hub&utm_medium=organic",
  },
];

function LogoTitle() {
  return (
    <Link className="flex min-w-0 items-center gap-3" href="/hub">
      <span className="relative h-[40px] w-[40px] shrink-0">
        <Image
          src="/assets/logo/seller-logo.png"
          alt="Shopdibz seller logo"
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </span>
      <span className="truncate text-[18px] font-bold tracking-[0.06em] text-[#f4f4f7] sm:text-[20px]">
        Shopdibz Brand Hub
      </span>
    </Link>
  );
}

/**
 * @param {{ item: { label: string, href: string, accent?: boolean }, onClick?: () => void }} props
 */
function MenuButton({ item, onClick }) {
  return (
    <a
      className={`inline-flex min-h-10 items-center justify-center rounded px-4 py-2 text-sm font-semibold tracking-wide transition-colors ${
        item.accent
          ? "border border-brand-gold bg-brand-gold/15 text-brand-gold hover:bg-brand-gold hover:text-brand-black"
          : "border border-white/40 text-[#f4f4f7] hover:border-brand-gold hover:text-brand-gold"
      }`}
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
      onClick={onClick}
    >
      {item.label}
    </a>
  );
}

export default function AppHeader() {
  /** @type {[boolean, import("react").Dispatch<import("react").SetStateAction<boolean>>]} */
  const [isOpen, setIsOpen] = useState(false);
  /** @type {[boolean, import("react").Dispatch<import("react").SetStateAction<boolean>>]} */
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-brand-black text-brand-white">
      <div className="border-b border-white/10 bg-brand-black/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12">
          <LogoTitle />

          <nav className="hidden items-center gap-3 lg:flex">
            <button
              className="inline-flex min-h-10 items-center justify-center rounded border border-white/40 px-4 py-2 text-sm font-semibold tracking-wide text-[#f4f4f7] transition-colors hover:border-brand-gold hover:text-brand-gold"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            {menuItems.map((item) => (
              <MenuButton key={item.label} item={item} />
            ))}
            <a
              className="inline-flex min-h-10 items-center justify-center rounded bg-brand-gold px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-brand-black transition-colors hover:bg-brand-white"
              href={callbackUrl}
              target="_blank"
              rel="noreferrer"
            >
              Request Callback
            </a>
          </nav>

          <button
            className="inline-flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1 rounded border border-white/40 text-brand-white lg:hidden"
            type="button"
            aria-label="Open menu"
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? (
              <span className="text-xl leading-none">×</span>
            ) : (
              <>
                <span className="h-0.5 w-5 bg-brand-white" />
                <span className="h-0.5 w-5 bg-brand-white" />
                <span className="h-0.5 w-5 bg-brand-white" />
              </>
            )}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-b border-white/10 bg-brand-black px-4 pb-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-3">
            <button
              className="inline-flex min-h-10 items-center justify-center rounded border border-white/40 px-4 py-2 text-sm font-semibold tracking-wide text-brand-white"
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsLoginOpen(true);
              }}
            >
              Login
            </button>
            {menuItems.map((item) => (
              <MenuButton
                key={item.label}
                item={item}
                onClick={() => setIsOpen(false)}
              />
            ))}
            <a
              className="inline-flex min-h-11 items-center justify-center rounded bg-brand-gold px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-brand-black"
              href={callbackUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsOpen(false)}
            >
              Request Callback
            </a>
          </nav>
        </div>
      ) : null}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
}
