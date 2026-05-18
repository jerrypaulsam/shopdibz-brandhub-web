import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthField from "@/src/components/auth/AuthField";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import OnboardingFlowShell from "@/src/components/auth/OnboardingFlowShell";
import { useSellerGuestRedirect } from "@/src/hooks/auth/useSellerGuestRedirect";
import { useMobileVerifyForm } from "@/src/hooks/auth/useMobileVerifyForm";

export default function InitialMobileVerifyPage() {
  const isRedirecting = useSellerGuestRedirect();
  const {
    mobile,
    setMobile,
    otp,
    setOtp,
    mobileOtpSend,
    message,
    isSubmitting,
    resendSeconds,
    requestOtp,
    resendOtp,
    verifyOtp,
  } = useMobileVerifyForm();

  if (isRedirecting) {
    return (
      <AuthShell title="Shopdibz Brand Hub" centeredBrand>
        <div className="flex flex-1 items-center justify-center text-sm font-semibold text-white/60">
          Redirecting to dashboard...
        </div>
      </AuthShell>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (mobileOtpSend) {
      await verifyOtp();
      return;
    }

    await requestOtp();
  }

  return (
    <OnboardingFlowShell
      currentStep={1}
      stepLabel={mobileOtpSend ? "OTP verification" : "Mobile verification"}
      title={mobileOtpSend ? "Confirm your mobile number." : "Start with mobile verification."}
      subtitle={
        mobileOtpSend
          ? "Enter the one-time password we sent to your phone so we can secure the account setup before registration."
          : "Use your active mobile number first. We'll verify it before we move you into account creation and store onboarding."
      }
      asideTitle="What happens next"
      asideDescription="This setup is short and progressive. Each step unlocks the next one so your seller profile stays verified from the start."
      asideItems={[
        "Verify your mobile number with OTP.",
        "Create your account credentials and basic profile.",
        "Confirm your email and continue into store setup.",
        "Add GST, PAN, and signature to create the store.",
      ]}
      asideFooter={(
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
            Already Registered
          </p>
          <p className="theme-text-muted mt-3 text-sm leading-6">
            If you already have a Brand Hub account, sign in and continue from your dashboard.
          </p>
          <Link
            className="theme-action-accent mt-4 inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-bold transition-colors"
            href="/login"
          >
            Login to account
          </Link>
        </div>
      )}
    >
      <AuthCard
        widthClass="w-full max-w-[640px]"
        className="rounded-[24px] border-white/8 bg-transparent p-0 shadow-none"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px]">
            <div className="space-y-6">
              <label className="block">
                <span className="theme-text-muted-strong text-sm font-semibold">
                  Mobile Number
                </span>
                <div className="theme-field mt-3 flex items-center overflow-hidden rounded-[18px] border">
                  <span className="theme-text-muted-strong border-r border-white/10 px-4 py-4 text-sm font-bold">
                    +91
                  </span>
                  <input
                    className="w-full bg-transparent px-4 py-4 text-base text-brand-white outline-none placeholder:text-white/25"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    value={mobile}
                    placeholder="Enter 10 digit number"
                    onChange={(event) => setMobile(event.target.value)}
                  />
                </div>
              </label>

              {mobileOtpSend ? (
                <div className="space-y-4">
                  <AuthField
                    label="OTP"
                    value={otp}
                    type="tel"
                    placeholder="......"
                    maxLength={6}
                    centered
                    onChange={setOtp}
                  />
                  <div className="theme-surface-soft rounded-[18px] border px-4 py-4">
                    <p className="theme-text-muted text-sm">
                      {resendSeconds > 0
                        ? `Resend OTP in ${resendSeconds}s`
                        : "Didn't receive the OTP?"}
                    </p>
                    <button
                      className="mt-2 text-sm font-bold text-brand-gold transition-colors hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      disabled={isSubmitting || resendSeconds > 0}
                      onClick={resendOtp}
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              ) : null}

              <AuthMessage>{message}</AuthMessage>

              <div className="flex flex-wrap gap-3">
                <div className="min-w-[220px] flex-1">
                  <AuthButton disabled={isSubmitting}>
                    {isSubmitting
                      ? "Please wait..."
                      : mobileOtpSend
                        ? "Verify & Continue"
                        : "Request OTP"}
                  </AuthButton>
                </div>
              </div>
            </div>

            <div className="theme-surface-soft rounded-[22px] border p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                Step Focus
              </p>
              <p className="mt-3 text-lg font-extrabold text-brand-white">
                {mobileOtpSend ? "Enter the OTP" : "Get your OTP"}
              </p>
              <p className="theme-text-muted mt-3 text-sm leading-6">
                {mobileOtpSend
                  ? "Use the latest SMS code sent to this number. Once verified, we move directly into account signup."
                  : "We'll send a one-time password to confirm that this number belongs to you."}
              </p>
            </div>
          </div>
        </form>
      </AuthCard>
    </OnboardingFlowShell>
  );
}
