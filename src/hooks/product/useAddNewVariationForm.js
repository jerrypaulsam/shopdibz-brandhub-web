import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { addNewVariationToProduct, fetchProductDetail } from "@/src/api/products";
import { PRODUCT_VARIATION_MAPS, PRODUCT_VARIATION_TYPES } from "@/src/data/product-variation-options";

/**
 * @returns {{
 * product: any,
 * form: any,
 * isLoading: boolean,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * variationTypes: string[],
 * mappingOptions: any[],
 * setFormField: (field: string, value: string) => void,
 * submit: () => Promise<void>,
 * slug: string,
 * }}
 */
export function useAddNewVariationForm() {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : String(router.query.slug || "");

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    variantType: "",
    name: "",
    typeMap: "",
    mrp: "",
    price: "",
    variationSkuCode: "",
    stock: "S",
    maxStock: "1",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      if (!slug) {
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchProductDetail(slug);
        setProduct(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Product could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [slug]);

  function setFormField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  async function submit() {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      await addNewVariationToProduct({
        slug,
        variant: form.variantType,
        name: form.name,
        typeMap: form.typeMap,
        mrp: Number(form.mrp || 0),
        price: Number(form.price || 0),
        skuCode: form.variationSkuCode,
        inStock: form.stock,
        maxStock: form.stock === "S" ? Number(form.maxStock || 1) : 0,
      });

      setSuccess("Variation added successfully.");
      setForm({
        variantType: "",
        name: "",
        typeMap: "",
        mrp: "",
        price: "",
        variationSkuCode: "",
        stock: "S",
        maxStock: "1",
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Variation could not be created.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    product,
    form,
    isLoading,
    isSubmitting,
    error,
    success,
    variationTypes: PRODUCT_VARIATION_TYPES,
    mappingOptions: PRODUCT_VARIATION_MAPS[form.variantType] || [],
    setFormField,
    submit,
    slug,
  };
}
