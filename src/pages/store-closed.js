export default function StoreClosedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black px-6 text-brand-white">
      <section className="w-full max-w-lg rounded-sm border border-white/10 bg-black/20 p-10 text-center">
        <h1 className="text-2xl font-extrabold">Store Closed</h1>
        <p className="mt-6 text-sm text-white/65">Please contact store support.</p>
        <div className="mt-8">
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-brand-gold/40 px-6 text-sm font-bold text-brand-gold transition-colors hover:border-brand-white hover:text-brand-white"
            href="https://www.shopdibz.com/contact"
            target="_blank"
            rel="noreferrer"
          >
            Contact
          </a>
        </div>
      </section>
    </main>
  );
}
