import Link from "next/link";

const baseClasses =
  "inline-flex min-h-12 items-center justify-center rounded-sm px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:min-h-14 sm:px-8";

/**
 * @param {{ children: import("react").ReactNode, href: string, variant?: "primary" | "secondary", external?: boolean }} props
 */
export default function ActionButton({
  children,
  href,
  variant = "primary",
  external = false,
}) {
  const variantClasses =
    variant === "primary"
      ? "theme-hero-button-primary border focus-visible:outline-brand-gold"
      : "theme-hero-button-secondary border focus-visible:outline-brand-gold";

  if (external) {
    return (
      <a
        className={`${baseClasses} ${variantClasses}`}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={`${baseClasses} ${variantClasses}`} href={href}>
      {children}
    </Link>
  );
}
