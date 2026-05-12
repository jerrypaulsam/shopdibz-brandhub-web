import { useState } from "react";
import { createProductWithVariants } from "@/src/api/products";
import { useToast } from "@/src/components/app/ToastProvider";
import { PRODUCT_VARIATION_TYPES } from "@/src/data/product-variation-options";
import { useProductListingDraft } from "./useProductListingDraft";

/**
 * @returns {ReturnType<typeof useProductListingDraft> & {
 * variationTypes: typeof PRODUCT_VARIATION_TYPES,
 * error: string,
 * success: string,
 * isSubmitting: boolean,
 * submitInfoForm: () => Promise<void>,
 * chooseVariantType: (value: string) => Promise<void>,
 * toggleShipZone: (value: string) => void,
 * toggleShipExZone: (value: string) => void,
 * }}
 */
export function useProductInfoForm() {
  const draftApi = useProductListingDraft();
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleShipZone(value) {
    const hasValue = draftApi.draft.shipZones.includes(value);
    draftApi.updateDraft({
      shipZones: hasValue
        ? draftApi.draft.shipZones.filter((zone) => zone !== value)
        : [...draftApi.draft.shipZones, value],
    });
  }

  function toggleShipExZone(value) {
    const hasValue = draftApi.draft.shipExZones.includes(value);
    draftApi.updateDraft({
      shipExZones: hasValue
        ? draftApi.draft.shipExZones.filter((zone) => zone !== value)
        : [...draftApi.draft.shipExZones, value],
    });
  }

  async function chooseVariantType(value) {
    if (draftApi.draft.variations.length) {
      setError("Remove added variations before changing the variation type.");
      return;
    }

    draftApi.updateDraft({
      variantType: value,
    });
    await draftApi.routeToStep("variation", {
      "variation-type": value,
    });
  }

  async function submitInfoForm() {
    setError("");
    setSuccess("");

    const errors = draftApi.validateInfoFields();
    if (Object.keys(errors).length) {
      const nextMessage = Object.values(errors)[0];
      setFieldErrors(errors);
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
      return;
    }

    setFieldErrors({});

    if (draftApi.draft.variantMode === "without-variant") {
      await draftApi.routeToStep("images");
      return;
    }

    try {
      setIsSubmitting(true);
      await createProductWithVariants(draftApi.buildVariantProductPayload());
      setSuccess("Product added successfully.");
      showToast({ message: "Product added successfully.", type: "success" });
      draftApi.resetDraft();
      await draftApi.router.replace("/home");
    } catch (submitError) {
      const nextMessage =
        submitError instanceof Error
          ? submitError.message
          : "Product could not be created.";
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    ...draftApi,
    variationTypes: PRODUCT_VARIATION_TYPES,
    error,
    fieldErrors,
    success,
    isSubmitting,
    submitInfoForm,
    chooseVariantType,
    toggleShipZone,
    toggleShipExZone,
  };
}
