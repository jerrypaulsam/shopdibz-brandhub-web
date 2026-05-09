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
    <section className="bg-brand-white px-5 py-[100px] sm:px-10 lg:px-[100px]">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-gold">
          The Swadeshi Advantage
        </p>
        <h2 className="mt-6 text-3xl font-extrabold leading-tight text-brand-black sm:text-5xl">
          Built for India&apos;s Finest.
        </h2>

        <div className="mt-[90px] grid gap-10 lg:grid-cols-2">
          {advantages.map((advantage) => (
            <article
              className="flex items-start gap-7 rounded-sm border border-black/[0.03] bg-brand-soft p-10 text-left"
              key={advantage.title}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-brand-gold/30 text-lg font-black text-brand-gold">
                {advantage.icon}
              </span>
              <div>
                <h3 className="text-xl font-bold tracking-wide text-brand-black">
                  {advantage.title}
                </h3>
                <p className="mt-4 text-base font-light leading-[1.6] text-black/60">
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
