import Image from "next/image";

/**
 * @param {{ alt?: string, width?: number, height?: number, className?: string, priority?: boolean, sizes?: string }} props
 */
export default function BrandHubLogo({
  alt = "Shopdibz Brand Hub logo",
  width = 40,
  height = 40,
  className = "",
  priority = false,
  sizes,
}) {
  return (
    <span
      className={`relative inline-block shrink-0 ${className}`.trim()}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src="/assets/logo/seller-logo.png"
        alt={alt}
        fill
        sizes={sizes || `${width}px`}
        className="theme-logo-dark object-contain"
        priority={priority}
      />
      <Image
        src="/assets/logo/icon-192.png"
        alt={alt}
        fill
        sizes={sizes || `${width}px`}
        className="theme-logo-light object-contain"
        priority={priority}
      />
    </span>
  );
}
