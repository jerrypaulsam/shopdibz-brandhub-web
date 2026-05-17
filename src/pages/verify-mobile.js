import DashboardShell from "@/src/components/dashboard/DashboardShell";
import VerifyMobileChangePanel from "@/src/components/profile/VerifyMobileChangePanel";
import { useVerifyMobileChange } from "@/src/hooks/profile/useVerifyMobileChange";

export default function VerifyMobilePage() {
  const {
    mobile,
    setMobile,
    otp,
    setOtp,
    showOtpBox,
    resendSeconds,
    message,
    isSubmitting,
    requestOtp,
    verifyOtp,
    resendOtp,
  } = useVerifyMobileChange();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[900px] px-4 py-8 md:px-6">
        <VerifyMobileChangePanel
          mobile={mobile}
          setMobile={setMobile}
          otp={otp}
          setOtp={setOtp}
          showOtpBox={showOtpBox}
          resendSeconds={resendSeconds}
          message={message}
          isSubmitting={isSubmitting}
          onRequestOtp={requestOtp}
          onVerifyOtp={verifyOtp}
          onResendOtp={resendOtp}
        />
      </div>
    </DashboardShell>
  );
}
