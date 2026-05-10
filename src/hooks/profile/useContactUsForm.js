import { useEffect, useState } from "react";
import { CONTACT_TYPES, getProfileSession, submitContactRequest } from "@/src/api/profile";
import { logScreenView } from "@/src/api/analytics";
import { useRouter } from "next/router";

export function useContactUsForm() {
  const router = useRouter();
  const [type, setType] = useState(CONTACT_TYPES[0].id);
  const [contactMessage, setContactMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const session = getProfileSession();
    logScreenView("contact_screen", session?.storeUrl || "Anonymous", "store");
  }, []);

  async function submitForm() {
    if (!contactMessage.trim()) {
      setMessage("Message is required");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await submitContactRequest({
        type,
        message: contactMessage.trim(),
        orderId: orderId.trim(),
      });
      setMessage("Request Submitted. Please visit action board to view the ticket.");
      await router.push("/action-board/support-tickets");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    contactTypes: CONTACT_TYPES,
    type,
    setType,
    contactMessage,
    setContactMessage,
    orderId,
    setOrderId,
    message,
    isSubmitting,
    submitForm,
  };
}
