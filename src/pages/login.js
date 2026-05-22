import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthField from "@/src/components/auth/AuthField";
import ForgotPasswordDialog from "@/src/components/auth/ForgotPasswordDialog";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import AuthTitle from "@/src/components/auth/AuthTitle";
import { useSellerGuestRedirect } from "@/src/hooks/auth/useSellerGuestRedirect";
import { LOGIN_FIELD_LIMITS, useLoginForm } from "@/src/hooks/auth/useLoginForm";
import { useState } from "react";
import BrandHubLogo from "@/src/components/app/BrandHubLogo";

export default function LoginPage() {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const isRedirecting = useSellerGuestRedirect();
  const {
    email,
    setEmail,
    password,
    setPassword,
    message,
    isSubmitting,
    isTransitioning,
    submitLogin,
  } = useLoginForm();

  if (isRedirecting || isTransitioning) {
    return (
      <AuthShell>
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full">
              <BrandHubLogo alt="Shopdibz Brand Hub" width={80} height={80} priority />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-brand-white">
              Signing you in
            </p>
            <p className="mt-2 text-sm font-semibold text-white/60">
              Opening your dashboard...
            </p>
          </div>
        </div>
      </AuthShell>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await submitLogin();
  }

  return (
    <AuthShell>
      <div className="flex flex-1 items-center justify-center">
        <AuthCard>
          <form onSubmit={handleSubmit}>
            <AuthTitle title="LOGIN" />

            <div className="mt-8 space-y-8">
              <AuthField
                label="Email"
                value={email}
                type="email"
                autoComplete="email"
                maxLength={LOGIN_FIELD_LIMITS.email}
                disabled={isSubmitting}
                onChange={setEmail}
              />
              <AuthField
                label="Password"
                value={password}
                type="password"
                autoComplete="current-password"
                disabled={isSubmitting}
                onChange={setPassword}
              />
            </div>

            <div className="mt-4 text-right">
              <button
                className="text-sm font-bold text-brand-gold transition-colors hover:text-brand-white"
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
              >
                Forgot Password?
              </button>
            </div>

            <div className="mt-12">
              <AuthMessage>{message}</AuthMessage>
            </div>

            <div className="mt-6">
              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </AuthButton>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-white/45">Don&apos;t have an account?</p>
              <Link
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:text-brand-gold"
                href="/new-mobile-verify"
              >
                Sign Up
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </form>
        </AuthCard>
      </div>
      {forgotPasswordOpen ? (
        <ForgotPasswordDialog
          open={forgotPasswordOpen}
          initialEmail={email}
          onClose={() => setForgotPasswordOpen(false)}
        />
      ) : null}
    </AuthShell>
  );
}
