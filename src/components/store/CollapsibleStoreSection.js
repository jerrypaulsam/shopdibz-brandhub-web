import { useId } from "react";

/**
 * @param {{
 * title: string,
 * subtitle?: string,
 * children: import("react").ReactNode,
 * defaultOpen?: boolean,
 * badge?: string,
 * }} props
 */
export default function CollapsibleStoreSection({
  title,
  subtitle,
  children,
  defaultOpen = false,
  badge = "",
}) {
  const id = useId();

  return (
    <details
      className="rounded-sm border border-white/10 bg-[#121212]"
      open={defaultOpen}
    >
      <summary
        className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 sm:px-6"
        aria-controls={id}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-extrabold text-brand-white">{title}</h2>
            {badge ? (
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">
                {badge}
              </span>
            ) : null}
          </div>
          {subtitle ? <p className="mt-1 text-sm text-white/45">{subtitle}</p> : null}
        </div>
        <span className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-white/35">
          Open
        </span>
      </summary>
      <div className="border-t border-white/10 px-5 py-5 sm:px-6" id={id}>
        {children}
      </div>
    </details>
  );
}
