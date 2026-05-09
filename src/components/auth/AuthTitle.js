/**
 * @param {{ title: string, note?: string, subtitle?: string }} props
 */
export default function AuthTitle({ title, note, subtitle }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold tracking-wide text-brand-white">
        {title}
      </h2>
      {note ? <p className="mt-2 text-xs text-white/70">{note}</p> : null}
      {subtitle ? <p className="mt-2 text-sm text-white/45">{subtitle}</p> : null}
      <div className="mx-auto mt-3 h-0.5 w-[30px] bg-brand-gold" />
    </div>
  );
}
