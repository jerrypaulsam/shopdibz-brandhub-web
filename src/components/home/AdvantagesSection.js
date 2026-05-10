const advantages = [
  {
    icon: "A",
    title: "Curated Audience",
    description:
      "Access conscious shoppers who value luxury and true craftsmanship.",
  },
  {
    icon: "V",
    title: "Verified Prestige",
    description:
      "Stand proudly alongside India's most respected boutiques.",
  },
  {
    icon: "I",
    title: "Direct Analytics",
    description:
      "Total, uncompromised visibility into your store's performance.",
  },
  {
    icon: "L",
    title: "Concierge Logistics",
    description:
      "High-care, premium logistics to 18,000+ PIN codes handled by us.",
  },
];

export default function AdvantagesSection() {
  return (
    <section className="bg-brand-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-gold">
          The Swadeshi Advantage
        </p>
        <h2 className="mt-6 text-3xl font-extrabold leading-tight text-brand-black sm:text-5xl">
          Built for India&apos;s Finest.
        </h2>

        <div className="mt-14 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {advantages.map((advantage) => (
            <article
              className="flex h-full flex-col items-start gap-6 rounded-sm border border-black/[0.04] bg-brand-soft p-8 text-left"
              key={advantage.title}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-brand-gold/30 text-lg font-black text-brand-gold">
                {advantage.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-wide text-brand-black">
                  {advantage.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-black/60">
                  {advantage.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
