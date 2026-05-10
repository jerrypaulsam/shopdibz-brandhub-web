import Link from "next/link";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import RightPanel from "@/src/components/dashboard/RightPanel";

/**
 * @param {{ children: import("react").ReactNode, navItems: Array<{ label: string, href: string, active: boolean }>, storeInfo: any, title?: string }} props
 */
export default function AccountShell({
  children,
  navItems,
  storeInfo,
  title = "Profile",
}) {
  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1480px] px-4 py-8 md:px-6">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
            Profile
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-brand-white">{title}</h1>
        </div>

        <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_340px]">
          <aside className="rounded-sm border border-white/10 bg-[#121212] p-3">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  className={`flex min-h-11 items-center rounded-sm px-4 text-sm font-semibold transition-colors ${
                    item.active
                      ? "bg-brand-gold/10 text-brand-gold"
                      : "text-white/70 hover:bg-white/5 hover:text-brand-white"
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          <section className="min-w-0">{children}</section>

          <div className="hidden xl:block">
            <RightPanel storeInfo={storeInfo || {}} managers={[]} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
