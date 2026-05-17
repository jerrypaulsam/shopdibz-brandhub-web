import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchBankDetails, lookupBankIfsc, updateBankDetails } from "@/src/api/bank";
import { logScreenView } from "@/src/api/analytics";

/**
 * @param {{ isFirstTime: boolean }} options
 * @returns {any}
 */
export function useBankDetailsForm({ isFirstTime }) {
  const emptyErrors = {
    accountName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  };
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
  const [fieldErrors, setFieldErrors] = useState(emptyErrors);
  const [ifscDetails, setIfscDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLookingUpIfsc, setIsLookingUpIfsc] = useState(false);
  const [isLoadingBank, setIsLoadingBank] = useState(!isFirstTime);
  const [isEditing, setIsEditing] = useState(Boolean(isFirstTime));

  const normalizeBank = useCallback((bank) => ({
    name: String(bank?.name || ""),
    accountNumber: String(bank?.accountNumber || bank?.account_number || ""),
    bankName: String(bank?.bankName || bank?.bank_name || ""),
    ifsc: String(bank?.ifsc || ""),
  }), []);

  const applyBankToForm = useCallback((bank) => {
    const normalizedBank = {
      name: String(bank?.name || ""),
      accountNumber: String(bank?.accountNumber || bank?.account_number || ""),
      bankName: String(bank?.bankName || bank?.bank_name || ""),
      ifsc: String(bank?.ifsc || ""),
    };

    setForm({
      accountName: normalizedBank.name,
      accountNumber: normalizedBank.accountNumber,
      confirmAccountNumber: normalizedBank.accountNumber,
      ifscCode: normalizedBank.ifsc,
      bankName: normalizedBank.bankName,
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

        const normalizedBank = normalizeBank(data);

        if (normalizedBank.name || normalizedBank.accountNumber || normalizedBank.ifsc) {
          setSavedBank(normalizedBank);
          applyBankToForm(normalizedBank);
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
  }, [applyBankToForm, isFirstTime, normalizeBank]);

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

        const errorMessage =
          error instanceof Error ? error.message : "Not A Valid IFSC Code";

        setIfscDetails(errorMessage);

        if (errorMessage.toLowerCase() === "not a valid ifsc code") {
          setForm((current) => ({
            ...current,
            bankName: "",
            ifscCode,
          }));
        }
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
    let nextValue = value;

    if (key === "ifscCode") {
      nextValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    }

    if (key === "accountNumber" || key === "confirmAccountNumber") {
      nextValue = value.replace(/\D/g, "").slice(0, 18);
    }

    setForm((current) => ({
      ...current,
      [key]: nextValue,
    }));

    setFieldErrors((current) => ({
      ...current,
      [key]: "",
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
    setFieldErrors(emptyErrors);
    setIsEditing(true);
  }

  function cancelEditing() {
    if (savedBank) {
      applyBankToForm(savedBank);
      setIsEditing(false);
      setIfscDetails("");
      setMessage("");
      setFieldErrors(emptyErrors);
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
    setFieldErrors(emptyErrors);
  }

  async function submitForm() {
    const accountName = form.accountName.trim();
    const accountNumber = form.accountNumber.trim();
    const confirmAccountNumber = form.confirmAccountNumber.trim();
    const ifscCode = form.ifscCode.trim().toUpperCase();
    const bankName = form.bankName.trim();

    const nextErrors = { ...emptyErrors };

    if (!accountName) {
      nextErrors.accountName = "Required";
    }
    if (!accountNumber) {
      nextErrors.accountNumber = "Required";
    } else if (!/^\d{6,18}$/.test(accountNumber)) {
      nextErrors.accountNumber = "Account number must be between 6 and 18 digits.";
    }
    if (!confirmAccountNumber) {
      nextErrors.confirmAccountNumber = "Required";
    } else if (accountNumber !== confirmAccountNumber) {
      nextErrors.confirmAccountNumber = "Account number does not match.";
    }
    if (!ifscCode) {
      nextErrors.ifscCode = "Required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      nextErrors.ifscCode = "Please enter a valid 11-character IFSC code.";
    } else if (String(ifscDetails || "").toLowerCase() === "not a valid ifsc code") {
      nextErrors.ifscCode = "Please enter a valid IFSC code.";
    }
    if (!bankName) {
      nextErrors.bankName = "Required";
    }

    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      setMessage("Please fill all required fields.");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateBankDetails({
        accountName,
        accountNumber,
        bankName,
        ifscCode,
      });

      const nextSavedBank = {
        name: accountName,
        accountNumber,
        bankName,
        ifsc: ifscCode,
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
    fieldErrors,
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
