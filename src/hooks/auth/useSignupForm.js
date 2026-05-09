import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getBrowserLocation,
  getMobileVerification,
  requestEmailOtp,
  saveAuthSession,
  signupSeller,
} from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

export function useSignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const mobileVerification = getMobileVerification();

    if (!mobileVerification?.verified) {
      router.replace("/new-mobile-verify");
      return;
    }

    logScreenView("signup_screen", "Anonymous", "store");
  }, [router]);

  /**
   * @returns {string}
   */
  function validate() {
    if (!email || !fName || !password || !confirmPassword) {
      return "Required";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Please enter valid email";
    }

    if (fName.length > 15 || lName.length > 15) {
      return "Max. 15 Characters";
    }

    if (password.length < 8) {
      return "password must be at least 8 digits long";
    }

    if (password.length > 15) {
      return "Maximum of 15 characters";
    }

    if (!/[#?!@$%^&*-]/.test(password)) {
      return "passwords must have at least one special character";
    }

    if (password !== confirmPassword) {
      return "passwords do not match";
    }

    return "";
  }

  async function submitSignup() {
    const validationMessage = validate();

    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const mobileVerification = getMobileVerification();
      const loc = await getBrowserLocation();
      const result = await signupSeller({
        email: email.toLowerCase(),
        fName,
        lName,
        password,
        confirmPassword,
        mobile: mobileVerification?.mobile || "",
        loc,
      });

      saveAuthSession(result.data);
      if (typeof window.fbq === "function") {
        window.fbq("track", "CompleteRegistration");
      }
      await requestEmailOtp();
      await router.replace("/init-email-verify");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "BAD REQUEST. CONTACT SUPPORT!",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    fName,
    setFName,
    lName,
    setLName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    message,
    isSubmitting,
    submitSignup,
  };
}
