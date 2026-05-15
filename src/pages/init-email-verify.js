import AuthButton from "@/src/components/auth/AuthButton";
import AuthCard from "@/src/components/auth/AuthCard";
import AuthField from "@/src/components/auth/AuthField";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AuthShell from "@/src/components/auth/AuthShell";
import AuthTitle from "@/src/components/auth/AuthTitle";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import { useEmailVerifyForm } from "@/src/hooks/auth/useEmailVerifyForm";

export default function InitialEmailVerifyPage() {
  const { confirm } = useConfirm();
  const {
    otp,
    setOtp,
    email,
    message,
    isSubmitting,
    verifyOtp,
    resendOtp,
    logout,
  } = useEmailVerifyForm();

  async function handleSubmit(event) {
    event.preventDefault();
    await verifyOtp();
  }

  async function handleLogout() {
    const accepted = await confirm({
      title: "Logout",
      message: "Are you sure you want to log out of Brand Hub?",
      confirmLabel: "Logout",
      cancelLabel: "Stay Logged In",
    });

    if (!accepted) {
      return;
    }

    await logout();
  }

  return (
    <AuthShell title="Verify Email">
      <div className="absolute right-5 top-5">
        <button
          className="rounded-sm border border-white/30 px-4 py-2 text-sm font-bold text-brand-white hover:border-brand-gold hover:text-brand-gold"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <AuthCard>
          <form onSubmit={handleSubmit}>
            <AuthTitle title="Verify Email" />
            <p className="mt-8 text-center text-base text-white/75">
              We have sent an OTP to {email}
            </p>

            <div className="mx-auto mt-8 max-w-[250px]">
              <AuthField
                label="Enter OTP"
                value={otp}
                type="tel"
                maxLength={6}
                centered
                onChange={setOtp}
              />
            </div>

            <div className="mt-8">
              <AuthMessage>{message}</AuthMessage>
            </div>

            <div className="mx-auto mt-6 max-w-[250px]">
              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify"}
              </AuthButton>
            </div>

            <button
              className="mx-auto mt-6 block text-base font-bold text-brand-gold hover:text-brand-white"
              type="button"
              disabled={isSubmitting}
              onClick={resendOtp}
            >
              Resend
            </button>
          </form>
        </AuthCard>
      </div>
    </AuthShell>
  );
}
