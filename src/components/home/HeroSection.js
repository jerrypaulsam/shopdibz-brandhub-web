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
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1.1fr)_420px] xl:items-center xl:gap-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <p className="inline-flex min-h-10 items-center justify-center border border-brand-gold/60 px-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-gold sm:px-5 sm:text-xs lg:justify-start">
            The Modern Swadeshi Movement
          </p>

          <h1 className="mt-8 max-w-5xl text-4xl font-extrabold leading-[1.08] text-brand-white sm:text-5xl lg:max-w-3xl lg:text-[3.4rem] xl:max-w-5xl xl:text-7xl">
            Crafted in India,
            <span className="block text-brand-gold">Curated for the World.</span>
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-8 text-white/78 sm:text-lg lg:max-w-2xl">
            Shopdibz is a curated ecosystem where quality is the only currency.
            Genuine Indian brands and boutiques get verification, operations,
            analytics, and growth tools built for modern seller teams.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
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

          <div className="mt-10 grid w-full max-w-3xl gap-3 md:grid-cols-3 lg:max-w-none">
            <HeroMetric value="4.5%" label="Founder-first commission" />
            <HeroMetric value="18,000+" label="PIN codes serviced" />
            <HeroMetric value="24/7" label="Seller operations support" />
          </div>
        </div>

        <aside className="mx-auto w-full max-w-[420px] rounded-sm border border-white/10 bg-white/[0.03] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-5 lg:mx-0 lg:mt-3 lg:max-w-none">
          <div className="grid gap-4">
            <div className="rounded-sm border border-white/10 bg-black/30 p-4 sm:p-5">
              <div className="flex items-start gap-3 text-left">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-brand-gold/30 bg-brand-red p-1.5 sm:h-12 sm:w-12">
                  <Image
                    src="/assets/logo/seller-logo.png"
                    alt="Shopdibz Brand Hub"
                    fill
                    sizes="(max-width: 640px) 44px, 48px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold">
                    Brand Console
                  </p>
                  <p className="mt-1 text-sm font-semibold text-brand-white sm:text-[15px]">
                    Brand-first growth stack
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/50">
                    Verification, storefront control, and seller operations in one place.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3">
                {heroBrands.map((brand) => (
                  <div
                    className="flex items-center gap-3 rounded-sm border border-white/10 bg-white/[0.03] px-3 py-2.5 sm:py-3"
                    key={brand.name}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-white p-1 sm:h-12 sm:w-12">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 640px) 40px, 48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-brand-white">
                        {brand.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/45 sm:mt-1 sm:text-xs">
                        Verified on Shopdibz
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-sm border border-brand-gold/20 bg-brand-ivory p-4 text-brand-black sm:p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Verification
                </p>
                <p className="mt-3 text-[1.75rem] font-black sm:text-3xl">Rs. 499</p>
                <p className="mt-2 text-sm leading-6 text-black/65">
                  A filter for genuine creators, not mass-market noise.
                </p>
              </div>

              {/* <div className="rounded-sm border border-white/10 bg-black/30 p-5">
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
                      src="/assets/images/google_play_logo.svg"
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
                      src="/assets/images/apple_store_logo.svg"
                      alt="App Store"
                      width={170} 
                      height={50}
                      className="h-11 w-auto max-w-[170px] object-contain"
                    />
                  </a>
                </div>
              </div> */}
              
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
