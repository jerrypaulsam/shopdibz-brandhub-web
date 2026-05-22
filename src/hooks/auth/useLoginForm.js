import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getBrowserLocation,
  hasAuthenticatedSellerSession,
  loginSeller,
  saveAuthSession,
} from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

export const LOGIN_FIELD_LIMITS = {
  email: 70,
};

export function useLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (hasAuthenticatedSellerSession()) {
      router.replace("/");
      return;
    }

    logScreenView("login_screen", "Anonymous", "store");
  }, [router]);

  async function submitLogin() {
    const trimmedEmail = String(email || "").trim();

    if (!trimmedEmail || !password) {
      setMessage("Required");
      return;
    }

    if (trimmedEmail.length > LOGIN_FIELD_LIMITS.email) {
      setMessage(`Email must be ${LOGIN_FIELD_LIMITS.email} characters or fewer`);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setMessage("Please enter valid email");
      return;
    }

    setIsSubmitting(true);
    setIsTransitioning(false);
    setMessage("");

    try {
      const loc = await getBrowserLocation();
      const result = await loginSeller({
        email: trimmedEmail.toLowerCase(),
        password,
        loc,
      });
      saveAuthSession(result.data);
      setMessage("Login successful. Opening your dashboard...");
      setIsTransitioning(true);
      await router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid Credentials");
      setIsTransitioning(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    message,
    isSubmitting,
    isTransitioning,
    submitLogin,
  };
}
