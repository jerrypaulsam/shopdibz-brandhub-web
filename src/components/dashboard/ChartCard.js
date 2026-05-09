/**
 * @param {{ title: string, subtitle?: string, children: import("react").ReactNode }} props
 */
export default function ChartCard({ title, subtitle, children }) {
  return (
    <article className="rounded-sm border border-white/10 bg-[#121212] p-5">
      <div className="mb-5 flex flex-col gap-1">
        <h3 className="text-base font-extrabold text-brand-white">{title}</h3>
        {subtitle ? <p className="text-xs text-white/40">{subtitle}</p> : null}
      </div>
      {children}
    </article>
  );
}
