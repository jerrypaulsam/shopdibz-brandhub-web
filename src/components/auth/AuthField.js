/**
 * @param {{ label: string, value: string, onChange: (value: string) => void, type?: string, placeholder?: string, autoComplete?: string, maxLength?: number, centered?: boolean }} props
 */
export default function AuthField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  maxLength,
  centered = false,
}) {
  return (
    <label className="block text-sm font-semibold text-white/80">
      {label}
      <input
        className={`mt-3 h-14 w-full rounded-sm border border-white/20 bg-transparent px-4 text-base text-brand-white outline-none transition-colors placeholder:text-white/30 focus:border-brand-gold ${
          centered ? "text-center tracking-[0.5em]" : ""
        }`}
        type={type}
        value={value}
        placeholder={placeholder || label}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
