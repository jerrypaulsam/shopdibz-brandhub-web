import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const OPTIONS = [
  {
    value: "system",
    label: "System",
    shortLabel: "Auto",
  },
  {
    value: "dark",
    label: "Dark",
    shortLabel: "Dark",
  },
  {
    value: "light",
    label: "Light",
    shortLabel: "Light",
  },
];

export default function ThemeToggle() {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[120] md:bottom-6 md:right-6">
      {isOpen ? (
        <div className="theme-popover mb-2 w-40 rounded-2xl border p-2 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="space-y-1">
            {OPTIONS.map((option) => {
              const isActive = theme === option.value;

              return (
                <button
                  key={option.value}
                  className={`theme-toggle-chip flex min-h-10 w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors ${
                    isActive ? "theme-toggle-chip-active" : ""
                  }`}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`Switch theme to ${option.label}`}
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {isActive ? <span className="text-[10px]">Active</span> : null}
                </button>
              );
            })}
          </div>
          <p className="theme-text-muted mt-2 px-2 text-[11px] font-semibold">
            Active: {effectiveTheme === "dark" ? "Dark" : "Light"}
          </p>
        </div>
      ) : null}

      <button
        className="theme-toggle-fab flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.45)] backdrop-blur transition-colors"
        type="button"
        aria-expanded={isOpen}
        aria-label="Toggle theme options"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>Theme</span>
        <span className="theme-text-muted hidden sm:inline">
          {theme === "system" ? "Auto" : theme}
        </span>
      </button>
    </div>
  );
}
