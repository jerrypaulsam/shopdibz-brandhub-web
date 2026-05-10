import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ form: any, message: string, ifscDetails: string, isSubmitting: boolean, isLookingUpIfsc: boolean, onChange: (key: "accountName" | "accountNumber" | "confirmAccountNumber" | "ifscCode" | "bankName", value: string) => void, onSubmit: () => Promise<void>, isFirstTime: boolean }} props
 */
export default function BankDetailsFormPanel({
  form,
  message,
  ifscDetails,
  isSubmitting,
  isLookingUpIfsc,
  onChange,
  onSubmit,
  isFirstTime,
}) {
  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row">
      <form className="min-w-0 flex-1 space-y-6" onSubmit={handleSubmit}>
        <StoreSection
          title="My Bank Details"
          subtitle="Add the payout account that Shopdibz should use for your store settlements."
        >
          <div className="space-y-5">
            <StoreField
              label="Account Name"
              value={form.accountName}
              onChange={(value) => onChange("accountName", value)}
            />
            <StoreField
              label="Account Number"
              type="password"
              value={form.accountNumber}
              onChange={(value) => onChange("accountNumber", value)}
            />
            <StoreField
              label="Confirm Account Number"
              value={form.confirmAccountNumber}
              onChange={(value) => onChange("confirmAccountNumber", value)}
            />
            <StoreField
              label="IFSC Code"
              value={form.ifscCode}
              onChange={(value) => onChange("ifscCode", value)}
              helper={isLookingUpIfsc ? "Checking bank details..." : ""}
            />
            <StoreField
              label="Bank Name"
              value={form.bankName}
              onChange={(value) => onChange("bankName", value)}
            />
            {ifscDetails ? (
              <p className="text-sm text-white/55">{ifscDetails}</p>
            ) : null}
          </div>
        </StoreSection>

        <AuthMessage>{message}</AuthMessage>

        <div className="max-w-xs">
          <AuthButton disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </AuthButton>
        </div>
      </form>

      <aside className="w-full lg:max-w-[360px]">
        <StoreSection title="Quick Reminders">
          <div className="space-y-4 text-sm leading-6 text-white/65">
            <p>Ensure the Account Holder Name matches your official business documents exactly.</p>
            <p>Double-check the Account Number and IFSC code to prevent transaction failures.</p>
            <p>Keep your banking information up to date to ensure timely payouts.</p>
            <p>For security, we may require verification after you update your details.</p>
            <p>
              {isFirstTime
                ? "Once submitted, your onboarding will continue to the store verification step."
                : "All payouts will be processed to the active account listed here."}
            </p>
          </div>
        </StoreSection>
      </aside>
    </div>
  );
}
