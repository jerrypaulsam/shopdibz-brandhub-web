import { COUPON_TABS } from "@/src/utils/coupons";

/**
 * @param {{ activeTab: string, summary: { active: number, expired: number, exhausted: number, all: number }, onChange: (value: string) => void }} props
 */
export default function CouponFilterTabs({ activeTab, summary, onChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      {COUPON_TABS.map((tab) => (
        <button
          className={`rounded-sm border px-4 py-3 text-left transition-colors ${
            activeTab === tab.slug
              ? "border-brand-gold/60 bg-brand-gold/10"
              : "border-white/10 bg-black/20 hover:border-white/20"
          }`}
          key={tab.slug}
          type="button"
          onClick={() => onChange(tab.slug)}
        >
          <p className="text-sm font-semibold text-brand-white">{tab.label}</p>
          <p className="mt-1 text-xs text-white/45">
            {summary[tab.slug]} coupons
          </p>
        </button>
      ))}
    </div>
  );
}
