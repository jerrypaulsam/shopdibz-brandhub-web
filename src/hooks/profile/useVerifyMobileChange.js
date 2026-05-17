import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getProfileSession,
  persistVerifiedMobile,
  requestMobileChangeOtp,
  resendMobileChangeOtp,
  verifyChangedMobileOtp,
} from "@/src/api/profile";
import { logScreenView } from "@/src/api/analytics";

const RESEND_SECONDS = 30;

export function useVerifyMobileChange() {
  const router = useRouter();
  const [mobile, setMobile] = useState(() => {
    const session = getProfileSession();
    const currentMobile =
      session?.user?.mobile ||
      session?.user?.mob ||
      "";

    return String(currentMobile || "").replace(/^\+91/, "").replace(/\D/g, "").slice(-10);
  });
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    const session = getProfileSession();
    logScreenView("verify_mobile_screen", session?.storeUrl || "Anonymous", "store");
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setResendSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [resendSeconds]);

  async function requestOtp() {
    const normalizedMobile = String(mobile || "").replace(/\D/g, "").slice(-10);

    if (normalizedMobile.length !== 10) {
      setMessage("Enter a valid 10 digit mobile number");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await requestMobileChangeOtp(normalizedMobile);
      setMobile(normalizedMobile);
      setShowOtpBox(true);
      setOtp("");
      setResendSeconds(RESEND_SECONDS);
      setMessage("OTP sent to your mobile number.");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Mobile number cannot be updated");
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
      await verifyChangedMobileOtp(otp.trim());
      persistVerifiedMobile(`+91${mobile}`);
      setMessage("Mobile number updated.");
      await router.push("/settings/profile");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid OTP");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendOtp() {
    if (resendSeconds > 0) {
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await resendMobileChangeOtp();
      setResendSeconds(RESEND_SECONDS);
      setMessage("OTP resent successfully.");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to resend OTP right now.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    mobile,
    setMobile,
    otp,
    setOtp,
    showOtpBox,
    message,
    isSubmitting,
    resendSeconds,
    requestOtp,
    verifyOtp,
    resendOtp,
  };
}
