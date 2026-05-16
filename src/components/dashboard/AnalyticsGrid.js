const toneMap = {
  gold: "text-amber-500",
  blue: "text-sky-400",
  green: "text-emerald-300",
  purple: "text-purple-400",
  yellow: "text-yellow-300",
  orange: "text-orange-500",
  pink: "text-pink-400",
  red: "text-red-400",
};

/**
 * @param {{ cards: Array<{ label: string, value: string, tone: string }> }} props
 */
export default function AnalyticsGrid({ cards }) {
  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <article
          className="theme-surface rounded-sm border p-4"
          key={card.label}
        >
          <div
            className={`theme-surface-soft mb-5 flex h-9 w-9 items-center justify-center rounded-sm border text-lg font-black ${
              toneMap[card.tone] || "text-brand-gold"
            }`}
          >
            {card.label.slice(0, 1)}
          </div>
          <p className="text-xs text-white/45">{card.label}</p>
          <p className="mt-2 break-words text-xl font-extrabold text-brand-white">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
