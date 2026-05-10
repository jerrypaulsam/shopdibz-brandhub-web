import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductDetail, updateExistingProduct } from "@/src/api/products";
import {
  buildAttributePayload,
  encodePseudoArray,
  parseProductAttributes,
  parsePseudoArray,
  attributeMapToRows,
} from "@/src/utils/product";
import {
  getProductCategories,
  getSubCategories,
  getItemSubCategories,
} from "@/src/data/product-catalog";

/**
 * @returns {{
 * form: any,
 * setFormField: (field: string, value: any) => void,
 * isLoading: boolean,
 * isSubmitting: boolean,
 * error: string,
 * success: string,
 * categories: any[],
 * subCategories: any[],
 * itemSubCategories: any[],
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
 * }}
 */
export function useProductUpdateForm() {
  const router = useRouter();
  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : String(router.query.slug || "");

  const [form, setForm] = useState({
    categorySlug: "",
    subCategorySlug: "",
    itemSubCategorySlug: "",
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = useMemo(() => getProductCategories(), []);
  const subCategories = useMemo(
    () => getSubCategories(form.categorySlug),
    [form.categorySlug],
  );
  const itemSubCategories = useMemo(
    () => getItemSubCategories(form.categorySlug, form.subCategorySlug),
    [form.categorySlug, form.subCategorySlug],
  );

  useEffect(() => {
    async function load() {
      if (!slug) {
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const data = await fetchProductDetail(slug);
        const categoriesList = getProductCategories();
        const selectedCategory =
          categoriesList.find((category) => category.id === data.category) || null;
        const selectedSubCategory =
          selectedCategory?.sub?.find((subCategory) => subCategory.id === data.sub_cat) || null;
        const selectedItemSubCategory =
          selectedSubCategory?.itemSub?.find((item) => item.id === data.item_sub_cat) ||
          null;
        const attributes = parseProductAttributes(data.prdtInfo?.att);

        setForm({
          categorySlug: selectedCategory?.slug || "",
          subCategorySlug: selectedSubCategory?.slug || "",
          itemSubCategorySlug: selectedItemSubCategory?.slug || "",
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
  }, [slug]);

  function setFormField(field, value) {
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

      const selectedCategory = categories.find((category) => category.slug === form.categorySlug);
      const selectedSubCategory = subCategories.find(
        (subCategory) => subCategory.slug === form.subCategorySlug,
      );
      const selectedItem = itemSubCategories.find(
        (itemSubCategory) => itemSubCategory.slug === form.itemSubCategorySlug,
      );

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
            brand: form.brand,
            genCert: form.brandCertificate,
            publisher: form.publisher,
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
          cat: selectedCategory?.id || 0,
          subCat: selectedSubCategory?.id || 0,
          itemSub: selectedItem?.id || null,
        },
      });

      setSuccess("Product updated successfully.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Product could not be updated.",
      );
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
    success,
    categories,
    subCategories,
    itemSubCategories,
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
