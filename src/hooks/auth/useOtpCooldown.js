import { useEffect, useState } from "react";

/**
 * @param {number} durationSeconds
 * @returns {{ resendSeconds: number, startCooldown: () => void }}
 */
export function useOtpCooldown(durationSeconds = 30) {
  const [resendSeconds, setResendSeconds] = useState(0);

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

  function startCooldown() {
    setResendSeconds(durationSeconds);
  }

  return {
    resendSeconds,
    startCooldown,
  };
}
