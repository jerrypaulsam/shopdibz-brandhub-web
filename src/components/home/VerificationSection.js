export default function VerificationSection() {
  return (
    <section id="verification" className="-mt-10 bg-brand-soft px-4 pb-24 sm:-mt-24">
      <div className="mx-auto max-w-5xl rounded-sm border border-brand-gold/20 bg-brand-white px-5 py-14 text-center shadow-verification sm:px-20 sm:py-24">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm border border-brand-gold/30 text-4xl text-brand-gold">
          V
        </div>

        <h2 className="mt-8 text-3xl font-extrabold leading-tight text-brand-black sm:text-4xl">
          The Badge of Authenticity
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-base font-light leading-8 text-black/80 sm:text-lg">
          Every brand undergoes a strict quality check. The Rs. 499
          verification fee acts as a filter, ensuring our platform remains
          exclusive to genuine creators while keeping mass-market imitations at
          bay.
        </p>

        <div className="mx-auto mt-12 max-w-2xl rounded-sm border border-brand-gold/30 bg-brand-ivory px-5 py-9">
          <p className="text-6xl font-black leading-none text-brand-black">4.5%</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.35em] text-brand-gold">
            Founder-First Commission
          </p>
          <p className="mt-4 text-xs text-black/40">
            *Current commission rate, subject to change in the future.
          </p>
        </div>
      </div>
    </section>
  );
}
