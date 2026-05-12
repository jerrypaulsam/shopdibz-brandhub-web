import Link from "next/link";
import { useState } from "react";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import StoreSignaturePad from "@/src/components/store/StoreSignaturePad";
import { useStoreCreateForm } from "@/src/hooks/store/useStoreCreateForm";

export default function StoreCreateFormPage() {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const {
    storeRegisteredName,
    setStoreRegisteredName,
    storeRegistrationId,
    setStoreRegistrationId,
    gstin,
    setGstin,
    refCode,
    setRefCode,
    signatureBase64,
    setSignatureBase64,
    message,
    fieldErrors,
    isSubmitting,
    isVerifyingGst,
    gstVerified,
    gstVerificationFailed,
    clearSignal,
    handleVerifyGst,
    submitForm,
    clearSignature,
  } = useStoreCreateForm();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!storeRegisteredName || !storeRegistrationId || !gstin || !signatureBase64) {
      await submitForm();
      return;
    }

    setIsReviewOpen(true);
  }

  return (
    <AuthShell>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row">
        <form className="min-w-0 flex-1 space-y-6" onSubmit={handleSubmit}>
          <StoreSection
            title="Register Your Store With Us!"
            subtitle="Complete your GST-backed onboarding before setting up storefront details."
          >
            <div className="space-y-5">
              <StoreField
                label="GSTIN"
                value={gstin}
                placeholder="GSTIN"
                maxLength={15}
                error={fieldErrors.gstin}
                onChange={setGstin}
              />
              <button
                className="rounded-sm border border-brand-gold/50 px-4 py-2 text-sm font-bold text-brand-gold"
                type="button"
                disabled={isVerifyingGst}
                onClick={handleVerifyGst}
              >
                {isVerifyingGst ? "Verifying..." : "Verify GST"}
              </button>

              <StoreField
                label="Registered Store Name"
                value={storeRegisteredName}
                placeholder="Registered Store Name"
                helper="Name as in GST details"
                disabled={!gstVerificationFailed && gstVerified}
                error={fieldErrors.storeRegisteredName}
                onChange={setStoreRegisteredName}
              />

              <StoreField
                label="PAN Number"
                value={storeRegistrationId}
                placeholder="PAN Number"
                disabled={!gstVerificationFailed && gstVerified}
                error={fieldErrors.storeRegistrationId}
                onChange={setStoreRegistrationId}
              />

              <StoreField
                label="Referred By"
                value={refCode}
                placeholder="Referral Code"
                helper="Enter Referral Code (Optional)"
                onChange={setRefCode}
              />
            </div>
          </StoreSection>

          <StoreSection title="Signature" subtitle="A clear digital signature is required for verification purposes.">
            <StoreSignaturePad
              clearSignal={clearSignal}
              onChange={setSignatureBase64}
            />
            {fieldErrors.signature ? (
              <p className="mt-3 text-sm font-semibold text-red-300">
                {fieldErrors.signature}
              </p>
            ) : null}
            <div className="mt-4 flex justify-center">
              <button
                className="rounded-full border border-white/20 px-6 py-2 text-sm font-bold text-brand-white"
                type="button"
                onClick={clearSignature}
              >
                Clear
              </button>
            </div>
          </StoreSection>

          <AuthMessage>
            {gstVerified ? `GST verified. ${message}` : message}
          </AuthMessage>

          <div className="flex flex-wrap items-center gap-4">
            <div className="w-full max-w-xs">
              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Review & Continue"}
              </AuthButton>
            </div>
            <Link
              className="text-sm font-bold text-brand-gold hover:text-brand-white"
              href="/"
            >
              Logout
            </Link>
          </div>
        </form>

        <aside className="w-full lg:max-w-[360px]">
          <StoreSection title="Submission Checklist">
            <div className="space-y-4 text-sm leading-6 text-white/65">
              <p>Ensure the Store Name matches the name on your official GST documents.</p>
              <p>Have your business GSTIN and PAN details handy for a smooth setup.</p>
              <p>Review the PAN extracted from GST before you proceed.</p>
              <p>Use the signature pad to add a clean signature before submission.</p>
              <p>If you have a referral code, add it before continuing.</p>
            </div>
          </StoreSection>

          <StoreSection title="Live Summary" subtitle="A quick review of what will be sent to the verification flow.">
            <div className="space-y-4 text-sm text-white/70">
              <SummaryRow label="GSTIN" value={gstin || "Not added"} />
              <SummaryRow label="Registered Name" value={storeRegisteredName || "Not added"} />
              <SummaryRow label="PAN" value={storeRegistrationId || "Not added"} />
              <SummaryRow label="Referral" value={refCode || "Optional"} />
              <SummaryRow
                label="GST Status"
                value={gstVerified ? "Verified" : gstVerificationFailed ? "Manual review needed" : "Pending verification"}
              />
            </div>
          </StoreSection>
        </aside>
      </div>

      {isReviewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-sm border border-white/10 bg-[#121212] p-6 shadow-2xl">
            <h2 className="text-xl font-extrabold text-brand-white">Confirm Store Details</h2>
            <p className="mt-2 text-sm text-white/55">
              Please review these details before we create the store and move into bank setup.
            </p>

            <div className="mt-6 space-y-3 rounded-sm border border-white/10 bg-black/20 p-4">
              <SummaryRow label="GSTIN" value={gstin} />
              <SummaryRow label="Registered Name" value={storeRegisteredName} />
              <SummaryRow label="PAN" value={storeRegistrationId} />
              <SummaryRow label="Referral" value={refCode || "Optional"} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="min-w-[180px] flex-1">
                <AuthButton
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () => {
                    setIsReviewOpen(false);
                    await submitForm();
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Confirm & Continue"}
                </AuthButton>
              </div>
              <button
                className="rounded-sm border border-white/15 px-5 py-3 text-sm font-bold text-brand-white"
                type="button"
                onClick={() => setIsReviewOpen(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AuthShell>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
        {label}
      </span>
      <span className="text-right text-sm font-semibold text-brand-white">
        {value}
      </span>
    </div>
  );
}
