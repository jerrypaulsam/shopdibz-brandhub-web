/**
 * @param {{ label: string, value: string, onChange: (value: string) => void, type?: string, placeholder?: string, autoComplete?: string, maxLength?: number, centered?: boolean, disabled?: boolean }} props
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
  disabled = false,
}) {
  return (
    <label className="theme-text-muted-strong block text-sm font-semibold">
      {label}
      <input
        className={`theme-field mt-3 h-14 w-full rounded-sm border px-4 text-base outline-none transition-colors placeholder:text-white/30 focus:border-brand-gold ${
          centered ? "text-center tracking-[0.5em]" : ""
        }`}
        type={type}
        value={value}
        placeholder={placeholder || label}
        autoComplete={autoComplete}
        maxLength={maxLength}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
