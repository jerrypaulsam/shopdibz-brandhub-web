import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {string} value
 * @returns {string}
 */
function maskAccountNumber(value) {
  const raw = String(value || "");

  if (raw.length <= 4) {
    return raw;
  }

  return `${"*".repeat(Math.max(raw.length - 4, 0))}${raw.slice(-4)}`;
}

/**
 * @param {{ form: any, savedBank: any, message: string, ifscDetails: string, isSubmitting: boolean, isLookingUpIfsc: boolean, isLoadingBank: boolean, isEditing: boolean, onChange: (key: "accountName" | "accountNumber" | "confirmAccountNumber" | "ifscCode" | "bankName", value: string) => void, onSubmit: () => Promise<void>, onStartEditing?: () => void, onCancelEditing?: () => void, isFirstTime: boolean }} props
 */
export default function BankDetailsFormPanel({
  form,
  savedBank,
  message,
  ifscDetails,
  isSubmitting,
  isLookingUpIfsc,
  isLoadingBank,
  isEditing,
  onChange,
  onSubmit,
  onStartEditing,
  onCancelEditing,
  isFirstTime,
}) {
  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit();
  }

  if (isLoadingBank) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row">
        <section className="min-w-0 flex-1 rounded-sm border border-white/10 bg-[#121212] px-6 py-14 text-center text-sm text-white/45">
          Loading bank details...
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row">
      <div className="min-w-0 flex-1 space-y-6">
        {!isEditing && savedBank ? (
          <StoreSection
            title="Payout Account"
            subtitle="This is the active bank account Shopdibz uses for store settlements."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <MetricCard label="Account Holder" value={savedBank?.name || "---"} />
              <MetricCard
                label="Account Number"
                value={maskAccountNumber(savedBank?.accountNumber)}
              />
              <MetricCard label="Bank Name" value={savedBank?.bankName || "---"} />
              <MetricCard label="IFSC" value={savedBank?.ifsc || "---"} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-sm border border-brand-gold/30 px-5 text-sm font-semibold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
                type="button"
                onClick={onStartEditing}
              >
                Edit bank details
              </button>
            </div>
          </StoreSection>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <StoreSection
              title={isFirstTime ? "My Bank Details" : "Update Bank Details"}
              subtitle="Add the payout account that Shopdibz should use for your store settlements."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <StoreField
                  label="Account Name"
                  value={form.accountName}
                  onChange={(value) => onChange("accountName", value)}
                />
                <StoreField
                  label="IFSC Code"
                  value={form.ifscCode}
                  onChange={(value) => onChange("ifscCode", value)}
                  helper={isLookingUpIfsc ? "Checking bank details..." : ""}
                />
                <StoreField
                  label="Account Number"
                  type="password"
                  value={form.accountNumber}
                  onChange={(value) => onChange("accountNumber", value)}
                />
                <StoreField
                  label="Confirm Account Number"
                  type="password"
                  value={form.confirmAccountNumber}
                  onChange={(value) => onChange("confirmAccountNumber", value)}
                />
                <div className="md:col-span-2">
                  <StoreField
                    label="Bank Name"
                    value={form.bankName}
                    onChange={(value) => onChange("bankName", value)}
                  />
                </div>
              </div>

              {ifscDetails ? (
                <div className="mt-5 rounded-sm border border-white/10 bg-black/20 px-4 py-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
                    IFSC Match
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{ifscDetails}</p>
                </div>
              ) : null}
            </StoreSection>

            <AuthMessage>{message}</AuthMessage>

            <div className="flex flex-wrap gap-3">
              <div className="w-full max-w-xs">
                <AuthButton disabled={isSubmitting}>
                  {isSubmitting
                    ? isFirstTime
                      ? "Submitting..."
                      : "Updating..."
                    : isFirstTime
                      ? "Submit bank details"
                      : "Update bank details"}
                </AuthButton>
              </div>

              {!isFirstTime && savedBank ? (
                <button
                  className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/10 px-5 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white"
                  type="button"
                  onClick={onCancelEditing}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        )}
      </div>

      <aside className="w-full lg:max-w-[360px]">
        <StoreSection title="Settlement Checklist">
          <div className="space-y-4 text-sm leading-6 text-white/65">
            <p>Use the account that should receive seller settlements and refunds.</p>
            <p>Account holder name should match your registered business records.</p>
            <p>Verify IFSC carefully to avoid payout failures or verification delays.</p>
            <p>After editing, your account may be reviewed again for security.</p>
            <p>
              {isFirstTime
                ? "Submitting bank details completes the onboarding handoff to verification."
                : "Your active payout account is shown on the left and can be updated here any time."}
            </p>
          </div>
        </StoreSection>
      </aside>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function MetricCard({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
