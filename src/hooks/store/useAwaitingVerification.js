import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearAuthSession, getAuthSession, logoutSeller, updateAuthSession } from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";
import { checkStoreVerification } from "@/src/api/store";

const TUTORIALS_URL =
  "https://youtube.com/playlist?list=PLS7dZBv8UxNQov_iYFXjHcdgHdmaxXko9&si=cMPeGcre-i-IeqCk";

export function useAwaitingVerification() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("polling");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const authSession = getAuthSession();
    const userEmail = authSession?.user?.email || "Anonymous";

    logScreenView("awaiting_verification", userEmail, "store");

    let isCurrent = true;

    async function runCheck() {
      try {
        const response = await checkStoreVerification();

        if (!isCurrent) {
          return;
        }

        if (response?.status === 200 || response?.status === 201) {
          updateAuthSession({
            verified: true,
            storeCreated: true,
          });
          await router.replace("/store-info-form");
          return;
        }

        if (response?.status === 403) {
          setStatus("awaiting");
          setMessage("");
          return;
        }

        if (response?.status === 404) {
          setStatus("needs-bank-details");
          setMessage("Bank details setup is still pending for this account.");
          // TODO: Redirect to the converted bank details flow when available.
          return;
        }

        setStatus("idle");
        setMessage("We could not confirm your verification status right now.");
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setStatus("idle");
        setMessage(
          error instanceof Error
            ? error.message
            : "We could not confirm your verification status right now.",
        );
      }
    }

    runCheck();
    const timerId = window.setInterval(runCheck, 10000);

    return () => {
      isCurrent = false;
      window.clearInterval(timerId);
    };
  }, [router]);

  async function logout() {
    setIsLoggingOut(true);

    try {
      await logoutSeller().catch(() => null);
    } finally {
      clearAuthSession();
      await router.replace("/");
      setIsLoggingOut(false);
    }
  }

  return {
    message,
    status,
    isLoggingOut,
    logout,
    tutorialsUrl: TUTORIALS_URL,
  };
}
