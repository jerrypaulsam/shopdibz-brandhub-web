/**
 * @param {{ title: string, subtitle?: string, children: import("react").ReactNode }} props
 */
export default function StoreSection({ title, subtitle, children }) {
  return (
    <section className="theme-panel rounded-sm border p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
          {title}
        </h2>
        {subtitle ? <p className="theme-text-muted mt-1 text-sm">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
