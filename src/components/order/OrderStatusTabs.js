import { ORDER_TABS } from "@/src/utils/orders";

/**
 * @param {{ activeTab: string, onChange: (value: string) => void }} props
 */
export default function OrderStatusTabs({ activeTab, onChange }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {ORDER_TABS.map((tab) => {
          const isActive = tab.slug === activeTab;

          return (
            <button
              className={`min-h-11 rounded-sm border px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-white/10 bg-[#121212] text-white/65 hover:border-white/20 hover:text-brand-white"
              }`}
              key={tab.slug}
              type="button"
              onClick={() => onChange(tab.slug)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
