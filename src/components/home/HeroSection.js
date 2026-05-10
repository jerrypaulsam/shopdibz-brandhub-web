import Image from "next/image";
import ActionButton from "./ActionButton";

const heroBrands = [
  {
    name: "Rangrezz Wears",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/9ec454b7723b465e8d0e69c685502222/images.png",
  },
  {
    name: "Niira",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/5d17361fce86476e85e2dcbad315d9f7/scaled_a1e78896-3115-465c-a6f8-fafff9_AA1UoV6.png",
  },
  {
    name: "Freyaa",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/89b55d0aaf4148978df159dffa35aaa3/storeLogo-freyaaurl.jpg",
  },
];

export default function HeroSection() {
  return (
    <section className="bg-brand-black px-4 pb-20 pt-32 text-brand-white sm:px-8 lg:px-12 lg:pb-24 lg:pt-36">
      <div className="mx-auto grid max-w-[1440px] gap-10 xl:grid-cols-[minmax(0,1.1fr)_420px] xl:items-center">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center xl:mx-0 xl:block xl:text-left">
          <p className="inline-flex min-h-10 items-center justify-center border border-brand-gold/60 px-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold sm:px-5 sm:text-xs xl:justify-start">
            The Modern Swadeshi Movement
          </p>

          <h1 className="mt-8 max-w-5xl text-4xl font-extrabold leading-[1.08] text-brand-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Crafted in India,
            <span className="block text-brand-gold">Curated for the World.</span>
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-8 text-white/78 sm:text-lg">
            Shopdibz is a curated ecosystem where quality is the only currency.
            Genuine Indian brands and boutiques get verification, operations,
            analytics, and growth tools built for modern seller teams.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 xl:justify-start">
            <ActionButton href="/new-mobile-verify">
              Apply for Verification
            </ActionButton>
            <ActionButton
              href="https://www.shopdibz.com"
              variant="secondary"
              external
            >
              Curated Collection
            </ActionButton>
          </div>

          <div className="mt-10 grid w-full max-w-3xl gap-3 md:grid-cols-3">
            <HeroMetric value="4.5%" label="Founder-first commission" />
            <HeroMetric value="18,000+" label="PIN codes serviced" />
            <HeroMetric value="24/7" label="Seller operations support" />
          </div>
        </div>

        <aside className="mx-auto w-full max-w-[420px] rounded-sm border border-white/10 bg-white/[0.03] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
          <div className="grid gap-4">
            <div className="rounded-sm border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-center gap-3 text-center sm:text-left xl:justify-start">
                <div className="relative h-12 w-12 overflow-hidden rounded-sm border border-brand-gold/30 bg-brand-red p-1.5">
                  <Image
                    src="/assets/logo/seller-logo.png"
                    alt="Shopdibz Brand Hub"
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold">
                    Seller Console
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-white">
                    Brand-first growth stack
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {heroBrands.map((brand) => (
                  <div
                    className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/[0.03] px-3 py-3"
                    key={brand.name}
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-sm bg-white p-1">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-white">
                        {brand.name}
                      </p>
                      <p className="mt-1 text-xs text-white/45">Verified on Shopdibz</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-sm border border-brand-gold/20 bg-brand-ivory p-5 text-brand-black">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Verification
                </p>
                <p className="mt-3 text-3xl font-black">Rs. 499</p>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  A filter for genuine creators, not mass-market noise.
                </p>
              </div>

              <div className="rounded-sm border border-white/10 bg-black/30 p-5">
                <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white/45 xl:text-left">
                  Available on
                </p>
                <div className="mt-4 space-y-3">
                  <a
                    className="flex min-h-[68px] items-center justify-center rounded-sm border border-white/10 bg-white px-4 py-3"
                    href="https://play.google.com/store/apps/details?id=com.shopdibz.shopdibz_seller_hub"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/assets/images/google-play-badge.png"
                      alt="Google Play"
                      width={170}
                      height={50}
                      className="h-11 w-auto max-w-[170px] object-contain"
                    />
                  </a>
                  <a
                    className="flex min-h-[68px] items-center justify-center rounded-sm border border-white/10 bg-white px-4 py-3"
                    href="https://apps.apple.com/in/app/shopdibz-seller-hub/id1609054854"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/assets/images/app-store.png"
                      alt="App Store"
                      width={170}
                      height={50}
                      className="h-11 w-auto max-w-[170px] object-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/**
 * @param {{ value: string, label: string }} props
 */
function HeroMetric({ value, label }) {
  return (
    <div className="rounded-sm border border-white/10 bg-white/[0.03] px-4 py-4 text-center xl:text-left">
      <p className="text-xl font-extrabold text-brand-white">{value}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-white/45">{label}</p>
    </div>
  );
}
