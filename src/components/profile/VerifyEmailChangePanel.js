import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ email: string, setEmail: (value: string) => void, otp: string, setOtp: (value: string) => void, showOtpBox: boolean, message: string, isSubmitting: boolean, onRequestOtp: () => Promise<boolean>, onVerifyOtp: () => Promise<boolean> }} props
 */
export default function VerifyEmailChangePanel({
  email,
  setEmail,
  otp,
  setOtp,
  showOtpBox,
  message,
  isSubmitting,
  onRequestOtp,
  onVerifyOtp,
}) {
  return (
    <StoreSection title="Change Email" subtitle="Request an OTP for your new email address, then confirm it here.">
      <div className="mx-auto max-w-[620px]">
        <div className="mb-10 text-center text-white/20">
          <div className="text-7xl">@</div>
        </div>

        <StoreField
          label="Enter New Email"
          value={email}
          type="email"
          onChange={setEmail}
        />

        {showOtpBox ? (
          <div className="mt-4">
            <StoreField
              label="Enter OTP"
              value={otp}
              type="text"
              onChange={setOtp}
            />
          </div>
        ) : null}

        <div className="mt-6">
          <AuthMessage>{message}</AuthMessage>
        </div>

        <div className="mt-6 max-w-xs">
          <AuthButton
            type="button"
            disabled={isSubmitting}
            onClick={showOtpBox ? onVerifyOtp : onRequestOtp}
          >
            {isSubmitting ? "Working..." : showOtpBox ? "Verify" : "Next"}
          </AuthButton>
        </div>
      </div>
    </StoreSection>
  );
}
