/**
 * @param {{ label: string, value: string, onChange: (value: string) => void, placeholder?: string, type?: string, helper?: string, error?: string, maxLength?: number, disabled?: boolean, multiline?: boolean }} props
 */
export default function StoreField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  helper,
  error,
  maxLength,
  disabled = false,
  multiline = false,
}) {
  const className =
    `mt-3 w-full rounded-[15px] border bg-transparent px-4 py-3 text-base text-brand-white outline-none transition-colors placeholder:text-white/25 focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-60 ${
      error ? "border-red-400/70" : "border-white/15"
    }`;

  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/80">{label}</span>
      {multiline ? (
        <textarea
          className={`${className} min-h-32 resize-y`}
          value={value}
          placeholder={placeholder || label}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={className}
          type={type}
          value={value}
          placeholder={placeholder || label}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? (
        <p className="mt-2 text-xs font-semibold text-red-300">{error}</p>
      ) : helper ? (
        <p className="mt-2 text-xs text-white/40">{helper}</p>
      ) : null}
    </label>
  );
}
