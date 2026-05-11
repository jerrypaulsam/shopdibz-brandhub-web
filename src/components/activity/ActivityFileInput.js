/**
 * @param {{ id: string, label: string, helper: string, fileName: string, accept: string, onChange: (event: import("react").ChangeEvent<HTMLInputElement>) => void }} props
 */
export default function ActivityFileInput({
  id,
  label,
  helper,
  fileName,
  accept,
  onChange,
}) {
  return (
    <label
      className="block cursor-pointer rounded-sm border border-dashed border-white/20 bg-black/20 p-5 transition-colors hover:border-brand-gold/40"
      htmlFor={id}
    >
      <input
        id={id}
        className="sr-only"
        type="file"
        accept={accept}
        onChange={(event) => {
          onChange(event);
          event.target.value = "";
        }}
      />
      <p className="text-sm font-semibold text-brand-white">{label}</p>
      <p className="mt-2 text-sm text-white/45">{helper}</p>
      <div className="mt-4 rounded-sm border border-white/10 bg-[#121212] px-4 py-3">
        <p className="text-sm font-medium text-white/75">
          {fileName || "Click to choose file"}
        </p>
      </div>
    </label>
  );
}
