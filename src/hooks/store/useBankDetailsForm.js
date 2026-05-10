import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBankDetails, lookupBankIfsc, updateBankDetails } from "@/src/api/bank";
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
  const [savedBank, setSavedBank] = useState(null);
  const [message, setMessage] = useState("");
  const [ifscDetails, setIfscDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUpIfsc, setIsLookingUpIfsc] = useState(false);
  const [isLoadingBank, setIsLoadingBank] = useState(!isFirstTime);
  const [isEditing, setIsEditing] = useState(Boolean(isFirstTime));

  const applyBankToForm = useCallback((bank) => {
    setForm({
      accountName: String(bank?.name || ""),
      accountNumber: String(bank?.accountNumber || ""),
      confirmAccountNumber: String(bank?.accountNumber || ""),
      ifscCode: String(bank?.ifsc || ""),
      bankName: String(bank?.bankName || ""),
    });
  }, []);

  useEffect(() => {
    logScreenView(
      isFirstTime ? "bank_detail_screen" : "bank_screen",
      "Anonymous",
      "store",
    );
  }, [isFirstTime]);

  useEffect(() => {
    if (isFirstTime) {
      return;
    }

    let isCurrent = true;
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingBank(true);
      setMessage("");

      try {
        const data = await fetchBankDetails();

        if (!isCurrent) {
          return;
        }

        if (data?.name || data?.accountNumber || data?.ifsc) {
          setSavedBank(data);
          applyBankToForm(data);
          setIsEditing(false);
          setIfscDetails("");
        } else {
          setSavedBank(null);
          setIsEditing(true);
        }
      } catch (error) {
        if (!isCurrent) {
          return;
        }

        setSavedBank(null);
        setIsEditing(true);
        setMessage(
          error instanceof Error ? error.message : "Bank details could not be loaded",
        );
      } finally {
        if (isCurrent) {
          setIsLoadingBank(false);
        }
      }
    }, 0);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeoutId);
    };
  }, [applyBankToForm, isFirstTime]);

  useEffect(() => {
    const ifscCode = form.ifscCode.trim().toUpperCase();

    if (ifscCode.length < 11 || (!isEditing && !isFirstTime)) {
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
  }, [form.ifscCode, isEditing, isFirstTime]);

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

  function startEditing() {
    if (savedBank) {
      applyBankToForm(savedBank);
      setIfscDetails("");
    }
    setMessage("");
    setIsEditing(true);
  }

  function cancelEditing() {
    if (savedBank) {
      applyBankToForm(savedBank);
      setIsEditing(false);
      setIfscDetails("");
      setMessage("");
      return;
    }

    setForm({
      accountName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      bankName: "",
    });
    setIfscDetails("");
    setMessage("");
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
        accountName: form.accountName.trim(),
        accountNumber: form.accountNumber.trim(),
        bankName: form.bankName.trim(),
        ifscCode: form.ifscCode.trim().toUpperCase(),
      });

      const nextSavedBank = {
        name: form.accountName.trim(),
        accountNumber: form.accountNumber.trim(),
        bankName: form.bankName.trim(),
        ifsc: form.ifscCode.trim().toUpperCase(),
      };

      setSavedBank(nextSavedBank);
      setMessage("Bank Details Added");
      setIsEditing(false);

      if (isFirstTime) {
        await router.replace("/awaiting-verification");
      } else {
        await router.replace("/settings/bank");
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
    savedBank,
    message,
    ifscDetails,
    isSubmitting,
    isLookingUpIfsc,
    isLoadingBank,
    isEditing,
    updateField,
    submitForm,
    startEditing,
    cancelEditing,
  };
}
