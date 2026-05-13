export default function VerificationSection() {
  return (
    <section id="verification" className="bg-brand-soft px-4 pb-20 sm:px-8 sm:pb-24 lg:px-12">
      <div className="mx-auto max-w-5xl rounded-sm border border-brand-gold/20 bg-brand-white px-5 py-14 text-center shadow-verification sm:px-12 sm:py-16 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center lg:gap-10 lg:px-12 lg:py-14 lg:text-left xl:px-16 xl:py-20">
        <div>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm border border-brand-gold/30 text-4xl text-brand-gold lg:mx-0">
            V
          </div>

          <h2 className="mt-8 text-3xl font-extrabold leading-tight text-brand-black sm:text-4xl">
            The Badge of Authenticity
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base font-light leading-8 text-black/80 sm:text-lg lg:mx-0 lg:max-w-2xl">
            Every brand undergoes a strict quality check. The Rs. 499
            verification fee acts as a filter, ensuring our platform remains
            exclusive to genuine creators while keeping mass-market imitations at
            bay.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl rounded-sm border border-brand-gold/30 bg-brand-ivory px-5 py-9 lg:mx-0 lg:mt-0 lg:w-full lg:px-6 lg:py-8 lg:text-center">
          <p className="text-5xl font-black leading-none text-brand-black sm:text-6xl">4.5%</p>
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
