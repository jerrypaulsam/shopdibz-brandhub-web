import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthField from "@/src/components/auth/AuthField";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import AuthTitle from "@/src/components/auth/AuthTitle";
import { useSignupForm } from "@/src/hooks/auth/useSignupForm";

export default function SignUpPage() {
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

  async function handleSubmit(event) {
    event.preventDefault();
    await submitSignup();
  }

  return (
    <AuthShell>
      <div className="flex flex-1 justify-center overflow-y-auto pb-10">
        <AuthCard widthClass="w-full max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <AuthTitle title="Seller Registration" note="* GST Mandatory" />

            <div className="mt-8 space-y-8">
              <AuthField
                label="Email"
                value={email}
                type="email"
                autoComplete="email"
                onChange={setEmail}
              />
              <AuthField
                label="First Name"
                value={fName}
                maxLength={15}
                autoComplete="given-name"
                onChange={setFName}
              />
              <AuthField
                label="Last Name"
                value={lName}
                maxLength={15}
                autoComplete="family-name"
                onChange={setLName}
              />
              <AuthField
                label="Password"
                value={password}
                type="password"
                autoComplete="new-password"
                onChange={setPassword}
              />
              <AuthField
                label="Confirm Password"
                value={confirmPassword}
                type="password"
                autoComplete="new-password"
                onChange={setConfirmPassword}
              />
            </div>

            <div className="mt-10">
              <AuthMessage>{message}</AuthMessage>
            </div>

            <div className="mt-6">
              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </AuthButton>
            </div>

            <div className="mt-8 text-center text-sm text-white/45">
              <p>By signing up, you agree to accept the</p>
              <a
                className="mt-2 block text-brand-white hover:text-brand-gold"
                href="https://www.shopdibz.com/seller-services-agreement/"
                target="_blank"
                rel="noreferrer"
              >
                Seller Services Agreement,
              </a>
              <a
                className="mt-1 block text-brand-white hover:text-brand-gold"
                href="https://www.shopdibz.com/privacypolicy"
                target="_blank"
                rel="noreferrer"
              >
                Privacy Policy
              </a>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-white/45">Already have an account?</p>
              <Link
                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-brand-gold hover:text-brand-white"
                href="/login"
              >
                Login
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </form>
        </AuthCard>
      </div>
    </AuthShell>
  );
}
