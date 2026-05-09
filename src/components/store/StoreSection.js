/**
 * @param {{ title: string, subtitle?: string, children: import("react").ReactNode }} props
 */
export default function StoreSection({ title, subtitle, children }) {
  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-brand-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-white/45">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
