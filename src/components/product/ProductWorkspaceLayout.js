import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ToastMessage from "@/src/components/app/ToastMessage";

/**
 * @param {{ title: string, subtitle: string, message?: string, success?: string, children: import("react").ReactNode, aside?: import("react").ReactNode }} props
 */
export default function ProductWorkspaceLayout({
  title,
  subtitle,
  message,
  success,
  children,
  aside,
}) {
  const hasAside = Boolean(aside);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1360px] px-4 py-8 md:px-6">
        <div className={`grid gap-6 ${hasAside ? "xl:grid-cols-[minmax(0,1fr)_320px]" : ""}`}>
          <section className="space-y-6">
            <div className="theme-panel rounded-sm border p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                Product Management
              </p>
              <h1 className="mt-3 text-3xl font-black text-brand-white [html[data-theme='light']_&]:text-[#2f241f]">
                {title}
              </h1>
              <p className="theme-text-muted mt-3 max-w-3xl text-sm leading-6">{subtitle}</p>
              <ToastMessage message={message} type="error" />
              <ToastMessage message={success} type="success" />
            </div>
            {children}
          </section>
          {hasAside ? <aside className="space-y-6">{aside}</aside> : null}
        </div>
      </div>
    </DashboardShell>
  );
}
