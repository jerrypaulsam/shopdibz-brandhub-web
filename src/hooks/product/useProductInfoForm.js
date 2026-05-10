import { useState } from "react";
import { createProductWithVariants } from "@/src/api/products";
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
  const [error, setError] = useState("");
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

    const errors = draftApi.validateInfoStep();
    if (errors.length) {
      setError(errors[0]);
      return;
    }

    if (draftApi.draft.variantMode === "without-variant") {
      await draftApi.routeToStep("images");
      return;
    }

    try {
      setIsSubmitting(true);
      await createProductWithVariants(draftApi.buildVariantProductPayload());
      setSuccess("Product added successfully.");
      draftApi.resetDraft();
      await draftApi.router.replace("/home");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Product could not be created.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    ...draftApi,
    variationTypes: PRODUCT_VARIATION_TYPES,
    error,
    success,
    isSubmitting,
    submitInfoForm,
    chooseVariantType,
    toggleShipZone,
    toggleShipExZone,
  };
}
