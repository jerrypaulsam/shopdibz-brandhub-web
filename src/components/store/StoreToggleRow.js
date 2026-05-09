/**
 * @param {{ label: string, checked: boolean, onChange: (checked: boolean) => void, helper?: string }} props
 */
export default function StoreToggleRow({ label, checked, onChange, helper }) {
  return (
    <div>
      <label className="flex items-center gap-3 text-sm text-brand-white">
        <input
          className="h-4 w-4 rounded border-white/20 bg-transparent accent-brand-gold"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>{label}</span>
      </label>
      {helper ? <p className="mt-2 pl-7 text-xs text-white/40">{helper}</p> : null}
    </div>
  );
}
