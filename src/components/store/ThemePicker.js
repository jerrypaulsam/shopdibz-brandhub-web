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
              ? "border-brand-gold bg-brand-gold/10 shadow-[0_0_0_1px_rgba(212,175,55,0.1)]"
              : "theme-surface"
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
          <p className="theme-text-muted mt-3 text-xs leading-5">
            {theme.id === "0"
              ? "Balanced starter palette for general storefront use."
              : "Preview colors for buttons, icons, and storefront text."}
          </p>
        </button>
      ))}
    </div>
  );
}
