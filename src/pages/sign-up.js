import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthField from "@/src/components/auth/AuthField";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import OnboardingFlowShell from "@/src/components/auth/OnboardingFlowShell";
import { useSellerGuestRedirect } from "@/src/hooks/auth/useSellerGuestRedirect";
import { SIGNUP_FIELD_LIMITS, useSignupForm } from "@/src/hooks/auth/useSignupForm";

export default function SignUpPage() {
  const isRedirecting = useSellerGuestRedirect();
  const {
    email,
    setEmail,
    fName,
    setFName,
    lName,
    setLName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    message,
    isSubmitting,
    submitSignup,
  } = useSignupForm();

  if (isRedirecting) {
    return (
      <AuthShell>
        <div className="flex flex-1 items-center justify-center text-sm font-semibold text-white/60">
          Redirecting to dashboard...
        </div>
      </AuthShell>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await submitSignup();
  }

  return (
    <OnboardingFlowShell
      currentStep={2}
      stepLabel="Account registration"
      title="Create your Brand Hub account."
      subtitle="Add the core account details we need for login, communication, and moving you into the verified seller setup flow."
      asideTitle="Before you continue"
      asideDescription="This account becomes the owner profile for your store setup, so use the primary business email and a password you can retain securely."
      asideItems={[
        "Use your active business email address.",
        "Keep your name details consistent with business records.",
        "Create a strong password with at least one special character.",
        "GST becomes mandatory in the store setup step right after email verification.",
      ]}
      asideFooter={(
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
            Terms
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <a
              className="theme-text-muted block transition-colors hover:text-brand-gold"
              href="https://www.shopdibz.com/seller-services-agreement/"
              target="_blank"
              rel="noreferrer"
            >
              Seller Services Agreement
            </a>
            <a
              className="theme-text-muted block transition-colors hover:text-brand-gold"
              href="https://www.shopdibz.com/privacypolicy"
              target="_blank"
              rel="noreferrer"
            >
              Privacy Policy
            </a>
            <Link
              className="theme-action-accent mt-4 inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-bold transition-colors"
              href="/login"
            >
              Already have an account
            </Link>
          </div>
        </div>
      )}
    >
      <AuthCard
        widthClass="w-full max-w-[720px]"
        className="rounded-[24px] border-white/8 bg-transparent p-0 shadow-none"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <AuthField
              label="Email"
              value={email}
              type="email"
              autoComplete="email"
              maxLength={SIGNUP_FIELD_LIMITS.email}
              onChange={setEmail}
            />
            <AuthField
              label="First Name"
              value={fName}
              maxLength={SIGNUP_FIELD_LIMITS.firstName}
              autoComplete="given-name"
              onChange={setFName}
            />
            <AuthField
              label="Last Name"
              value={lName}
              maxLength={SIGNUP_FIELD_LIMITS.lastName}
              autoComplete="family-name"
              onChange={setLName}
            />
            <AuthField
              label="Password"
              value={password}
              type="password"
              autoComplete="new-password"
              maxLength={SIGNUP_FIELD_LIMITS.password}
              onChange={setPassword}
            />
            <AuthField
              label="Confirm Password"
              value={confirmPassword}
              type="password"
              autoComplete="new-password"
              maxLength={SIGNUP_FIELD_LIMITS.password}
              onChange={setConfirmPassword}
            />
          </div>

          <div className="mt-8 rounded-[20px] border border-brand-gold/18 bg-brand-gold/6 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
              Required next
            </p>
            <p className="theme-text-muted mt-2 text-sm leading-6">
              After signup, we&apos;ll send an email OTP and then move you into GST-based store creation.
            </p>
          </div>

          <div className="mt-8">
            <AuthMessage>{message}</AuthMessage>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="min-w-[220px] flex-1">
              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
              </AuthButton>
            </div>
          </div>
        </form>
      </AuthCard>
    </OnboardingFlowShell>
  );
}
