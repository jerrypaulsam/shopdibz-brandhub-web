import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchProductDetail,
  updateExistingVariation,
} from "@/src/api/products";
import { useToast } from "@/src/components/app/ToastProvider";
import { PRODUCT_VARIATION_MAPS } from "@/src/data/product-variation-options";
import { resolveActiveVariation } from "@/src/utils/product";

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
 * setFormField: (field: string, value: string) => void,
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
    name: "",
    typeMap: "",
    mrp: "",
    price: "",
    variationSkuCode: "",
    stock: "S",
    maxStock: "1",
    typeId: 0,
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
          setForm({
            variantType: String(variation.vAtion || variation.variation || "").toLowerCase(),
            name: variation.vTypes?.[0]?.name || "",
            typeMap: variation.vTypes?.[0]?.tMap || "",
            mrp: String(variation.mrp || ""),
            price: String(variation.price || ""),
            variationSkuCode: variation.sku || "",
            stock: variation.inStock || "S",
            maxStock: String(variation.mStock || 1),
            typeId: variation.vTypes?.[0]?.id || 0,
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

  function setFormField(field, value) {
    setFieldErrors((currentForm) => ({ ...currentForm, [field]: "" }));
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
      const errors = validateVariationForm(form);

      if (Object.keys(errors).length) {
        const nextMessage = Object.values(errors)[0];
        setFieldErrors(errors);
        setError(nextMessage);
        showToast({ message: nextMessage, type: "error" });
        return;
      }

      setFieldErrors({});

      const existingVariationTypes = Array.isArray(variation?.vTypes)
        ? variation.vTypes
        : Array.isArray(variation?.variationTypes)
          ? variation.variationTypes
          : [];
      const replacementType = {
        id: form.typeId || existingVariationTypes[0]?.id || 1,
        name: form.name,
        type_map: form.typeMap,
      };
      const replacementExists = existingVariationTypes.some(
        (item) => Number(item?.id || 0) === Number(replacementType.id || 0),
      );
      const variationTypes = existingVariationTypes.length
        ? existingVariationTypes.map((item, index) => {
            const currentId = Number(item?.id || 0);
            const shouldReplace =
              currentId === Number(replacementType.id || 0) ||
              (!replacementExists && index === 0);

            if (shouldReplace) {
              return replacementType;
            }

            return {
              id: item?.id || index + 1,
              name: item?.name || "",
              type_map: item?.tMap || item?.type_map || "",
            };
          })
        : [replacementType];

      await updateExistingVariation({
        variationId: Number(variationId || 0),
        data: {
          price: Number(form.price || 0),
          mrp: Number(form.mrp || 0),
          in_stock: form.stock,
          max_stock: form.stock === "S" ? Number(form.maxStock || 1) : 0,
          sku_code: form.variationSkuCode,
          variants: form.variantType,
          variation_types: variationTypes,
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
    setFormField,
    submit,
    slug,
    variationId,
  };
}

function validateVariationForm(form) {
  const errors = {};

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
