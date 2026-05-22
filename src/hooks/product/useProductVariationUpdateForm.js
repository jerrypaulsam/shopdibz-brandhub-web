import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchProductDetail,
  updateExistingVariation,
} from "@/src/api/products";
import { useToast } from "@/src/components/app/ToastProvider";
import { PRODUCT_VARIATION_MAPS } from "@/src/data/product-variation-options";
import { resolveActiveVariation } from "@/src/utils/product";
import { PRODUCT_VARIATION_FIELD_LIMITS } from "./productFieldLimits";

/**
 * @returns {{
 * product: any,
 * variation: any,
 * form: any,
 * isLoading: boolean,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * mappingOptions: any[],
 * variationFields: Array<{ key: string, label: string, mappingOptions: any[] }>,
 * setFormField: (field: string, value: string) => void,
 * setVariationField: (key: string, field: "name" | "typeMap", value: string) => void,
 * submit: () => Promise<void>,
 * slug: string,
 * variationId: string,
 * }}
 */
export function useProductVariationUpdateForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : String(router.query.slug || "");
  const variationId = Array.isArray(router.query["variation-id"])
    ? router.query["variation-id"][0]
    : String(router.query["variation-id"] || "");

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    variantType: "",
    mrp: "",
    price: "",
    variationSkuCode: "",
    stock: "S",
    maxStock: "1",
    variationFields: [],
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
        setError("");
        const data = await fetchProductDetail(slug);
        setProduct(data);
        const variation = resolveActiveVariation(data.prdtVari || [], variationId);

        if (variation) {
          const nextVariantType = String(variation.vAtion || variation.variation || "").toLowerCase();
          const existingVariationTypes = Array.isArray(variation.vTypes)
            ? variation.vTypes
            : Array.isArray(variation.variationTypes)
              ? variation.variationTypes
              : [];
          const fieldOrder = getVariationFieldOrder(nextVariantType);

          setForm({
            variantType: nextVariantType,
            mrp: String(variation.mrp || ""),
            price: String(variation.price || ""),
            variationSkuCode: variation.sku || "",
            stock: variation.inStock || "S",
            maxStock: String(variation.mStock || 1),
            variationFields: fieldOrder.map((key, index) => {
              const currentValue = existingVariationTypes[index] || {};
              return {
                key,
                id: currentValue?.id || index + 1,
                name: currentValue?.name || "",
                typeMap: currentValue?.tMap || currentValue?.type_map || "",
              };
            }),
          });
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Variation could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [slug, variationId]);

  const variation = useMemo(
    () => resolveActiveVariation(product?.prdtVari || [], variationId),
    [product?.prdtVari, variationId],
  );

  const mappingOptions = PRODUCT_VARIATION_MAPS[form.variantType] || [];
  const variationFields = form.variationFields.map((field) => ({
    key: field.key,
    label: titleCaseValue(field.key),
    mappingOptions: PRODUCT_VARIATION_MAPS[field.key] || [],
  }));

  function setFormField(field, value) {
    setFieldErrors((currentForm) => ({ ...currentForm, [field]: "" }));
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function setVariationField(key, field, value) {
    setFieldErrors((currentForm) => ({ ...currentForm, [`${key}-${field}`]: "" }));
    setForm((currentForm) => ({
      ...currentForm,
      variationFields: currentForm.variationFields.map((item) =>
        item.key === key ? { ...item, [field]: value } : item,
      ),
    }));
  }

  async function submit() {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      const errors = validateVariationForm(form);

      if (Object.keys(errors).length) {
        const nextMessage = Object.values(errors)[0];
        setFieldErrors(errors);
        setError(nextMessage);
        showToast({ message: nextMessage, type: "error" });
        return;
      }

      setFieldErrors({});

      await updateExistingVariation({
        variationId: Number(variationId || 0),
        data: {
          price: Number(form.price || 0),
          mrp: Number(form.mrp || 0),
          in_stock: form.stock,
          max_stock: form.stock === "S" ? Number(form.maxStock || 1) : 0,
          sku_code: form.variationSkuCode,
          variants: form.variantType,
          variation_types: form.variationFields.map((item, index) => ({
            id: item.id || index + 1,
            name: item.name,
            type_map: item.typeMap,
          })),
        },
      });

      setSuccess("Variation updated successfully.");
      showToast({ message: "Variation Updated Successfully", type: "success" });
    } catch (submitError) {
      const nextMessage =
        submitError instanceof Error
          ? submitError.message
          : "Variation could not be updated.";
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    product,
    variation,
    form,
    isLoading,
    isSubmitting,
    error,
    fieldErrors,
    success,
    mappingOptions,
    variationFields,
    setFormField,
    setVariationField,
    submit,
    slug,
    variationId,
  };
}

function validateVariationForm(form) {
  const errors = {};

  form.variationFields.forEach((field) => {
    if (!field.name.trim()) errors[`${field.key}-name`] = "field required *";
    else if (field.name.trim().length > PRODUCT_VARIATION_FIELD_LIMITS.name) errors[`${field.key}-name`] = `Max. ${PRODUCT_VARIATION_FIELD_LIMITS.name} Characters`;
    if (!field.typeMap.trim()) errors[`${field.key}-typeMap`] = "field required *";
    else if (field.typeMap.trim().length > PRODUCT_VARIATION_FIELD_LIMITS.typeMap) errors[`${field.key}-typeMap`] = `Max. ${PRODUCT_VARIATION_FIELD_LIMITS.typeMap} Characters`;
  });
  if (!form.mrp.trim()) errors.mrp = "field required *";
  if (!form.price.trim()) errors.price = "field required *";
  if (Number(form.price || 0) > Number(form.mrp || 0)) {
    errors.price = "Selling Price Should be lower than MRP";
  }
  if (!form.variationSkuCode.trim()) errors.variationSkuCode = "field required *";
  else if (form.variationSkuCode.trim().length > PRODUCT_VARIATION_FIELD_LIMITS.skuCode) errors.variationSkuCode = `Max. ${PRODUCT_VARIATION_FIELD_LIMITS.skuCode} Characters`;
  if (form.stock === "S" && !form.maxStock.trim()) errors.maxStock = "field required *";

  return errors;
}

function getVariationFieldOrder(variantType) {
  switch (variantType) {
    case "size-colour":
      return ["size", "colour"];
    case "material-size":
      return ["material", "size"];
    case "material-colour":
      return ["material", "colour"];
    case "flavour-size":
      return ["flavour", "size"];
    case "flavour-weight":
      return ["flavour", "weight"];
    case "colour":
    case "size":
    case "weight":
    case "material":
    case "flavour":
      return [variantType];
    default:
      return variantType ? [variantType] : [];
  }
}

function titleCaseValue(value) {
  return String(value || "")
    .split("-")
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
}
