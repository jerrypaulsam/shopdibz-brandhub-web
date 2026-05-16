import { useTheme } from "@/src/components/app/ThemeProvider";

const message =
  "Action Required: Add Product Attributes to Improve Visibility in Aeyra. Click to Update.";

/**
 * @param {{ onTap?: () => void }} props
 */
export default function NewsBanner({ onTap }) {
  const { effectiveTheme } = useTheme();

  return (
    <button
      className="flex w-full cursor-pointer overflow-hidden rounded-sm border border-white/10 bg-[#0F2A3D] text-left"
      type="button"
      onClick={onTap}
    >
      <span className="flex shrink-0 items-center bg-[#12A103] px-3 text-[11px] font-semibold tracking-[0.05em] text-brand-white">
        ALERT
      </span>
      <span className="relative block min-w-0 flex-1 overflow-hidden bg-brand-gold py-2.5">
        <span className="dashboard-marquee-track">
          <span
            className="dashboard-marquee-item"
            style={{ color: effectiveTheme === "light" ? "#fff8f6" : "#120f0a" }}
          >
            {message}
          </span>
          <span
            className="dashboard-marquee-item"
            style={{ color: effectiveTheme === "light" ? "#fff8f6" : "#120f0a" }}
          >
            {message}
          </span>
          <span
            className="dashboard-marquee-item"
            style={{ color: effectiveTheme === "light" ? "#fff8f6" : "#120f0a" }}
          >
            {message}
          </span>
        </span>
      </span>
    </button>
  );
}
