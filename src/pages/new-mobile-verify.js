import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthField from "@/src/components/auth/AuthField";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import AuthTitle from "@/src/components/auth/AuthTitle";
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
    requestOtp,
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
    <AuthShell title="Shopdibz Brand Hub" centeredBrand>
      <AuthCard widthClass="w-full max-w-[500px]" className="rounded">
        <form onSubmit={handleSubmit}>
          <AuthTitle
            title={mobileOtpSend ? "Verify OTP" : "Verification"}
            subtitle={
              mobileOtpSend
                ? "Please enter the code sent to your mobile"
                : "Enter your mobile number to begin verification"
            }
          />

          <div className="mt-8 space-y-6">
            <AuthField
              label="Mobile Number"
              value={mobile}
              type="tel"
              placeholder="+91 [Enter 10 digit number]"
              autoComplete="tel"
              maxLength={10}
              onChange={setMobile}
            />

            {mobileOtpSend ? (
              <AuthField
                label="OTP"
                value={otp}
                type="tel"
                placeholder="......"
                maxLength={6}
                centered
                onChange={setOtp}
              />
            ) : null}
          </div>

          <div className="mt-10">
            <AuthMessage>{message}</AuthMessage>
          </div>

          <div className="mt-6">
            <AuthButton disabled={isSubmitting}>
              {isSubmitting
                ? "Please wait..."
                : mobileOtpSend
                  ? "Verify & Proceed"
                  : "Request OTP"}
            </AuthButton>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/45">Already have an account?</p>
            <Link
              className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-brand-gold hover:text-brand-white"
              href="/login"
            >
              Login to Account
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
