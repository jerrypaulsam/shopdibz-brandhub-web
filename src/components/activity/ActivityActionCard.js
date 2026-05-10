/**
 * @param {{ title: string, eyebrow: string, description: string, active: boolean, onOpen: () => void }} props
 */
export default function ActivityActionCard({
  title,
  eyebrow,
  description,
  active,
  onOpen,
}) {
  return (
    <button
      className={`flex min-h-[180px] flex-col items-start rounded-sm border p-5 text-left transition-colors ${
        active
          ? "border-brand-gold/60 bg-brand-gold/10"
          : "border-white/10 bg-[#121212] hover:border-white/20 hover:bg-white/[0.03]"
      }`}
      type="button"
      onClick={onOpen}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-lg font-extrabold text-brand-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/55">{description}</p>
      <span className="mt-auto pt-5 text-sm font-semibold text-brand-white">
        {active ? "Selected" : "Open action"}
      </span>
    </button>
  );
}
