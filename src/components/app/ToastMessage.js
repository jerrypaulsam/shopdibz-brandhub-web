import { useEffect, useRef } from "react";
import { useToast } from "./ToastProvider";

/**
 * @param {{ message?: import("react").ReactNode, type?: "info" | "success" | "error" }} props
 */
export default function ToastMessage({ message, type = "info" }) {
  const { showToast } = useToast();
  const lastShownRef = useRef("");

  useEffect(() => {
    const nextMessage = typeof message === "string" ? message.trim() : "";

    if (!nextMessage) {
      return;
    }

    const signature = `${type}:${nextMessage}`;

    if (lastShownRef.current === signature) {
      return;
    }

    lastShownRef.current = signature;
    showToast({
      message: nextMessage,
      type,
    });
  }, [message, showToast, type]);

  return null;
}
