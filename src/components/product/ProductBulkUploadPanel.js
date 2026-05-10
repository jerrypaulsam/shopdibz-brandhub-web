import AuthButton from "@/src/components/auth/AuthButton";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ draft: any, selectionSummary: string, fileName: string, onFileSelected: (event: import("react").ChangeEvent<HTMLInputElement>) => Promise<void>, submitBulkCreate: () => Promise<void>, submitBulkVerify: () => Promise<void>, isSubmitting: boolean, templateLinks: { create: string, sample: string } }} props
 */
export default function ProductBulkUploadPanel({
  draft,
  selectionSummary,
  fileName,
  onFileSelected,
  submitBulkCreate,
  submitBulkVerify,
  isSubmitting,
  templateLinks,
}) {
  return (
    <div className="space-y-6">
      <StoreSection
        title="Bulk Upload Workspace"
        subtitle="Use the route-driven category path and variant mode to choose the right template, verify the sheet, and submit the batch."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-sm border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
              Category Path
            </p>
            <p className="mt-2 text-sm text-brand-white">{selectionSummary}</p>
          </div>
          <div className="rounded-sm border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
              Listing Mode
            </p>
            <p className="mt-2 text-sm text-brand-white">Bulk</p>
          </div>
          <div className="rounded-sm border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
              Variant Mode
            </p>
            <p className="mt-2 text-sm text-brand-white">
              {draft.variantMode === "with-variant" ? "With variant" : "Without variant"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <a
            className="rounded-sm border border-white/10 bg-black/20 p-5 transition-colors hover:border-brand-gold"
            href={templateLinks.create}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-sm font-bold text-brand-white">Download create template</p>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Matches the selected variant branch and category flow.
            </p>
          </a>
          <a
            className="rounded-sm border border-white/10 bg-black/20 p-5 transition-colors hover:border-brand-gold"
            href={templateLinks.sample}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-sm font-bold text-brand-white">Download sample sheet</p>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Useful for checking how the final file should be shaped before upload.
            </p>
          </a>
        </div>

        <label className="mt-6 flex min-h-44 cursor-pointer items-center justify-center rounded-sm border border-dashed border-white/15 bg-black/20 p-6 text-center">
          <span>
            <span className="block text-sm font-bold text-brand-white">
              {fileName || "Upload XLSX, XLSM, or XLS"}
            </span>
            <span className="mt-2 block text-sm text-white/55">
              Bulk listing sheet
            </span>
          </span>
          <input
            className="hidden"
            accept=".xlsx,.xlsm,.xls"
            type="file"
            onChange={onFileSelected}
          />
        </label>
      </StoreSection>

      <div className="grid gap-4 md:max-w-[520px] md:grid-cols-2">
        <AuthButton type="button" disabled={isSubmitting} onClick={submitBulkVerify}>
          {isSubmitting ? "Working..." : "Verify Sheet"}
        </AuthButton>
        <AuthButton type="button" disabled={isSubmitting} onClick={submitBulkCreate}>
          {isSubmitting ? "Working..." : "Submit Bulk Listing"}
        </AuthButton>
      </div>
    </div>
  );
}
