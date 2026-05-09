import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { changeSellerPassword } from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

export function useChangePasswordForm() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    logScreenView("change_password", "Authenticated Seller", "store");
  }, []);

  async function submitForm() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("All fields are required.");
      return false;
    }

    if (newPassword.length < 8) {
      setMessage("At least 8 characters is required.");
      return false;
    }

    if (newPassword.length > 15) {
      setMessage("Maximum of 15 characters.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await changeSellerPassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      setMessage("Password Changed Successfully");
      await router.push("/home");
      return true;
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Oops something went wrong.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    message,
    isSubmitting,
    submitForm,
  };
}
