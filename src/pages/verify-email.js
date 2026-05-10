import DashboardShell from "@/src/components/dashboard/DashboardShell";
import VerifyEmailChangePanel from "@/src/components/profile/VerifyEmailChangePanel";
import { useVerifyEmailChange } from "@/src/hooks/profile/useVerifyEmailChange";

export default function VerifyEmailPage() {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    showOtpBox,
    message,
    isSubmitting,
    requestOtp,
    verifyOtp,
  } = useVerifyEmailChange();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[900px] px-4 py-8 md:px-6">
        <VerifyEmailChangePanel
          email={email}
          setEmail={setEmail}
          otp={otp}
          setOtp={setOtp}
          showOtpBox={showOtpBox}
          message={message}
          isSubmitting={isSubmitting}
          onRequestOtp={requestOtp}
          onVerifyOtp={verifyOtp}
        />
      </div>
    </DashboardShell>
  );
}
