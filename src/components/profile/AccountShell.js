import Link from "next/link";
import DashboardShell from "@/src/components/dashboard/DashboardShell";

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
            <ProfileSidePanel storeInfo={storeInfo || {}} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ProfileSidePanel({ storeInfo }) {
  const description =
    storeInfo?.description ||
    storeInfo?.desc ||
    storeInfo?.storeDescription ||
    "Store description has not been added yet.";

  const planCode = storeInfo?.plan || "F";
  const planLabel =
    planCode === "S"
      ? "Silver Plan"
      : planCode === "G"
        ? "Gold Plan"
        : planCode === "P"
          ? "Platinum Plan"
          : "Free Plan";

  return (
    <aside className="space-y-4">
      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
          Store Summary
        </p>
        <h2 className="mt-3 text-lg font-extrabold text-brand-white">
          {storeInfo?.name || "Store"}
        </h2>
        <p className="mt-1 text-sm text-white/45">
          {storeInfo?.url ? `@${storeInfo.url}` : "Store URL pending"}
        </p>
        <div className="mt-4 grid gap-3">
          <ProfileField label="Plan" value={planLabel} />
          <ProfileField label="GSTIN" value={storeInfo?.tin || "---"} />
          <ProfileField
            label="Visibility"
            value={storeInfo?.active === false ? "Inactive" : "Active"}
          />
        </div>
      </section>

      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-brand-white">Store Description</p>
          <Link
            className="text-xs font-bold uppercase tracking-[0.12em] text-brand-gold hover:text-brand-white"
            href="/store-info-form"
          >
            Edit
          </Link>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/60">{description}</p>
      </section>
    </aside>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
