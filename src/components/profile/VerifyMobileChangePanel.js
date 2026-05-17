import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ mobile: string, setMobile: (value: string) => void, otp: string, setOtp: (value: string) => void, showOtpBox: boolean, resendSeconds: number, message: string, isSubmitting: boolean, onRequestOtp: () => Promise<boolean>, onVerifyOtp: () => Promise<boolean>, onResendOtp: () => Promise<boolean> }} props
 */
export default function VerifyMobileChangePanel({
  mobile,
  setMobile,
  otp,
  setOtp,
  showOtpBox,
  resendSeconds,
  message,
  isSubmitting,
  onRequestOtp,
  onVerifyOtp,
  onResendOtp,
}) {
  return (
    <StoreSection title="Change Mobile Number" subtitle="Request an OTP for your new mobile number, then verify it here to update your account.">
      <div className="mx-auto max-w-[620px]">
        <div className="mb-10 text-center text-white/20">
          <div className="text-7xl">+91</div>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-white/80">Enter New Mobile Number</span>
          <div className="theme-field mt-3 flex items-center overflow-hidden rounded-[15px] border">
            <span className="border-r border-white/10 px-4 py-3 text-base font-semibold text-brand-gold">
              +91
            </span>
            <input
              className="w-full bg-transparent px-4 py-3 text-base text-brand-white outline-none placeholder:text-white/25"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              placeholder="10 digit mobile number"
              onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(-10))}
            />
          </div>
        </label>

        {showOtpBox ? (
          <div className="mt-4">
            <StoreField
              label="Enter OTP"
              value={otp}
              type="text"
              maxLength={6}
              onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
            />
            <div className="theme-surface-soft mt-4 rounded-sm border px-4 py-3 text-sm">
              <p className="theme-text-muted">
                {resendSeconds > 0
                  ? `Resend OTP in ${resendSeconds}s`
                  : "Didn't receive the OTP?"}
              </p>
              <button
                className="mt-2 text-sm font-bold text-brand-gold transition-colors hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={isSubmitting || resendSeconds > 0}
                onClick={onResendOtp}
              >
                Resend OTP
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <AuthMessage>{message}</AuthMessage>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="w-full max-w-xs">
            <AuthButton
              type="button"
              disabled={isSubmitting}
              onClick={showOtpBox ? onVerifyOtp : onRequestOtp}
            >
              {isSubmitting ? "Working..." : showOtpBox ? "Verify OTP" : "Send OTP"}
            </AuthButton>
          </div>
          <Link
            className="text-sm font-bold text-brand-gold transition-colors hover:text-brand-white"
            href="/settings/profile"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    </StoreSection>
  );
}
