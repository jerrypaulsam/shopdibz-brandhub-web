import AuthButton from "@/src/components/auth/AuthButton";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthField from "@/src/components/auth/AuthField";
import AuthMessage from "@/src/components/auth/AuthMessage";
import OnboardingFlowShell from "@/src/components/auth/OnboardingFlowShell";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import { useEmailVerifyForm } from "@/src/hooks/auth/useEmailVerifyForm";

export default function InitialEmailVerifyPage() {
  const { confirm } = useConfirm();
  const {
    otp,
    setOtp,
    email,
    message,
    isSubmitting,
    resendSeconds,
    verifyOtp,
    resendOtp,
    logout,
  } = useEmailVerifyForm();

  async function handleSubmit(event) {
    event.preventDefault();
    await verifyOtp();
  }

  async function handleLogout() {
    const accepted = await confirm({
      title: "Logout",
      message: "Are you sure you want to log out of Brand Hub?",
      confirmLabel: "Logout",
      cancelLabel: "Stay Logged In",
    });

    if (!accepted) {
      return;
    }

    await logout();
  }

  return (
    <OnboardingFlowShell
      currentStep={3}
      stepLabel="Email verification"
      title="Verify your email to continue."
      subtitle="We&apos;ve sent a one-time password to your registered email. Confirm it here so we can unlock the final store creation step."
      topAction={(
        <button
          className="theme-action-neutral rounded-sm border px-4 py-2 text-sm font-bold transition-colors"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
      asideTitle="Verification details"
      asideDescription="Email verification helps us secure the account owner before we create the seller store profile."
      asideItems={[
        `OTP sent to ${email}`,
        "Use the latest code from your inbox.",
        "Once verified, you move straight into GST and store registration.",
      ]}
      asideFooter={(
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
            Didn&apos;t receive it?
          </p>
          <p className="theme-text-muted mt-3 text-sm leading-6">
            Check spam or promotions first, then request a fresh OTP.
          </p>
          <button
            className="theme-action-accent mt-4 inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-bold transition-colors"
            type="button"
            disabled={isSubmitting || resendSeconds > 0}
            onClick={resendOtp}
          >
            {resendSeconds > 0 ? `Resend OTP in ${resendSeconds}s` : "Resend OTP"}
          </button>
        </div>
      )}
    >
      <AuthCard
        widthClass="w-full max-w-[520px]"
        className="rounded-[24px] border-white/8 bg-transparent p-0 shadow-none"
      >
        <form onSubmit={handleSubmit}>
          <div className="rounded-[20px] border border-brand-gold/18 bg-brand-gold/6 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
              Registered Email
            </p>
            <p className="mt-2 text-base font-semibold text-brand-white">
              {email}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-[280px]">
            <AuthField
              label="Enter OTP"
              value={otp}
              type="tel"
              maxLength={6}
              centered
              onChange={setOtp}
            />
          </div>

          <div className="mt-8">
            <AuthMessage>{message}</AuthMessage>
          </div>

          <div className="mx-auto mt-6 max-w-[280px]">
            <AuthButton disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify email"}
            </AuthButton>
          </div>
        </form>
      </AuthCard>
    </OnboardingFlowShell>
  );
}
