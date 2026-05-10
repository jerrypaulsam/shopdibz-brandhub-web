import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProfileSession, persistVerifiedEmail, requestEmailChange, verifyChangedEmailOtp } from "@/src/api/profile";
import { logScreenView } from "@/src/api/analytics";

export function useVerifyEmailChange() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = getProfileSession();
    logScreenView("verify_email_screen", session?.storeUrl || "Anonymous", "store");
  }, []);

  async function requestOtp() {
    if (!email.trim()) {
      setMessage("Enter Email");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await requestEmailChange(email.trim());
      setShowOtpBox(true);
      setMessage("OTP Send. Please Check Email.");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Email cannot be updated");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp() {
    if (!otp.trim()) {
      setMessage("Enter OTP");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await verifyChangedEmailOtp(otp.trim());
      persistVerifiedEmail(email.trim());
      setMessage("Email Updated.");
      await router.push("/settings/profile");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid OTP");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    otp,
    setOtp,
    showOtpBox,
    message,
    isSubmitting,
    requestOtp,
    verifyOtp,
  };
}
