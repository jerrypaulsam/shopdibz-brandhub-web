import Image from "next/image";

const brands = [
  {
    name: "Rangrezz Wears",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/9ec454b7723b465e8d0e69c685502222/images.png",
    url: "https://www.shopdibz.com/store/rangrezz",
  },
  {
    name: "Luna & Love",
    logo: "https://shopdibz-main-1.s3.amazonaws.com/media/store/store_logos/881bf438039341b68a7d65106a4c52e9/storeLogo-pixelz_es2OPtr.jpg",
    url: "https://www.shopdibz.com/store/lunalove",
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
];

export default function BrandShowcase() {
  return (
    <section id="showcase" className="bg-brand-soft px-5 pb-24 pt-8 sm:pb-36">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-gold">
          Curated Ecosystem
        </p>
        <h2 className="mt-6 text-3xl font-extrabold leading-tight text-brand-black sm:text-5xl">
          Handpicked Indian Boutiques
        </h2>

        <div className="mt-16 overflow-x-auto pb-8">
          <div className="flex min-w-max justify-center gap-12 px-3">
            {brands.map((brand) => (
              <a
                key={brand.name}
                className="group block w-[130px] text-center"
                href={brand.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="flex h-[130px] w-[130px] items-center justify-center rounded-sm border border-brand-gold/20 bg-brand-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-transform group-hover:-translate-y-1">
                  <Image
                    className="max-h-full max-w-full object-contain"
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={114}
                    height={114}
                  />
                </span>
                <span className="mt-6 block text-sm font-bold tracking-[0.08em] text-black/80">
                  {brand.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
