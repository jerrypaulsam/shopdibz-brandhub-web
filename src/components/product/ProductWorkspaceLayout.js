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
  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1360px] px-4 py-8 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <div className="rounded-sm border border-white/10 bg-[#121212] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                Product Workspace
              </p>
              <h1 className="mt-3 text-3xl font-black text-brand-white">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{subtitle}</p>
              <ToastMessage message={message} type="error" />
              <ToastMessage message={success} type="success" />
            </div>
            {children}
          </section>
          <aside className="space-y-6">
            {aside || (
              <div className="rounded-sm border border-white/10 bg-[#121212] p-5 text-sm leading-6 text-white/55">
                Use direct routes by slug and variation id to jump back into the exact
                product state you want to manage.
              </div>
            )}
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
