import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthField from "@/src/components/auth/AuthField";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import AuthTitle from "@/src/components/auth/AuthTitle";
import { useSellerGuestRedirect } from "@/src/hooks/auth/useSellerGuestRedirect";
import { useLoginForm } from "@/src/hooks/auth/useLoginForm";

export default function LoginPage() {
  const isRedirecting = useSellerGuestRedirect();
  const {
    email,
    setEmail,
    password,
    setPassword,
    message,
    isSubmitting,
    submitLogin,
  } = useLoginForm();

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
                onChange={setEmail}
              />
              <AuthField
                label="Password"
                value={password}
                type="password"
                autoComplete="current-password"
                onChange={setPassword}
              />
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
    </AuthShell>
  );
}
