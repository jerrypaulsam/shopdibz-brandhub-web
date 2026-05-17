import Image from "next/image";

/**
 * @param {{ alt?: string, width?: number, height?: number, className?: string, priority?: boolean, sizes?: string, variant?: "auto" | "dark" | "light" }} props
 */
export default function BrandHubLogo({
  alt = "Shopdibz Brand Hub logo",
  width = 40,
  height = 40,
  className = "",
  priority = false,
  sizes,
  variant = "auto",
}) {
  const showDarkLogo = variant === "auto" || variant === "dark";
  const showLightLogo = variant === "auto" || variant === "light";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`.trim()}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {showDarkLogo ? (
        <Image
          src="/assets/logo/seller-logo.png"
          alt={alt}
          fill
          sizes={sizes || `${width}px`}
          className={variant === "auto" ? "theme-logo-dark object-contain" : "object-contain"}
          priority={priority}
        />
      ) : null}
      {showLightLogo ? (
        <Image
          src="/assets/logo/icon-192.png"
          alt={alt}
          fill
          sizes={sizes || `${width}px`}
          className={variant === "auto" ? "theme-logo-light object-contain" : "object-contain"}
          priority={priority}
        />
      ) : null}
    </span>
  );
}
