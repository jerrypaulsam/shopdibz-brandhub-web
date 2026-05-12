import { useState } from "react";
import { useToast } from "@/src/components/app/ToastProvider";
import { PRODUCT_VARIATION_MAPS } from "@/src/data/product-variation-options";
import { useProductListingDraft } from "./useProductListingDraft";

const EMPTY_VARIATION_FORM = {
  name: "",
  typeMap: "",
  mrp: "",
  price: "",
  variationSkuCode: "",
  stock: "S",
  maxStock: "1",
};

/**
 * @returns {ReturnType<typeof useProductListingDraft> & {
 * form: typeof EMPTY_VARIATION_FORM,
 * setFormField: (field: keyof typeof EMPTY_VARIATION_FORM, value: string) => void,
 * error: string,
 * mappingOptions: Array<any>,
 * addCurrentVariation: () => Promise<void>,
 * finishVariations: () => Promise<void>,
 * }}
 */
export function useProductVariationForm() {
  const draftApi = useProductListingDraft();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_VARIATION_FORM);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const mappingOptions = PRODUCT_VARIATION_MAPS[draftApi.draft.variantType] || [];

  function setFormField(field, value) {
    setError("");
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function addCurrentVariation() {
    const fieldValidation = validateVariationForm(form, false);
    if (Object.keys(fieldValidation).length) {
      const nextMessage = Object.values(fieldValidation)[0];
      setFieldErrors(fieldValidation);
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
      return;
    }

    const errors = draftApi.addVariation(form);
    if (errors.length) {
      setError(errors[0]);
      showToast({ message: errors[0], type: "error" });
      return;
    }

    setFieldErrors({});
    setForm(EMPTY_VARIATION_FORM);
  }

  async function finishVariations() {
    await draftApi.routeToStep("info");
  }

  return {
    ...draftApi,
    form,
    setFormField,
    error,
    fieldErrors,
    mappingOptions,
    addCurrentVariation,
    finishVariations,
  };
}

function validateVariationForm(form, requireVariantType) {
  const errors = {};

  if (requireVariantType && !form.variantType) errors.variantType = "field required *";
  if (!form.name.trim()) errors.name = "field required *";
  if (!form.typeMap.trim()) errors.typeMap = "field required *";
  if (!form.mrp.trim()) errors.mrp = "field required *";
  if (!form.price.trim()) errors.price = "field required *";
  if (Number(form.price || 0) > Number(form.mrp || 0)) {
    errors.price = "Selling Price Should be lower than MRP";
  }
  if (!form.variationSkuCode.trim()) errors.variationSkuCode = "field required *";
  if (form.stock === "S" && !form.maxStock.trim()) errors.maxStock = "field required *";

  return errors;
}
