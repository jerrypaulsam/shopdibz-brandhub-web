import ActionButton from "./ActionButton";

export default function HeroSection() {
  return (
    <section className="bg-brand-black px-4 pb-[120px] pt-[120px] text-center text-brand-white sm:px-10 lg:px-[100px] lg:py-[180px]">
      <div className="mx-auto flex min-h-[700px] max-w-6xl flex-col items-center justify-center lg:min-h-[850px]">
        <p className="border border-brand-gold/80 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-gold sm:px-6 sm:text-xs sm:tracking-[0.5em]">
          The Modern Swadeshi Movement
        </p>

        <h1 className="mt-12 max-w-5xl text-4xl font-extrabold leading-tight text-brand-white sm:text-6xl lg:text-7xl">
          Crafted in India,
          <span className="block">Curated for the World.</span>
        </h1>

        <p className="mt-9 max-w-3xl text-base font-light leading-8 text-white/85 sm:text-xl sm:leading-9">
          Shopdibz is a curated ecosystem where quality is the only currency.
          Any genuine high-quality Indian brand or boutique is welcome to join
          our movement.
        </p>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
          <ActionButton href="/new-mobile-verify">
            Apply for Verification
          </ActionButton>
          <ActionButton href="https://www.shopdibz.com" variant="secondary" external>
            Curated Collection
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
