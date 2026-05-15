import AuthButton from "@/src/components/auth/AuthButton";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ fileName: string, isSubmitting: boolean, templateLinks: { create: string, sample: string }, onFileSelected: (event: import("react").ChangeEvent<HTMLInputElement>) => Promise<void>, submitBulkVerify: () => Promise<void> }} props
 */
export default function ProductBulkVerificationPanel({
  fileName,
  isSubmitting,
  templateLinks,
  onFileSelected,
  submitBulkVerify,
}) {
  return (
    <div className="space-y-6">
      <StoreSection
        title="Verify Listing Sheet"
        subtitle="Upload your listing file, run a verification check, and receive the validation report by email before final bulk listing."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <a
            className="rounded-sm border border-white/10 bg-black/20 p-5 transition-colors hover:border-brand-gold"
            href={templateLinks.create}
            target="_blank"
            rel="noreferrer"
          >
            <p className="text-sm font-bold text-brand-white">Download listing template</p>
            <p className="mt-2 text-sm leading-6 text-white/55">
              Use the standard bulk listing template before uploading your verification sheet.
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
              Compare your file with a sample structure before you run the verification.
            </p>
          </a>
        </div>

        <label className="mt-6 flex min-h-44 cursor-pointer items-center justify-center rounded-sm border border-dashed border-white/15 bg-black/20 p-6 text-center transition-colors hover:border-brand-gold">
          <span>
            <span className="block text-sm font-bold text-brand-white">
              {fileName || "Upload XLSX, XLSM, or XLS"}
            </span>
            <span className="mt-2 block text-sm text-white/55">
              Listing verification sheet
            </span>
          </span>
          <input
            className="hidden"
            accept=".xlsx,.xlsm,.xls"
            type="file"
            onChange={(event) => {
              onFileSelected(event);
              event.target.value = "";
            }}
          />
        </label>
      </StoreSection>

      <div className="max-w-sm">
        <AuthButton type="button" disabled={isSubmitting} onClick={submitBulkVerify}>
          {isSubmitting ? "Working..." : "Verify Listing Sheet"}
        </AuthButton>
      </div>
    </div>
  );
}
