import Link from "next/link";

const sections = [
  {
    title: "Product details",
    points: [
      "Add attributes like material, occasion, age group, and color.",
      "Complete product data improves search and recommendations.",
      "More detailed listings increase visibility.",
    ],
  },
  {
    title: "Product ranking",
    points: [
      "Each attribute improves your product score.",
      "Higher score products are shown more often.",
      "Better listings convert more customers.",
    ],
  },
  {
    title: "Brand trust",
    points: [
      "Write a clear and detailed brand description.",
      "Explain your craftsmanship and uniqueness.",
      "Trusted brands perform better in recommendations.",
    ],
  },
];

/**
 * @param {{ open: boolean, onClose: () => void }} props
 */
export default function AeyraInfoPanel({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="theme-overlay fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
      <button
        className="absolute inset-0"
        type="button"
        aria-label="Close Aeyra information panel"
        onClick={onClose}
      />
      <section className="theme-surface relative z-10 w-full max-w-3xl overflow-hidden rounded-[20px] border shadow-2xl">
        <div className="px-5 py-4 sm:px-6">
          <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/20" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                Aeyra Visibility Guide
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-brand-white">
                Improve your product visibility
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Better product and brand data helps customers discover, compare,
                and trust your listings.
              </p>
            </div>
            <button
              className="rounded-sm border border-white/15 px-3 py-1.5 text-sm font-bold text-white/70 transition-colors hover:text-brand-white"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="mt-5 rounded-sm border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/80">
            Aeyra is an AI shopping companion that connects customers with the
            right products from your brand.
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {sections.map((section) => (
              <article
                className="rounded-sm border border-white/10 bg-white/5 p-4"
                key={section.title}
              >
                <h3 className="text-sm font-bold text-brand-white">
                  {section.title}
                </h3>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-300">
                  {section.points.map((point) => (
                    <li className="flex gap-2" key={point}>
                      <span className="pt-1 text-sky-300">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-sm border border-white/10 bg-white/5 p-4 text-sm leading-6 text-white/80">
            The more complete your product and brand data, the better Aeyra can
            match your catalog to the right customers.
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              className="theme-action-positive inline-flex min-h-12 flex-1 items-center justify-center rounded-sm border px-5 text-sm font-bold transition-colors"
              href="/products-list"
              onClick={onClose}
            >
              Update Products
            </Link>
            <a
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-sm bg-brand-red px-5 text-sm font-bold text-brand-white transition-colors hover:bg-[#ff6a6b]"
              href="https://aeyra.shopdibz.com"
              target="_blank"
              rel="noreferrer"
            >
              Visit Aeyra
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
