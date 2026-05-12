import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getBrowserLocation,
  hasAuthenticatedSellerSession,
  loginSeller,
  saveAuthSession,
} from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

export function useLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasAuthenticatedSellerSession()) {
      router.replace("/");
      return;
    }

    logScreenView("login_screen", "Anonymous", "store");
  }, [router]);

  async function submitLogin() {
    if (!email || !password) {
      setMessage("Required");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const loc = await getBrowserLocation();
      const result = await loginSeller({
        email: email.toLowerCase(),
        password,
        loc,
      });
      saveAuthSession(result.data);
      setMessage("Logged In");
      await router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid Credentials");
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
    submitLogin,
  };
}
