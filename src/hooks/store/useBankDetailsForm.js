import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { lookupBankIfsc, updateBankDetails } from "@/src/api/bank";
import { logScreenView } from "@/src/api/analytics";

/**
 * @param {{ isFirstTime: boolean }} options
 * @returns {any}
 */
export function useBankDetailsForm({ isFirstTime }) {
  const router = useRouter();
  const [form, setForm] = useState({
    accountName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });
  const [message, setMessage] = useState("");
  const [ifscDetails, setIfscDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUpIfsc, setIsLookingUpIfsc] = useState(false);

  useEffect(() => {
    logScreenView("bank_detail_screen", "Anonymous", "store");
  }, []);

  useEffect(() => {
    const ifscCode = form.ifscCode.trim().toUpperCase();

    if (ifscCode.length < 11) {
      return;
    }

    let isCurrent = true;
    const timeoutId = window.setTimeout(async () => {
      setIsLookingUpIfsc(true);

      try {
        const data = await lookupBankIfsc(ifscCode);

        if (!isCurrent) {
          return;
        }

        setForm((current) => ({
          ...current,
          bankName: data?.bank || current.bankName,
          ifscCode,
        }));
        setIfscDetails(data?.address || "");
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setIfscDetails(
          error instanceof Error ? error.message : "Not A Valid IFSC Code",
        );
      } finally {
        if (isCurrent) {
          setIsLookingUpIfsc(false);
        }
      }
    }, 350);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [form.ifscCode]);

  /**
   * @param {"accountName" | "accountNumber" | "confirmAccountNumber" | "ifscCode" | "bankName"} key
   * @param {string} value
   */
  function updateField(key, value) {
    const nextValue = key === "ifscCode" ? value.toUpperCase() : value;

    setForm((current) => ({
      ...current,
      [key]: nextValue,
    }));

    if (key === "ifscCode" && nextValue.trim().length < 11) {
      setIfscDetails("");
    }
  }

  async function submitForm() {
    if (
      !form.accountName ||
      !form.accountNumber ||
      !form.confirmAccountNumber ||
      !form.ifscCode ||
      !form.bankName
    ) {
      setMessage("Please fill all required fields.");
      return false;
    }

    if (form.accountNumber !== form.confirmAccountNumber) {
      setMessage("Account number does not match.");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateBankDetails({
        accountName: form.accountName,
        accountNumber: form.accountNumber,
        bankName: form.bankName,
        ifscCode: form.ifscCode.trim().toUpperCase(),
      });

      setMessage("Bank Details Added");

      if (isFirstTime) {
        await router.replace("/awaiting-verification");
      } else {
        await router.replace("/profile/account-settings");
      }

      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Oops something went wrong");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    message,
    ifscDetails,
    isSubmitting,
    isLookingUpIfsc,
    updateField,
    submitForm,
  };
}
