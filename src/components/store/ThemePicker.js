import { storeThemes } from "@/src/data/storeThemes";

/**
 * @param {{ value: string, onChange: (value: string) => void }} props
 */
export default function ThemePicker({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {storeThemes.map((theme) => (
        <button
          className={`rounded-sm border p-4 text-left transition-colors ${
            value === theme.id
              ? "border-brand-gold bg-brand-gold/10"
              : "border-white/10 bg-[#171717]"
          }`}
          key={theme.id}
          type="button"
          onClick={() => onChange(theme.id)}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-brand-white">{theme.name}</span>
            <span className="flex gap-1">
              <span className="h-5 w-5 rounded-sm border border-black/10" style={{ backgroundColor: theme.primaryColor }} />
              <span className="h-5 w-5 rounded-sm border border-black/10" style={{ backgroundColor: theme.iconColor }} />
              <span className="h-5 w-5 rounded-sm border border-black/10" style={{ backgroundColor: theme.fontColor }} />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
