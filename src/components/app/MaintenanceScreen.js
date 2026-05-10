import Link from "next/link";

export default function MaintenanceScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-brand-white">
      <section className="w-full max-w-2xl rounded-sm border border-white/10 bg-[#101010] p-8 text-center shadow-2xl sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
          Maintenance
        </p>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          Brand Hub is taking a short pause.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
          We are applying updates to seller operations, analytics, and catalog
          workflows. Your store data remains safe. Please check back shortly.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-brand-gold px-5 text-sm font-bold text-brand-black transition-colors hover:bg-brand-white"
            href="/hub"
          >
            Public Hub
          </Link>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/15 px-5 text-sm font-semibold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
            href="https://www.shopdibz.com/contact?utm_source=brand-hub&utm_medium=maintenance"
            target="_blank"
            rel="noreferrer"
          >
            Contact Support
          </a>
        </div>
      </section>
    </main>
  );
}
