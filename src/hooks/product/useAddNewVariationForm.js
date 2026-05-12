import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { addNewVariationToProduct, fetchProductDetail } from "@/src/api/products";
import { useToast } from "@/src/components/app/ToastProvider";
import { PRODUCT_VARIATION_MAPS } from "@/src/data/product-variation-options";
import { getProductVariations } from "@/src/utils/product";

/**
 * @returns {{
 * product: any,
 * form: any,
 * isLoading: boolean,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * lockedVariantType: string,
 * mappingOptions: any[],
 * setFormField: (field: string, value: string) => void,
 * submit: () => Promise<void>,
 * slug: string,
 * }}
 */
export function useAddNewVariationForm() {
  const router = useRouter();
  const { showToast } = useToast();
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      if (!slug) {
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchProductDetail(slug);
        const productVariantType = getProductVariantType(data);
        setProduct(data);
        if (!productVariantType) {
          setError("Variation type could not be found for this product.");
          return;
        }
        setForm((currentForm) => ({
          ...currentForm,
          variantType: productVariantType,
        }));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Product could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [slug]);

  function setFormField(field, value) {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
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
      const errors = validateVariationForm(form, true);

      if (Object.keys(errors).length) {
        const nextMessage = Object.values(errors)[0];
        setFieldErrors(errors);
        setError(nextMessage);
        showToast({ message: nextMessage, type: "error" });
        return;
      }

      setFieldErrors({});

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
      showToast({ message: "New variation added to product.", type: "success" });
      setForm({
        variantType: form.variantType,
        name: "",
        typeMap: "",
        mrp: "",
        price: "",
        variationSkuCode: "",
        stock: "S",
        maxStock: "1",
      });
    } catch (submitError) {
      const nextMessage =
        submitError instanceof Error
          ? submitError.message
          : "Variation could not be created.";
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
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
    fieldErrors,
    success,
    lockedVariantType: form.variantType,
    mappingOptions: PRODUCT_VARIATION_MAPS[form.variantType] || [],
    setFormField,
    submit,
    slug,
  };
}

function getProductVariantType(product) {
  const firstVariation = getProductVariations(product)[0];

  return String(
    firstVariation?.vAtion ||
      firstVariation?.variation ||
      product?.vAtion ||
      product?.variation ||
      "",
  )
    .trim()
    .toLowerCase();
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
