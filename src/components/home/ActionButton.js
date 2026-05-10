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
      ? "border border-brand-white bg-brand-white text-brand-black hover:bg-brand-gold hover:border-brand-gold focus-visible:outline-brand-gold"
      : "border border-white/70 text-brand-white hover:border-brand-gold hover:text-brand-gold focus-visible:outline-brand-white";

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
