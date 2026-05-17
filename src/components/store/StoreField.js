/**
 * @param {{ label: string, value: string, onChange: (value: string) => void, placeholder?: string, type?: string, helper?: string, error?: string, maxLength?: number, disabled?: boolean, multiline?: boolean, required?: boolean }} props
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
  required = false,
}) {
  const className =
    `theme-field mt-3 w-full rounded-[15px] border px-4 py-3 text-base outline-none transition-colors placeholder:text-white/25 focus:border-brand-gold disabled:cursor-not-allowed disabled:opacity-60 ${
      error ? "border-red-400/70" : "border-white/15"
    }`;

  return (
    <label className="block">
      <span className="theme-text-muted-strong text-sm font-semibold">{label}</span>
      {multiline ? (
        <textarea
          className={`${className} min-h-32 resize-y`}
          value={value}
          placeholder={placeholder || label}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
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
          required={required}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? (
        <p className="mt-2 text-xs font-semibold text-red-300 [html[data-theme='light']_&]:text-red-700">{error}</p>
      ) : helper ? (
        <p className="theme-text-muted mt-2 text-xs">{helper}</p>
      ) : null}
    </label>
  );
}
