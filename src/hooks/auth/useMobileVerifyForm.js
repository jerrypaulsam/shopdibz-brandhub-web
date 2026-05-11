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

export function useMobileVerifyForm() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [mobileOtpSend, setMobileOtpSend] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasAuthenticatedSellerSession()) {
      router.replace("/");
      return;
    }

    clearAuthSession();
    logScreenView("init-mobile-verify", "Anonymous", "store");
  }, [router]);

  async function requestOtp() {
    if (!mobile) {
      setMessage("Enter Mobile Number");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await requestInitialMobileOtp({ mobile });
      setMobileOtpSend(true);
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
      await verifyInitialMobileNumber({ mobile, otp });
      saveMobileVerification(mobile);
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

  return {
    mobile,
    setMobile,
    otp,
    setOtp,
    mobileOtpSend,
    message,
    isSubmitting,
    requestOtp,
    verifyOtp,
  };
}
