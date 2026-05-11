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
    const accountName = form.accountName.trim();
    const accountNumber = form.accountNumber.trim();
    const confirmAccountNumber = form.confirmAccountNumber.trim();
    const ifscCode = form.ifscCode.trim().toUpperCase();
    const bankName = form.bankName.trim();

    if (!accountName || !accountNumber || !confirmAccountNumber || !ifscCode || !bankName) {
      setMessage("Please fill all required fields.");
      return false;
    }

    if (!/^\d{6,18}$/.test(accountNumber)) {
      setMessage("Account number must be between 6 and 18 digits.");
      return false;
    }

    if (accountNumber !== confirmAccountNumber) {
      setMessage("Account number does not match.");
      return false;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      setMessage("Please enter a valid 11-character IFSC code.");
      return false;
    }

    if (String(ifscDetails || "").toLowerCase() === "not a valid ifsc code") {
      setMessage("Please enter a valid IFSC code.");
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
