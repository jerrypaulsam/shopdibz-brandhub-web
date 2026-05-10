import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  PRODUCT_GST_OPTIONS,
  PRODUCT_SHIP_EX_ZONES,
  PRODUCT_SHIP_ZONES,
} from "@/src/data/product-variation-options";
import { resolveProductSelection } from "@/src/data/product-catalog";

export const PRODUCT_DRAFT_STORAGE_KEY = "shopdibz_product_listing_draft";

const DEFAULT_DRAFT = {
  listingMode: "single",
  variantMode: "without-variant",
  categorySlug: "",
  subCategorySlug: "",
  itemSubCategorySlug: "",
  variantType: "",
  title: "",
  brand: "",
  brandCertificate: "",
  publisher: "",
  price: "",
  mrp: "",
  skuCode: "",
  mpn: "",
  description: "",
  hsnCode: "",
  gstRate: "",
  keywords: [],
  manufacturerValue: "",
  originCountryValue: "",
  stock: "S",
  condition: "N",
  maxStock: "1",
  videoUrl: "",
  enablePrebooking: false,
  showSizeChart: false,
  shippingProfile: false,
  shipZones: [],
  shipExZones: [],
  attributes: [],
  variations: [],
};

/**
 * @param {string} queryValue
 * @returns {string}
 */
function firstQueryValue(queryValue) {
  if (Array.isArray(queryValue)) {
    return queryValue[0] || "";
  }

  return typeof queryValue === "string" ? queryValue : "";
}

/**
 * @returns {typeof DEFAULT_DRAFT}
 */
function readDraftFromStorage() {
  if (typeof window === "undefined") {
    return { ...DEFAULT_DRAFT };
  }

  try {
    const rawDraft = window.sessionStorage.getItem(PRODUCT_DRAFT_STORAGE_KEY);
    if (!rawDraft) {
      return { ...DEFAULT_DRAFT };
    }

    return {
      ...DEFAULT_DRAFT,
      ...JSON.parse(rawDraft),
    };
  } catch {
    return { ...DEFAULT_DRAFT };
  }
}

/**
 * @param {typeof DEFAULT_DRAFT} draft
 */
function saveDraftToStorage(draft) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PRODUCT_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

/**
 * @param {string[]} value
 * @returns {string}
 */
function encodeCurlyList(value) {
  return JSON.stringify(value || []).replaceAll("[", "{").replaceAll("]", "}");
}

/**
 * @returns {{
 * draft: typeof DEFAULT_DRAFT,
 * selection: { category: any | null, subCategory: any | null, itemSubCategory: any | null },
 * isBookCategory: boolean,
 * updateDraft: (patch: Partial<typeof DEFAULT_DRAFT>) => void,
 * resetDraft: () => void,
 * syncSelectionFromUrl: () => void,
 * buildQuery: (patch?: Record<string, string>) => Record<string, string>,
 * requiredSelectionReady: boolean,
 * validateInfoStep: () => string[],
 * buildSingleProductPayload: (images: Array<{ base64: string, filename: string }>) => Record<string, unknown>,
 * buildVariantProductPayload: () => Record<string, unknown>,
 * gstOptions: typeof PRODUCT_GST_OPTIONS,
 * shipZonesPreset: typeof PRODUCT_SHIP_ZONES,
 * shipExZonesPreset: typeof PRODUCT_SHIP_EX_ZONES,
 * addKeyword: (value: string) => string,
 * removeKeyword: (value: string) => void,
 * addAttribute: () => void,
 * updateAttribute: (id: number, key: "key" | "value", value: string) => void,
 * removeAttribute: (id: number) => void,
 * addVariation: (value: Record<string, string>) => string[],
 * removeVariation: (id: number) => void,
 * routeToStep: (step: string, patch?: Record<string, string>) => Promise<boolean>,
 * clearVariantState: () => void,
 * clearSelectionState: () => void,
 * getSelectionSummary: () => string,
 * routerReady: boolean,
 * router: import("next/router").NextRouter,
 * }}
 */
export function useProductListingDraft() {
  const router = useRouter();
  const [storedDraft, setDraft] = useState(readDraftFromStorage);

  const routeDraft = useMemo(
    () => ({
      categorySlug: firstQueryValue(router.query.category),
      subCategorySlug: firstQueryValue(router.query["sub-category"]),
      itemSubCategorySlug: firstQueryValue(router.query.item),
      listingMode: firstQueryValue(router.query["listing-mode"]),
      variantMode: firstQueryValue(router.query["variant-mode"]),
      variantType: firstQueryValue(router.query["variation-type"]),
    }),
    [router.query],
  );

  const draft = useMemo(
    () => ({
      ...storedDraft,
      categorySlug: routeDraft.categorySlug || storedDraft.categorySlug,
      subCategorySlug: routeDraft.subCategorySlug || storedDraft.subCategorySlug,
      itemSubCategorySlug:
        routeDraft.itemSubCategorySlug || storedDraft.itemSubCategorySlug,
      listingMode: routeDraft.listingMode || storedDraft.listingMode,
      variantMode: routeDraft.variantMode || storedDraft.variantMode,
      variantType: routeDraft.variantType || storedDraft.variantType,
    }),
    [routeDraft, storedDraft],
  );

  useEffect(() => {
    saveDraftToStorage(storedDraft);
  }, [storedDraft]);

  const selection = useMemo(
    () =>
      resolveProductSelection({
        categorySlug: draft.categorySlug,
        subCategorySlug: draft.subCategorySlug,
        itemSubCategorySlug: draft.itemSubCategorySlug,
      }),
    [draft.categorySlug, draft.subCategorySlug, draft.itemSubCategorySlug],
  );

  const isBookCategory = selection.subCategory?.id === 50;

  const updateDraft = useCallback((patch) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      ...patch,
    }));
  }, []);

  const clearVariantState = useCallback(() => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      variantType: "",
      variations: [],
    }));
  }, []);

  const clearSelectionState = useCallback(() => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      categorySlug: "",
      subCategorySlug: "",
      itemSubCategorySlug: "",
      variantType: "",
      variations: [],
    }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft({ ...DEFAULT_DRAFT });
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(PRODUCT_DRAFT_STORAGE_KEY);
    }
  }, []);

  const syncSelectionFromUrl = useCallback(() => {
  }, []);

  const buildQuery = useCallback(
    (patch = {}) => {
      const query = {
        category: draft.categorySlug,
        "sub-category": draft.subCategorySlug,
        item: draft.itemSubCategorySlug,
        "listing-mode": draft.listingMode,
        "variant-mode": draft.variantMode,
        "variation-type": draft.variantType,
        ...patch,
      };

      return Object.fromEntries(
        Object.entries(query).filter(([, value]) => Boolean(value)),
      );
    },
    [
      draft.categorySlug,
      draft.subCategorySlug,
      draft.itemSubCategorySlug,
      draft.listingMode,
      draft.variantMode,
      draft.variantType,
    ],
  );

  const routeToStep = useCallback(
    async (step, patch = {}) =>
      router.push({
        pathname: `/products/new/${step}`,
        query: buildQuery(patch),
      }),
    [buildQuery, router],
  );

  const requiredSelectionReady = Boolean(selection.category && selection.subCategory);

  const validateInfoStep = useCallback(() => {
    /** @type {string[]} */
    const errors = [];

    if (!requiredSelectionReady) {
      errors.push("Choose a category and subcategory to continue.");
    }
    if (!draft.title.trim()) {
      errors.push("Product title is required.");
    }
    if (!draft.gstRate) {
      errors.push("GST rate is required.");
    }
    if (!draft.hsnCode.trim()) {
      errors.push("HSN code is required.");
    }
    if (!draft.description.trim()) {
      errors.push("Product description is required.");
    }
    if (!draft.manufacturerValue.trim()) {
      errors.push("Manufacturer name is required.");
    }
    if (!draft.originCountryValue.trim()) {
      errors.push("Country of origin is required.");
    }
    if (!isBookCategory && !draft.brand.trim()) {
      errors.push("Brand name is required.");
    }
    if (isBookCategory && !draft.publisher.trim()) {
      errors.push("Publisher name is required.");
    }

    if (draft.variantMode === "without-variant") {
      if (!draft.mrp.trim()) {
        errors.push("MRP is required.");
      }
      if (!draft.price.trim()) {
        errors.push("Selling price is required.");
      }
      if (!draft.skuCode.trim()) {
        errors.push("SKU code is required.");
      }
      if (
        Number(draft.price || 0) > 0 &&
        Number(draft.mrp || 0) > 0 &&
        Number(draft.price) > Number(draft.mrp)
      ) {
        errors.push("Selling price should be lower than MRP.");
      }
    }

    if (draft.variantMode === "with-variant" && !draft.variations.length) {
      errors.push("Add at least one variation.");
    }

    return errors;
  }, [draft, isBookCategory, requiredSelectionReady]);

  const addKeyword = useCallback((value) => {
    const nextKeyword = value.trim();
    if (nextKeyword.length < 3) {
      return "Minimum 3 characters.";
    }
    if (nextKeyword.length > 10) {
      return "Maximum 10 characters.";
    }
    if (draft.keywords.includes(nextKeyword)) {
      return "Keyword already added.";
    }
    if (draft.keywords.length >= 5) {
      return "Maximum 5 keywords permitted.";
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      keywords: [...currentDraft.keywords, nextKeyword],
    }));

    return "";
  }, [draft.keywords]);

  const removeKeyword = useCallback((value) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      keywords: currentDraft.keywords.filter((keyword) => keyword !== value),
    }));
  }, []);

  const addAttribute = useCallback(() => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      attributes: [
        ...currentDraft.attributes,
        {
          id: Date.now(),
          key: "",
          value: "",
        },
      ],
    }));
  }, []);

  const updateAttribute = useCallback((id, key, value) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      attributes: currentDraft.attributes.map((attribute) =>
        attribute.id === id
          ? {
              ...attribute,
              [key]: value,
            }
          : attribute,
      ),
    }));
  }, []);

  const removeAttribute = useCallback((id) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      attributes: currentDraft.attributes.filter((attribute) => attribute.id !== id),
    }));
  }, []);

  const addVariation = useCallback(
    (value) => {
      /** @type {string[]} */
      const errors = [];

      if (!draft.variantType) {
        errors.push("Choose a variation type first.");
      }
      if (!value.name.trim()) {
        errors.push("Variation name is required.");
      }
      if (!value.typeMap.trim()) {
        errors.push("Variation mapping is required.");
      }
      if (!value.mrp.trim() || !value.price.trim()) {
        errors.push("Variation price and MRP are required.");
      }
      if (Number(value.price || 0) > Number(value.mrp || 0)) {
        errors.push("Variation selling price should be lower than MRP.");
      }
      if (
        draft.variations.some(
          (variation) =>
            variation.variationTypes[0]?.typeMap === value.typeMap &&
            variation.variants === draft.variantType,
        )
      ) {
        errors.push("Avoid using the same type map twice.");
      }

      if (errors.length) {
        return errors;
      }

      setDraft((currentDraft) => ({
        ...currentDraft,
        variations: [
          ...currentDraft.variations,
          {
            id: Date.now(),
            price: Number(value.price),
            mrp: Number(value.mrp),
            inStock: value.stock || "S",
            maxStock: value.stock === "S" ? Number(value.maxStock || 1) : 0,
            variationSkuCode: value.variationSkuCode,
            variants: currentDraft.variantType,
            variationTypes: [
              {
                id: 1,
                name: value.name.trim(),
                typeMap: value.typeMap.trim(),
              },
            ],
          },
        ],
      }));

      return [];
    },
    [draft.variantType, draft.variations],
  );

  const removeVariation = useCallback((id) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      variations: currentDraft.variations.filter((variation) => variation.id !== id),
    }));
  }, []);

  const buildAttributesPayload = useCallback(() => {
    /** @type {Record<string, string[]>} */
    const attributes = {};

    if (draft.manufacturerValue.trim()) {
      attributes.Manufacturer = [draft.manufacturerValue.trim()];
    }
    if (draft.originCountryValue.trim()) {
      attributes["Country of Origin"] = [draft.originCountryValue.trim()];
    }

    draft.attributes.forEach((attribute) => {
      if (attribute.key.trim() && attribute.value.trim()) {
        attributes[attribute.key.trim()] = [attribute.value.trim()];
      }
    });

    return attributes;
  }, [draft.attributes, draft.manufacturerValue, draft.originCountryValue]);

  const buildBaseInfoPayload = useCallback(() => {
    return {
      cat: selection.category?.id,
      subCat: selection.subCategory?.id,
      itemSub: selection.itemSubCategory?.id || null,
      title: draft.title.trim(),
      hsn: draft.hsnCode.trim(),
      prebook: draft.enablePrebooking,
      shProfile: draft.shippingProfile,
      info: {
        keywords: encodeCurlyList(draft.keywords),
        brand: isBookCategory ? "" : draft.brand.trim(),
        genCert: draft.brandCertificate.trim(),
        publisher: isBookCategory ? draft.publisher.trim() : "",
        desc: draft.description.trim(),
        sku_code: draft.variantMode === "with-variant" ? "" : draft.skuCode.trim(),
        mpn: draft.mpn.trim(),
        taxRate: draft.gstRate,
        condition: draft.condition,
        ship_cost: 0,
        ship_zones: encodeCurlyList(draft.shipZones),
        ship_ex_zones: encodeCurlyList(draft.shipExZones),
        attributes: buildAttributesPayload(),
        video_url: draft.videoUrl.trim(),
        showChart: draft.showSizeChart,
      },
    };
  }, [buildAttributesPayload, draft, isBookCategory, selection]);

  const buildSingleProductPayload = useCallback(
    (images) => {
      const basePayload = buildBaseInfoPayload();

      return {
        cat: basePayload.cat,
        subCat: basePayload.subCat,
        itemSub: basePayload.itemSub,
        title: basePayload.title,
        hsn: draft.hsnCode.trim(),
        maxStock: draft.stock === "S" ? Number(draft.maxStock || 1) : 0,
        shProfile: draft.shippingProfile,
        prebook: draft.enablePrebooking,
        info: {
          ...basePayload.info,
          price: Number(draft.price || 0),
          mrp: Number(draft.mrp || 0),
          in_stock: draft.stock,
          digital: false,
          sku_code: draft.skuCode.trim(),
        },
        images,
      };
    },
    [buildBaseInfoPayload, draft],
  );

  const buildVariantProductPayload = useCallback(() => {
    const basePayload = buildBaseInfoPayload();

      return {
        cat: String(basePayload.cat || ""),
        subCat: String(basePayload.subCat || ""),
        itemSub: basePayload.itemSub ? String(basePayload.itemSub) : "",
        prebook: draft.enablePrebooking,
        title: draft.title.trim(),
        hsn: draft.hsnCode.trim(),
        info: {
          keywords: encodeCurlyList(draft.keywords),
          brand: isBookCategory ? "" : draft.brand.trim(),
          publisher: isBookCategory ? draft.publisher.trim() : "",
        price: draft.variations[0]?.price || 0,
        mrp: draft.variations[0]?.mrp || 0,
        in_stock: "S",
        desc: draft.description.trim(),
        digital: false,
        sku_code: "",
        mpn: draft.mpn.trim(),
        taxRate: draft.gstRate,
        condition: draft.condition,
        ship_cost: 0,
        ship_zones: encodeCurlyList(draft.shipZones),
        ship_ex_zones: encodeCurlyList(draft.shipExZones),
        attributes: buildAttributesPayload(),
        video_url: "",
        showChart: draft.showSizeChart,
      },
      gst: "false",
      variation: draft.variations.map(({ id, ...variation }) => variation),
      shProfile: draft.shippingProfile,
      maxStock: "0",
    };
  }, [buildAttributesPayload, draft, isBookCategory, buildBaseInfoPayload]);

  const getSelectionSummary = useCallback(() => {
    return [selection.category?.name, selection.subCategory?.name, selection.itemSubCategory?.name]
      .filter(Boolean)
      .join(" / ");
  }, [selection.category, selection.subCategory, selection.itemSubCategory]);

  return {
    draft,
    selection,
    isBookCategory,
    updateDraft,
    resetDraft,
    syncSelectionFromUrl,
    buildQuery,
    requiredSelectionReady,
    validateInfoStep,
    buildSingleProductPayload,
    buildVariantProductPayload,
    gstOptions: PRODUCT_GST_OPTIONS,
    shipZonesPreset: PRODUCT_SHIP_ZONES,
    shipExZonesPreset: PRODUCT_SHIP_EX_ZONES,
    addKeyword,
    removeKeyword,
    addAttribute,
    updateAttribute,
    removeAttribute,
    addVariation,
    removeVariation,
    routeToStep,
    clearVariantState,
    clearSelectionState,
    getSelectionSummary,
    routerReady: router.isReady,
    router,
  };
}
