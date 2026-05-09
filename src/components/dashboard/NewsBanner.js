export default function NewsBanner() {
  return (
    <section className="rounded-sm border border-brand-gold/30 bg-[#17130a] px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-extrabold text-brand-gold">
            Aeyra assistant is coming to Brand Hub
          </p>
          <p className="mt-1 text-sm text-white/60">
            Prepare listings, operations, and campaign decisions with guided
            brand intelligence.
          </p>
        </div>
        <button
          className="rounded-sm border border-brand-gold/50 px-4 py-2 text-sm font-bold text-brand-gold"
          type="button"
        >
          Learn More
        </button>
      </div>
    </section>
  );
}
