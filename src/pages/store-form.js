import Link from "next/link";
import { useState } from "react";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import OnboardingFlowShell from "@/src/components/auth/OnboardingFlowShell";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import StoreSignaturePad from "@/src/components/store/StoreSignaturePad";
import { STORE_CREATE_FIELD_LIMITS, useStoreCreateForm } from "@/src/hooks/store/useStoreCreateForm";

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
    <OnboardingFlowShell
      currentStep={4}
      stepLabel="Store registration"
      title="Create the verified seller store."
      subtitle="Add GST, PAN, referral details, and a signature so we can create the store record and move you into bank setup."
      asideTitle="Submission checklist"
      asideDescription="This is the final setup screen before payouts and review. Keep the details aligned with your GST registration."
      asideItems={[
        "Verify the GSTIN before submitting.",
        "Check the legal business name pulled from GST.",
        "Review the PAN before continuing.",
        "Add a clean signature to complete the form.",
        "Referral code is optional but should be added now if you have one.",
      ]}
      asideFooter={(
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
            Current Summary
          </p>
          <div className="mt-4 space-y-4 text-sm text-white/70">
            <SummaryRow label="GSTIN" value={gstin || "Not added"} />
            <SummaryRow label="Registered Name" value={storeRegisteredName || "Not added"} />
            <SummaryRow label="PAN" value={storeRegistrationId || "Not added"} />
            <SummaryRow label="Referral" value={refCode || "Optional"} />
            <SummaryRow
              label="GST Status"
              value={gstVerified ? "Verified" : gstVerificationFailed ? "Manual review needed" : "Pending verification"}
            />
          </div>
        </div>
      )}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row">
        <form className="min-w-0 flex-1 space-y-6" onSubmit={handleSubmit}>
          <StoreSection
            title="Register Your Store"
            subtitle="Complete your business verification details to create the seller store."
          >
            <div className="space-y-5">
              <StoreField
                label="GSTIN"
                value={gstin}
                placeholder="GSTIN"
                maxLength={STORE_CREATE_FIELD_LIMITS.gstin}
                error={fieldErrors.gstin}
                onChange={setGstin}
              />
              <button
                className="theme-action-accent rounded-sm border px-4 py-2 text-sm font-bold transition-colors"
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
                maxLength={STORE_CREATE_FIELD_LIMITS.storeRegisteredName}
                disabled={gstVerified}
                error={fieldErrors.storeRegisteredName}
                onChange={setStoreRegisteredName}
              />

              <StoreField
                label="PAN Number"
                value={storeRegistrationId}
                placeholder="PAN Number"
                maxLength={STORE_CREATE_FIELD_LIMITS.storeRegistrationId}
                disabled={gstVerified}
                error={fieldErrors.storeRegistrationId}
                onChange={setStoreRegistrationId}
              />

              <StoreField
                label="Referred By"
                value={refCode}
                placeholder="Referral Code"
                helper="Enter Referral Code (Optional)"
                maxLength={STORE_CREATE_FIELD_LIMITS.refCode}
                error={fieldErrors.refCode}
                onChange={setRefCode}
              />
            </div>
          </StoreSection>

          <StoreSection title="Signature" subtitle="Add a clear digital signature to complete your verification.">
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
                className="theme-action-neutral rounded-full border px-6 py-2 text-sm font-bold transition-colors"
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

      </div>

      {isReviewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="theme-surface w-full max-w-lg rounded-[24px] border p-6 shadow-2xl">
            <h2 className="text-xl font-extrabold text-brand-white">Confirm Store Details</h2>
            <p className="theme-text-muted mt-2 text-sm">
              Please review these details before we create the store and move into bank setup.
            </p>

            <div className="theme-surface-soft mt-6 space-y-3 rounded-[18px] border p-4">
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
                className="theme-action-neutral rounded-sm border px-5 py-3 text-sm font-bold transition-colors"
                type="button"
                onClick={() => setIsReviewOpen(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </OnboardingFlowShell>
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
