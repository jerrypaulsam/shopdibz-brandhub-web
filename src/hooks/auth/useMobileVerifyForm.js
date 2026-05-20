import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  clearAuthSession,
  hasAuthenticatedSellerSession,
  requestInitialMobileOtp,
  saveMobileVerification,
  verifyInitialMobileNumber,
} from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";
import { useOtpCooldown } from "./useOtpCooldown";

export function useMobileVerifyForm() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [mobileOtpSend, setMobileOtpSend] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resendSeconds, startCooldown } = useOtpCooldown(30);

  useEffect(() => {
    if (hasAuthenticatedSellerSession()) {
      router.replace("/");
      return;
    }

    clearAuthSession({ clearServerCookies: false });
    logScreenView("init-mobile-verify", "Anonymous", "store");
  }, [router]);

  function updateMobile(value) {
    setMobile(normalizeMobileInput(value));
  }

  async function requestOtp() {
    if (!mobile) {
      setMessage("Enter Mobile Number");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const normalizedMobile = getIndianMobileNumber(mobile);
      await requestInitialMobileOtp({ mobile: normalizedMobile });
      setMobileOtpSend(true);
      setOtp("");
      startCooldown();
      setMessage("OTP Send To Your Mobile Number.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Oops something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp() {
    if (!otp) {
      setMessage("Enter OTP");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const normalizedMobile = getIndianMobileNumber(mobile);
      await verifyInitialMobileNumber({ mobile: normalizedMobile, otp });
      saveMobileVerification(normalizedMobile);
      setMessage("Mobile number verified");
      await router.replace("/sign-up");
    } catch (error) {
      setOtp("");
      setMessage(
        error instanceof Error
          ? error.message
          : "Mobile Verification Failed. Check OTP or try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendOtp() {
    if (resendSeconds > 0 || !mobileOtpSend) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const normalizedMobile = getIndianMobileNumber(mobile);
      await requestInitialMobileOtp({ mobile: normalizedMobile });
      setOtp("");
      startCooldown();
      setMessage("OTP resent to your mobile number.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Oops something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    mobile,
    setMobile: updateMobile,
    otp,
    setOtp,
    mobileOtpSend,
    message,
    isSubmitting,
    resendSeconds,
    requestOtp,
    resendOtp,
    verifyOtp,
  };
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeMobileInput(value) {
  const digitsOnly = String(value || "").replace(/\D/g, "");

  if (digitsOnly.startsWith("91")) {
    return digitsOnly.slice(2, 12);
  }

  return digitsOnly.slice(0, 10);
}

/**
 * @param {string} value
 * @returns {string}
 */
function getIndianMobileNumber(value) {
  return `+91${normalizeMobileInput(value)}`;
}
