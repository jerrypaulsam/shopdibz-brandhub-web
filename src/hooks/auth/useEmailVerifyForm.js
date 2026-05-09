import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  clearAuthSession,
  getAuthSession,
  logoutSeller,
  requestEmailOtp,
  verifyEmailOtp,
} from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

export function useEmailVerifyForm() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    logScreenView("init-email-verify", "Anonymous", "store");
  }, []);

  function getDisplayEmail() {
    const authSession = getAuthSession();
    return (
      authSession?.user?.email ||
      authSession?.email ||
      authSession?.data?.email ||
      "your registered email address"
    );
  }

  async function verifyOtp() {
    if (!otp) {
      setMessage("Enter OTP");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await verifyEmailOtp({ otp });
      setOtp("");
      setMessage("Email Verified");
      await router.replace("/store-form");
    } catch {
      setOtp("");
      setMessage("Email Cannot Be Verified. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendOtp() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await requestEmailOtp();
      setMessage("OTP send to email");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "OTP cannot be sent");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function logout() {
    try {
      await logoutSeller();
    } finally {
      clearAuthSession();
      await router.replace("/");
    }
  }

  return {
    otp,
    setOtp,
    email: getDisplayEmail(),
    message,
    isSubmitting,
    verifyOtp,
    resendOtp,
    logout,
  };
}
