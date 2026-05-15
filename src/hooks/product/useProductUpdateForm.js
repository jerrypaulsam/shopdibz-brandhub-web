import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductDetail, updateExistingProduct } from "@/src/api/products";
import { useToast } from "@/src/components/app/ToastProvider";
import { getProductCategories } from "@/src/data/product-catalog";
import {
  buildAttributePayload,
  getProductCategoryTrail,
  encodePseudoArray,
  parseProductAttributes,
  parsePseudoArray,
  attributeMapToRows,
} from "@/src/utils/product";

/**
 * @returns {{
 * form: any,
 * setFormField: (field: string, value: any) => void,
 * isLoading: boolean,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * categoryTrail: string,
 * isBookCategory: boolean,
 * fieldErrors: Record<string, string>,
 * addAttribute: () => void,
 * updateAttribute: (id: number, key: "key" | "value", value: string) => void,
 * removeAttribute: (id: number) => void,
 * addKeyword: (value: string) => string,
 * removeKeyword: (value: string) => void,
 * toggleShipZone: (value: string) => void,
 * toggleShipExZone: (value: string) => void,
 * submit: () => Promise<void>,
 * slug: string,
 * variantMode: string,
 * }} [options]
 */
export function useProductUpdateForm(options = {}) {
  const router = useRouter();
  const { showToast } = useToast();
  const enabled = options.enabled ?? true;
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : String(router.query.slug || "");

  const [form, setForm] = useState({
    title: "",
    brand: "",
    brandCertificate: "",
    publisher: "",
    price: "",
    mrp: "",
    shipCost: "",
    keywords: [],
    gstRate: "",
    hsnCode: "",
    skuCode: "",
    mpn: "",
    description: "",
    stock: "S",
    maxStock: "1",
    condition: "N",
    shippingProfile: false,
    showSizeChart: false,
    enablePrebooking: false,
    shipZones: [],
    shipExZones: [],
    attributes: [],
    manufacturerValue: "",
    originCountryValue: "",
    videoUrl: "",
    variants: false,
  });
  const [categoryTrail, setCategoryTrail] = useState("");
  const [isBookCategory, setIsBookCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      if (!enabled || !slug) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const data = await fetchProductDetail(slug);
        const attributes = parseProductAttributes(data.prdtInfo?.att);
        const categories = getProductCategories();

        setCategoryTrail(resolveUpdateCategoryTrail(data, categories));
        setIsBookCategory(Number(data.sub_cat || data.subCat || 0) === 50);
        setForm({
          title: data.title || "",
          brand: data.prdtInfo?.brd || "",
          brandCertificate: data.prdtInfo?.brdCert || "",
          publisher: data.prdtInfo?.pub || "",
          price: String(data.prdtInfo?.price || ""),
          mrp: String(data.prdtInfo?.mrp || ""),
          shipCost: String(data.prdtInfo?.shCost || 0),
          keywords: (data.prdtInfo?.keys || []).map((keyword) => String(keyword)),
          gstRate: data.prdtInfo?.gst || "",
          hsnCode: data.hsn || "",
          skuCode: data.prdtInfo?.sCode || "",
          mpn: data.prdtInfo?.mpn || "",
          description: data.prdtInfo?.desc || "",
          stock: data.prdtInfo?.iStock || "S",
          maxStock: String(data.mStock || 1),
          condition: data.prdtInfo?.con || "N",
          shippingProfile: Boolean(data.shProf),
          showSizeChart: Boolean(data.prdtInfo?.showChart),
          enablePrebooking: Boolean(data.prebook),
          shipZones: parsePseudoArray(data.prdtInfo?.sZones),
          shipExZones: parsePseudoArray(data.prdtInfo?.sxZones),
          attributes: attributeMapToRows(attributes),
          manufacturerValue: attributes.Manufacturer?.[0] || "",
          originCountryValue: attributes["Country of Origin"]?.[0] || "",
          videoUrl: data.prdtInfo?.vUrl || "",
          variants: Boolean(data.var),
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Product could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [enabled, slug]);

  function setFormField(field, value) {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function addAttribute() {
    setForm((currentForm) => ({
      ...currentForm,
      attributes: [...currentForm.attributes, { id: Date.now(), key: "", value: "" }],
    }));
  }

  function updateAttribute(id, key, value) {
    setForm((currentForm) => ({
      ...currentForm,
      attributes: currentForm.attributes.map((attribute) =>
        attribute.id === id ? { ...attribute, [key]: value } : attribute,
      ),
    }));
  }

  function removeAttribute(id) {
    setForm((currentForm) => ({
      ...currentForm,
      attributes: currentForm.attributes.filter((attribute) => attribute.id !== id),
    }));
  }

  function addKeyword(value) {
    const keyword = value.trim();
    if (keyword.length < 3) return "Minimum 3 characters.";
    if (keyword.length > 10) return "Maximum 10 characters.";
    if (form.keywords.includes(keyword)) return "Keyword already added.";
    if (form.keywords.length >= 5) return "Maximum 5 keywords permitted.";

    setForm((currentForm) => ({
      ...currentForm,
      keywords: [...currentForm.keywords, keyword],
    }));

    return "";
  }

  function removeKeyword(value) {
    setForm((currentForm) => ({
      ...currentForm,
      keywords: currentForm.keywords.filter((keyword) => keyword !== value),
    }));
  }

  function toggleShipZone(value) {
    setForm((currentForm) => ({
      ...currentForm,
      shipZones: currentForm.shipZones.includes(value)
        ? currentForm.shipZones.filter((zone) => zone !== value)
        : [...currentForm.shipZones, value],
    }));
  }

  function toggleShipExZone(value) {
    setForm((currentForm) => ({
      ...currentForm,
      shipExZones: currentForm.shipExZones.includes(value)
        ? currentForm.shipExZones.filter((zone) => zone !== value)
        : [...currentForm.shipExZones, value],
    }));
  }

  async function submit() {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");
      const errors = validateProductUpdateForm(form, isBookCategory);

      if (Object.keys(errors).length) {
        const nextMessage = Object.values(errors)[0];
        setFieldErrors(errors);
        setError(nextMessage);
        showToast({ message: nextMessage, type: "error" });
        return;
      }

      setFieldErrors({});

      const attributes = buildAttributePayload(
        form.attributes,
        form.manufacturerValue,
        form.originCountryValue,
      );

      await updateExistingProduct({
        slug,
        data: {
          gst: "false",
          shProfile: form.shippingProfile,
          prebook: form.enablePrebooking,
          title: form.title,
          hsn: form.hsnCode,
          info: {
            keywords: encodePseudoArray(form.keywords),
            brand: isBookCategory ? "" : form.brand,
            genCert: isBookCategory ? "" : form.brandCertificate,
            publisher: isBookCategory ? form.publisher : "",
            price: form.price,
            mrp: form.mrp,
            in_stock: form.stock,
            desc: form.description,
            taxRate: form.gstRate,
            sku_code: form.skuCode,
            condition: form.condition,
            ship_cost: Number(form.shipCost || 0),
            ship_zones: encodePseudoArray(form.shipZones),
            ship_ex_zones: encodePseudoArray(form.shipExZones),
            attributes,
            video_url: form.videoUrl,
            showChart: form.showSizeChart,
          },
          maxStock: Number(form.maxStock || 0),
          variants: "False",
        },
      });

      setSuccess("Product updated successfully.");
      showToast({ message: "Product updated successfully.", type: "success" });
    } catch (submitError) {
      const nextMessage =
        submitError instanceof Error
          ? submitError.message
          : "Product could not be updated.";
      setError(nextMessage);
      showToast({ message: nextMessage, type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    setFormField,
    isLoading,
    isSubmitting,
    error,
    fieldErrors,
    success,
    categoryTrail,
    isBookCategory,
    addAttribute,
    updateAttribute,
    removeAttribute,
    addKeyword,
    removeKeyword,
    toggleShipZone,
    toggleShipExZone,
    submit,
    slug,
    variantMode: form.variants ? "with-variant" : "without-variant",
  };
}

function validateProductUpdateForm(form, isBookCategory) {
  const errors = {};

  if (!form.title.trim()) errors.title = "field required *";
  if (!isBookCategory && !form.brand.trim()) errors.brand = "field required *";
  if (isBookCategory && !form.publisher.trim()) errors.publisher = "field required *";
  if (!form.variants) {
    if (!form.mrp.trim()) errors.mrp = "field required *";
    if (!form.price.trim()) errors.price = "field required *";
    if (!form.skuCode.trim()) errors.skuCode = "field required *";
    if (Number(form.price || 0) > Number(form.mrp || 0)) {
      errors.price = "Selling Price Should be lower than MRP";
    }
  }
  if (!form.hsnCode.trim()) errors.hsnCode = "field required *";
  if (!form.gstRate) errors.gstRate = "field required *";
  if (!form.description.trim()) {
    errors.description = "* Required";
  } else if (form.description.trim().length > 6000) {
    errors.description = "Max. 6000 Characters";
  }
  if (!form.manufacturerValue.trim()) errors.manufacturerValue = "field required *";
  if (!form.originCountryValue.trim()) errors.originCountryValue = "field required *";
  if (form.videoUrl.trim() && !isValidUrl(form.videoUrl.trim())) {
    errors.videoUrl = "Enter a Url";
  }

  form.attributes.forEach((attribute) => {
    if (!attribute.key.trim()) {
      errors[`attribute-${attribute.id}-key`] = "* Required";
    } else if (attribute.key.trim().length > 20) {
      errors[`attribute-${attribute.id}-key`] = "Max. 20 Characters";
    }
    if (!attribute.value.trim()) {
      errors[`attribute-${attribute.id}-value`] = "* Required";
    } else if (attribute.value.trim().length > 20) {
      errors[`attribute-${attribute.id}-value`] = "Max. 20 Characters";
    }
  });

  return errors;
}

function resolveUpdateCategoryTrail(product, categories) {
  const directTrail = getProductCategoryTrail(product);

  if (directTrail) {
    return directTrail;
  }

  const categoryId = Number(product?.category || product?.cat || 0);
  const subCategoryId = Number(product?.sub_cat || product?.subCat || 0);
  const itemSubCategoryId = Number(product?.item_sub_cat || product?.itemSubCat || 0);

  const category = categories.find((item) => Number(item.id) === categoryId) || null;
  const subCategory =
    category?.sub?.find((item) => Number(item.id) === subCategoryId) || null;
  const itemSubCategory =
    subCategory?.itemSub?.find((item) => Number(item.id) === itemSubCategoryId) || null;

  return [category?.name, subCategory?.name, itemSubCategory?.name]
    .filter(Boolean)
    .join(" / ");
}

function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
