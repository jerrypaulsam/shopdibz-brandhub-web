import { BULK_UPDATE_MODES } from "@/src/utils/activity";
import ActivityFileInput from "./ActivityFileInput";

/**
 * @param {{ activeMode: { slug: string }, fileName: string, isActionLoading: boolean, onModeChange: (value: string) => void, onFileChange: (event: import("react").ChangeEvent<HTMLInputElement>) => void, onSubmit: () => void }} props
 */
export default function BulkUpdatePanel({
  activeMode,
  fileName,
  isActionLoading,
  onModeChange,
  onFileChange,
  onSubmit,
}) {
  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
        Bulk Update
      </p>
      <h3 className="mt-3 text-xl font-extrabold text-brand-white">
        Update catalog data from one sheet
      </h3>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {BULK_UPDATE_MODES.map((mode) => (
          <button
            className={`rounded-sm border px-4 py-4 text-left transition-colors ${
              activeMode.slug === mode.slug
                ? "border-brand-gold/60 bg-brand-gold/10"
                : "border-white/10 bg-black/20 hover:border-white/20"
            }`}
            key={mode.slug}
            type="button"
            onClick={() => onModeChange(mode.slug)}
          >
            <p className="text-sm font-semibold text-brand-white">{mode.label}</p>
            <p className="mt-2 text-sm text-white/50">{mode.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <ActivityFileInput
          accept=".xls,.xlsx,.xlsm"
          fileName={fileName}
          helper="Supported: XLS, XLSX, XLSM. Flutter used the same bulk-sheet flow."
          id="bulk-update-file"
          label="Bulk sheet"
          onChange={onFileChange}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="min-h-11 rounded-sm bg-brand-red px-5 text-sm font-semibold text-brand-white transition-colors hover:bg-[#ff6969] disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isActionLoading}
          onClick={onSubmit}
        >
          {isActionLoading ? "Uploading..." : "Upload sheet"}
        </button>
      </div>
    </section>
  );
}
