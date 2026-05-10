const message =
  "Action Required: Add Product Attributes to Improve Visibility in Aeyra. Click to Update.";

/**
 * @param {{ onTap?: () => void }} props
 */
export default function NewsBanner({ onTap }) {
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
          <span className="dashboard-marquee-item">{message}</span>
          <span className="dashboard-marquee-item">{message}</span>
          <span className="dashboard-marquee-item">{message}</span>
        </span>
      </span>
    </button>
  );
}
