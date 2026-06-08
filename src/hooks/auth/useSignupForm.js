import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getBrowserLocation,
  hasAuthenticatedSellerSession,
  getMobileVerification,
  saveAuthSession,
  signupSeller,
} from "@/src/api/auth";
import { logScreenView, trackSignupComplete } from "@/src/api/analytics";

export const SIGNUP_FIELD_LIMITS = {
  email: 70,
  firstName: 15,
  lastName: 15,
  password: 15,
};

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
    if (hasAuthenticatedSellerSession()) {
      router.replace("/");
      return;
    }

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
    const trimmedEmail = String(email || "").trim();
    const trimmedFirstName = String(fName || "").trim();
    const trimmedLastName = String(lName || "").trim();

    if (!trimmedEmail || !trimmedFirstName || !password || !confirmPassword) {
      return "Required";
    }

    if (trimmedEmail.length > SIGNUP_FIELD_LIMITS.email) {
      return `Email must be ${SIGNUP_FIELD_LIMITS.email} characters or fewer`;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      return "Please enter valid email";
    }

    if (trimmedFirstName.length > SIGNUP_FIELD_LIMITS.firstName || trimmedLastName.length > SIGNUP_FIELD_LIMITS.lastName) {
      return "Max. 15 Characters";
    }

    if (password.length < 8) {
      return "password must be at least 8 digits long";
    }

    if (password.length > SIGNUP_FIELD_LIMITS.password) {
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
    const trimmedEmail = String(email || "").trim();

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
        email: trimmedEmail.toLowerCase(),
        fName,
        lName,
        password,
        confirmPassword,
        mobile: mobileVerification?.mobile || "",
        loc,
      });

      saveAuthSession(result.data);
      trackSignupComplete();
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
