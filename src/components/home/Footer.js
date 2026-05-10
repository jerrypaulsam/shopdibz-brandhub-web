import Image from "next/image";

const footerColumns = [
  {
    heading: "ABOUT",
    links: [
      ["Contact Us", "https://www.shopdibz.com/contact"],
      ["About Us", "https://www.shopdibz.com/about-shopdibz"],
      ["Careers", "https://www.shopdibz.com/careers"],
      ["FAQ", "https://www.shopdibz.com/faq?option=brand"],
    ],
  },
  {
    heading: "TERMS",
    links: [
      ["Terms Of Use", "https://www.shopdibz.com/termsandconditions"],
      ["Privacy Policy", "https://www.shopdibz.com/privacypolicy"],
      ["Seller Services", "https://www.shopdibz.com/seller-services-agreement/"],
    ],
  },
  {
    heading: "SOCIAL",
    links: [
      ["Twitter", "https://twitter.com/shopdibz"],
      ["Facebook", "https://www.facebook.com/shopdibzBrandHub"],
      ["Instagram", "https://www.instagram.com/shopdibz_brands/"],
      ["LinkedIn", "https://www.linkedin.com/company/shopdibz/"],
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-black px-5 py-14 text-brand-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[repeat(3,minmax(0,1fr))_1.35fr]">
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-sm font-black tracking-[0.2em] text-brand-white">
                {column.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      className="text-sm text-white/75 transition-colors hover:text-brand-gold"
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:border-l lg:border-white/15 lg:pl-8">
            <p className="text-sm text-white/80">
              <span className="font-bold text-brand-white">Phone:</span> +91 8506951656
            </p>
            <p className="mt-3 text-sm text-white/80">
              <span className="font-bold text-brand-white">Email:</span> contact@shopdibz.com
            </p>
            <p className="mt-3 text-sm leading-6 text-white/80">
              <span className="font-bold text-brand-white">Registered Address:</span>{" "}
              Kumarapuram, Trivandrum, Kerala - 695011
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://play.google.com/store/apps/details?id=com.shopdibz.shopdibz_seller_hub"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/assets/images/google-play-badge.png"
                  alt="Shopdibz Brand Hub on Google Play"
                  width={164}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </a>
              <a
                href="https://apps.apple.com/in/app/shopdibz-seller-hub/id1609054854"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src="/assets/images/app-store.png"
                  alt="Shopdibz Brand Hub on App Store"
                  width={164}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-center text-sm text-white/70">
          Copyright © {year} | Shopdibz Private Limited™
        </div>
      </div>
    </footer>
  );
}
