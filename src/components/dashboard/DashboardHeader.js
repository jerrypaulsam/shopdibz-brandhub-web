import Image from "next/image";

/**
 * @param {{ storeInfo: any }} props
 */
export default function DashboardHeader({ storeInfo }) {
  return (
    <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
          Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-brand-white md:text-4xl">
          {storeInfo?.name || "Brand Command Center"}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
          Track orders, revenue, product health, and brand readiness from a
          single workspace built for daily seller operations.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-sm border border-white/10 bg-[#121212] p-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-brand-gold/30 bg-brand-black">
          <Image
            src={storeInfo?.logo || "/assets/logo/seller-logo.png"}
            alt={`${storeInfo?.name || "Store"} logo`}
            fill
            sizes="56px"
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-brand-white">
            {storeInfo?.name || "Store setup pending"}
          </p>
          <p className="mt-1 truncate text-xs text-white/45">
            {storeInfo?.url ? `shopdibz.com/store/${storeInfo.url}` : "No store URL yet"}
          </p>
        </div>
        <span className="ml-auto rounded-sm border border-brand-gold/40 px-3 py-1 text-xs font-bold uppercase text-brand-gold">
          {storeInfo?.prem ? storeInfo?.plan || "Premium" : "Free"}
        </span>
      </div>
    </header>
  );
}
