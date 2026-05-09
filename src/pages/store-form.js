import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import StoreSignaturePad from "@/src/components/store/StoreSignaturePad";
import { useStoreCreateForm } from "@/src/hooks/store/useStoreCreateForm";

export default function StoreCreateFormPage() {
  const {
    storeRegisteredName,
    setStoreRegisteredName,
    storeRegistrationId,
    setStoreRegistrationId,
    gstin,
    setGstin,
    refCode,
    setRefCode,
    setSignatureBase64,
    message,
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
    await submitForm();
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
                onChange={setStoreRegisteredName}
              />

              <StoreField
                label="PAN Number"
                value={storeRegistrationId}
                placeholder="PAN Number"
                disabled={!gstVerificationFailed && gstVerified}
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
                {isSubmitting ? "Submitting..." : "Continue"}
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
          <StoreSection title="Quick Reminders">
            <div className="space-y-4 text-sm leading-6 text-white/65">
              <p>Ensure the Store Name matches the name on your official GST documents.</p>
              <p>Have your business GSTIN and PAN details handy for a smooth setup.</p>
              <p>Double-check all information for accuracy before submitting.</p>
              <p>If you have a referral code, add it before continuing.</p>
            </div>
          </StoreSection>
        </aside>
      </div>
    </AuthShell>
  );
}
