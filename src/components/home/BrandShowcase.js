import Image from "next/image";

const brands = [
  {
    name: "Rangrezz Wears",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/9ec454b7723b465e8d0e69c685502222/images.png",
    url: "https://www.shopdibz.com/store/rangrezz",
  },
  {
    name: "Nailzen",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/cee23d5bedc84603a336263b151a4cc1/storeLogo-.jpg",
    url: "https://www.shopdibz.com/store/nailzen",
  },
  {
    name: "Niira",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/5d17361fce86476e85e2dcbad315d9f7/scaled_a1e78896-3115-465c-a6f8-fafff9_AA1UoV6.png",
    url: "https://www.shopdibz.com/store/niira",
  },
  {
    name: "Aakar",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/36b5ae60b855418095ae9ed31da9148b/storeLogo-.jpg",
    url: "https://www.shopdibz.com/store/aakar",
  },
  {
    name: "Freyaa",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/89b55d0aaf4148978df159dffa35aaa3/storeLogo-freyaaurl.jpg",
    url: "https://www.shopdibz.com/store/freyaaurl",
  },
  {
    name: "Ramraj Cotton",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/b251596910ca442bb1b4a439dfc3cc59/ramraj-cotton.jpg",
    url: "https://www.shopdibz.com/store/ramraj",
  },
  {
    name: "Branche",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/d6ff5988693f4bf6a1d7c5e724e94e5c/storeLogo-branche.jpg",
    url: "https://www.shopdibz.com/store/branche",
  },
  {
    name: "The Shirtcraft",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/98899e2dea5a472a8124df444256e56d/shirt-craft-logo.jpg",
    url: "https://www.shopdibz.com/store/theshirtcraft",
    placeholder: false,
  },
];

export default function BrandShowcase() {
  return (
    <section id="showcase" className="bg-brand-soft px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-gold">
          Curated Ecosystem
        </p>
        <h2 className="mt-6 text-3xl font-extrabold leading-tight text-brand-black sm:text-5xl">
          Handpicked Indian Boutiques
        </h2>

        <div className="mt-14 flex flex-wrap justify-center gap-4 sm:gap-5">
          {brands.map((brand) =>
            brand.placeholder ? (
              <div
                key={brand.name}
                className="group flex min-h-[244px] w-[calc(50%-0.5rem)] min-w-0 flex-col items-center justify-center rounded-sm border border-dashed border-brand-gold/35 bg-brand-white p-5 text-center shadow-[0_18px_45px_rgba(0,0,0,0.04)] sm:w-[calc(50%-0.625rem)] sm:p-6 md:w-[calc(33.333%-0.875rem)] xl:w-[calc(25%-0.9375rem)]"
              >
                <span className="mx-auto flex h-[112px] w-[112px] items-center justify-center rounded-sm border border-dashed border-brand-gold/35 bg-brand-soft p-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                  Coming Soon
                </span>
                <span className="mt-5 block text-sm font-bold tracking-[0.08em] text-black/80">
                  {brand.name}
                </span>
                <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-black/40">
                  Reserved slot
                </span>
              </div>
            ) : (
              <a
                key={brand.name}
                className="group w-[calc(50%-0.5rem)] min-w-0 rounded-sm border border-black/[0.04] bg-brand-white p-5 text-center shadow-[0_18px_45px_rgba(0,0,0,0.04)] transition-transform hover:-translate-y-1 sm:w-[calc(50%-0.625rem)] sm:p-6 md:w-[calc(33.333%-0.875rem)] xl:w-[calc(25%-0.9375rem)]"
                href={brand.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="mx-auto flex h-[112px] w-[112px] items-center justify-center rounded-sm border border-brand-gold/20 bg-brand-soft p-3">
                  <Image
                    className="max-h-full max-w-full object-contain"
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={96}
                    height={96}
                  />
                </span>
                <span className="mt-5 block text-sm font-bold tracking-[0.08em] text-black/80">
                  {brand.name}
                </span>
                <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-black/40">
                  Visit Store
                </span>
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
