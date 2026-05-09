import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createStore, verifyGstNumber } from "@/src/api/store";
import { logScreenView } from "@/src/api/analytics";

export function useStoreCreateForm() {
  const router = useRouter();
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

  useEffect(() => {
    logScreenView("store_form", "Anonymous", "store");
  }, []);

  async function handleVerifyGst() {
    if (gstin.trim().length !== 15) {
      setGstVerificationFailed(true);
      setGstVerified(false);
      setMessage("GSTIN should be 15 characters");
      return;
    }

    setIsVerifyingGst(true);
    setMessage("");

    try {
      const data = await verifyGstNumber(gstin.trim());
      setStoreRegisteredName(data?.legalNameOfBusiness || "");
      setStoreRegistrationId(extractPanFromGstin(data?.gstIdentificationNumber || gstin));
      setGstVerified(true);
      setGstVerificationFailed(false);
      setMessage("Verification Successful");
    } catch {
      setGstVerificationFailed(true);
      setGstVerified(false);
      setMessage("Verification Failed");
    } finally {
      setIsVerifyingGst(false);
    }
  }

  async function submitForm() {
    if (!storeRegisteredName || !storeRegistrationId || !gstin) {
      setMessage("All required fields must be filled.");
      return;
    }

    if (!signatureBase64) {
      setMessage("Signature is required.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await createStore({
        regName: storeRegisteredName,
        regId: storeRegistrationId,
        gstin,
        ref: refCode,
        signatureBase64,
        enable: true,
      });
      await router.replace("/store-info-form");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
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
