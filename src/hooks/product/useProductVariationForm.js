import { useState } from "react";
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
 * }}
 */
export function useProductVariationForm() {
  const draftApi = useProductListingDraft();
  const [form, setForm] = useState(EMPTY_VARIATION_FORM);
  const [error, setError] = useState("");

  const mappingOptions = PRODUCT_VARIATION_MAPS[draftApi.draft.variantType] || [];

  function setFormField(field, value) {
    setError("");
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function addCurrentVariation() {
    const errors = draftApi.addVariation(form);
    if (errors.length) {
      setError(errors[0]);
      return;
    }

    setForm(EMPTY_VARIATION_FORM);
    await draftApi.routeToStep("info");
  }

  return {
    ...draftApi,
    form,
    setFormField,
    error,
    mappingOptions,
    addCurrentVariation,
  };
}
