import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthButton from "./AuthButton";
import AuthField from "./AuthField";
import {
  requestForgotPasswordOtp,
  resetForgotPassword,
  verifyForgotPasswordOtp,
} from "@/src/api/auth";

const RESEND_WAIT_SECONDS = 30;

/**
 * @param {{ open: boolean, initialEmail?: string, onClose: () => void }} props
 */
export default function ForgotPasswordDialog({
  open,
  initialEmail = "",
  onClose,
}) {
  const router = useRouter();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState(() =>
    String(initialEmail || "").trim().toLowerCase(),
  );
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [resetSession, setResetSession] = useState({
    accessToken: "",
    refreshToken: "",
  });

  useEffect(() => {
    if (!open || resendSeconds <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setResendSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [open, resendSeconds]);

  if (!open) {
    return null;
  }

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    onClose();
  }

  async function handleRequestOtp(event) {
    event.preventDefault();

    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      setMessage("Email is required.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setMessageType("info");

    try {
      await requestForgotPasswordOtp({
        email: normalizedEmail,
      });
      setEmail(normalizedEmail);
      setStep("verify");
      setOtp("");
      setResendSeconds(RESEND_WAIT_SECONDS);
      setMessage("OTP sent to your email.");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to send OTP right now.",
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();

    if (!otp.trim()) {
      setMessage("OTP is required.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setMessageType("info");

    try {
      const result = await verifyForgotPasswordOtp({
        email,
        otp: otp.trim(),
      });
      const authData =
        result?.data && typeof result.data === "object" && "data" in result.data
          ? result.data.data
          : {};

      setResetSession({
        accessToken:
          authData?.access ||
          authData?.data?.access ||
          "",
        refreshToken:
          authData?.refresh ||
          authData?.data?.refresh ||
          "",
      });
      setStep("reset");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("OTP verified. Set your new password.");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to verify OTP right now.",
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendOtp() {
    if (isSubmitting || resendSeconds > 0) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setMessageType("info");

    try {
      await requestForgotPasswordOtp({
        email,
      });
      setOtp("");
      setResendSeconds(RESEND_WAIT_SECONDS);
      setMessage("A fresh OTP has been sent to your email.");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to resend OTP right now.",
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage("Both password fields are required.");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    if (!resetSession.accessToken || !resetSession.refreshToken) {
      setMessage("Reset session expired. Please request a new OTP.");
      setMessageType("error");
      setStep("request");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setMessageType("info");

    try {
      await resetForgotPassword({
        accessToken: resetSession.accessToken,
        refreshToken: resetSession.refreshToken,
        newPassword,
        confirmPassword,
      });
      setMessage("Password reset successful. Please log in.");
      setMessageType("success");
      onClose();
      await router.replace("/login");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to reset password right now.",
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="theme-overlay fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center">
      <button
        className="absolute inset-0"
        type="button"
        aria-label="Close forgot password dialog"
        onClick={handleClose}
      />
      <section className="theme-surface relative z-10 w-full max-w-[540px] rounded-[18px] border p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
              Account Recovery
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-brand-white">
              {step === "request"
                ? "Forgot your password?"
                : step === "verify"
                  ? "Verify your OTP"
                  : "Set a new password"}
            </h2>
            <p className="theme-text-muted mt-3 text-sm leading-6">
              {step === "request"
                ? "Enter your seller email and we will send you a one-time password."
                : step === "verify"
                  ? "Check your inbox, enter the OTP, and continue to reset your password."
                  : "Create a new password for your Brand Hub account."}
            </p>
          </div>
          <button
            className="theme-action-neutral rounded-sm border px-3 py-1.5 text-sm font-bold transition-colors"
            type="button"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <StepChip active={step === "request"} label="Email" />
          <StepChip active={step === "verify"} label="OTP" />
          <StepChip active={step === "reset"} label="Reset" />
        </div>

        {message ? (
          <div
            className={`theme-toast mt-6 rounded-sm border px-4 py-3 text-sm ${
              messageType === "error"
                ? "theme-toast-error"
                : messageType === "success"
                  ? "theme-toast-success"
                  : "theme-toast-info"
            }`}
          >
            {message}
          </div>
        ) : null}

        {step === "request" ? (
          <form className="mt-6 space-y-6" onSubmit={handleRequestOtp}>
            <AuthField
              label="Email"
              value={email}
              type="email"
              autoComplete="email"
              onChange={setEmail}
            />
            <div className="space-y-3">
              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </AuthButton>
              <button
                className="theme-action-neutral inline-flex min-h-11 w-full items-center justify-center rounded-sm border px-5 py-3 text-sm font-bold transition-colors"
                type="button"
                disabled={isSubmitting}
                onClick={handleClose}
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : null}

        {step === "verify" ? (
          <form className="mt-6 space-y-6" onSubmit={handleVerifyOtp}>
            <AuthField
              label="Email"
              value={email}
              type="email"
              autoComplete="email"
              onChange={setEmail}
            />
            <AuthField
              label="OTP"
              value={otp}
              type="text"
              autoComplete="one-time-code"
              maxLength={5}
              centered
              onChange={(value) => setOtp(value.replace(/\D/g, "").slice(0, 5))}
            />
            <div className="theme-surface-soft rounded-sm border px-4 py-3">
              <p className="theme-text-muted text-sm">
                {resendSeconds > 0
                  ? `Resend OTP in ${resendSeconds}s`
                  : "Didn't receive the OTP?"}
              </p>
              <button
                className="mt-2 text-sm font-bold text-brand-gold transition-colors hover:text-brand-white disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={isSubmitting || resendSeconds > 0}
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            </div>
            <div className="space-y-3">
              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify OTP"}
              </AuthButton>
              <button
                className="theme-action-neutral inline-flex min-h-11 w-full items-center justify-center rounded-sm border px-5 py-3 text-sm font-bold transition-colors"
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setStep("request");
                  setOtp("");
                  setMessage("");
                }}
              >
                Change Email
              </button>
            </div>
          </form>
        ) : null}

        {step === "reset" ? (
          <form className="mt-6 space-y-6" onSubmit={handleResetPassword}>
            <AuthField
              label="New Password"
              value={newPassword}
              type="password"
              autoComplete="new-password"
              onChange={setNewPassword}
            />
            <AuthField
              label="Confirm Password"
              value={confirmPassword}
              type="password"
              autoComplete="new-password"
              onChange={setConfirmPassword}
            />
            <div className="space-y-3">
              <AuthButton disabled={isSubmitting}>
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </AuthButton>
              <button
                className="theme-action-neutral inline-flex min-h-11 w-full items-center justify-center rounded-sm border px-5 py-3 text-sm font-bold transition-colors"
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setStep("verify");
                  setNewPassword("");
                  setConfirmPassword("");
                  setMessage("");
                }}
              >
                Back to OTP
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}

function StepChip({ active, label }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${
        active
          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
          : "border-white/10 text-white/45"
      }`}
    >
      {label}
    </span>
  );
}
