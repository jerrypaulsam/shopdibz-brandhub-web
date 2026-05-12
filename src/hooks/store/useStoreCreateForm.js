import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createStore, verifyGstNumber } from "@/src/api/store";
import { logScreenView } from "@/src/api/analytics";
import { useToast } from "@/src/components/app/ToastProvider";

export function useStoreCreateForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [storeRegisteredName, setStoreRegisteredName] = useState("");
  const [storeRegistrationId, setStoreRegistrationId] = useState("");
  const [gstin, setGstin] = useState("");
  const [refCode, setRefCode] = useState("");
  const [signatureBase64, setSignatureBase64] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingGst, setIsVerifyingGst] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);
  const [gstVerificationFailed, setGstVerificationFailed] = useState(false);
  const [clearSignal, setClearSignal] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    logScreenView("store_form", "Anonymous", "store");
  }, []);

  async function handleVerifyGst() {
    if (gstin.trim().length !== 15) {
      const nextMessage = "GSTIN should be 15 characters";
      setGstVerificationFailed(true);
      setGstVerified(false);
      setFieldErrors({ gstin: nextMessage });
      setMessage(nextMessage);
      showToast({ message: nextMessage, type: "error" });
      return;
    }

    setIsVerifyingGst(true);
    setMessage("");
    setFieldErrors({});

    try {
      const data = await verifyGstNumber(gstin.trim());
      setStoreRegisteredName(data?.legalNameOfBusiness || "");
      setStoreRegistrationId(extractPanFromGstin(data?.gstIdentificationNumber || gstin));
      setGstVerified(true);
      setGstVerificationFailed(false);
      setMessage("Verification Successful");
      showToast({ message: "Verification Successful", type: "success" });
    } catch {
      const nextMessage = "Verification Failed";
      setGstVerificationFailed(true);
      setGstVerified(false);
      setMessage(nextMessage);
      showToast({ message: nextMessage, type: "error" });
    } finally {
      setIsVerifyingGst(false);
    }
  }

  async function submitForm() {
    const errors = validateStoreCreateForm({
      storeRegisteredName,
      storeRegistrationId,
      gstin,
      signatureBase64,
    });

    if (Object.keys(errors).length) {
      const nextMessage = Object.values(errors)[0];
      setFieldErrors(errors);
      setMessage(nextMessage);
      showToast({ message: nextMessage, type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setFieldErrors({});

    try {
      await createStore({
        regName: storeRegisteredName,
        regId: storeRegistrationId,
        gstin,
        ref: refCode,
        signatureBase64,
        enable: true,
      });
      showToast({ message: "Store Created", type: "success" });
      await router.replace("/settings/bank/create");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Something went wrong";
      setMessage(nextMessage);
      showToast({ message: nextMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearSignature() {
    setClearSignal((value) => value + 1);
  }

  return {
    storeRegisteredName,
    setStoreRegisteredName,
    storeRegistrationId,
    setStoreRegistrationId,
    gstin,
    setGstin,
    refCode,
    setRefCode,
    signatureBase64,
    setSignatureBase64,
    message,
    fieldErrors,
    isSubmitting,
    isVerifyingGst,
    gstVerified,
    gstVerificationFailed,
    clearSignal,
    handleVerifyGst,
    submitForm,
    clearSignature,
  };
}

function extractPanFromGstin(value) {
  return value.length >= 12 ? value.substring(2, 12) : "";
}

function validateStoreCreateForm(form) {
  const errors = {};

  if (form.gstin.trim().length !== 15) {
    errors.gstin = "GSTIN should be 15 characters";
  }
  if (!form.storeRegisteredName.trim()) {
    errors.storeRegisteredName = "Field required *";
  }
  if (!form.storeRegistrationId.trim()) {
    errors.storeRegistrationId = "Field required *";
  }
  if (!form.signatureBase64) {
    errors.signature = "Signature is required.";
  }

  return errors;
}
