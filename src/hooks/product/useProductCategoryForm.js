import { useMemo, useState } from "react";
import { getProductCategories, getSubCategories, getItemSubCategories } from "@/src/data/product-catalog";
import { PRODUCT_VARIANT_MODES } from "@/src/data/product-variation-options";
import { useProductListingDraft } from "./useProductListingDraft";

/**
 * @returns {ReturnType<typeof useProductListingDraft> & {
 * categories: Array<any>,
 * subCategories: Array<any>,
 * itemSubCategories: Array<any>,
 * modeOptions: typeof PRODUCT_VARIANT_MODES,
 * error: string,
 * setError: (value: string) => void,
 * chooseCategory: (value: string) => void,
 * chooseSubCategory: (value: string) => void,
 * chooseItemSubCategory: (value: string) => void,
 * chooseVariantMode: (value: string) => void,
 * chooseListingMode: (value: string) => void,
 * continueToNext: () => Promise<void>,
 * }}
 */
export function useProductCategoryForm() {
  const draftApi = useProductListingDraft();
  const [error, setError] = useState("");

  const categories = useMemo(() => getProductCategories(), []);
  const subCategories = useMemo(
    () => getSubCategories(draftApi.draft.categorySlug),
    [draftApi.draft.categorySlug],
  );
  const itemSubCategories = useMemo(
    () =>
      getItemSubCategories(
        draftApi.draft.categorySlug,
        draftApi.draft.subCategorySlug,
      ),
    [draftApi.draft.categorySlug, draftApi.draft.subCategorySlug],
  );

  function chooseCategory(value) {
    setError("");
    draftApi.updateDraft({
      categorySlug: value,
      subCategorySlug: "",
      itemSubCategorySlug: "",
    });
  }

  function chooseSubCategory(value) {
    setError("");
    draftApi.updateDraft({
      subCategorySlug: value,
      itemSubCategorySlug: "",
    });
  }

  function chooseItemSubCategory(value) {
    setError("");
    draftApi.updateDraft({
      itemSubCategorySlug: value,
    });
  }

  function chooseVariantMode(value) {
    setError("");
    draftApi.updateDraft({
      variantMode: value,
    });

    if (value === "without-variant") {
      draftApi.clearVariantState();
    }
  }

  function chooseListingMode(value) {
    setError("");
    if (value === "bulk") {
      draftApi.updateDraft({
        listingMode: value,
        variantType: "",
        variations: [],
      });
      return;
    }

    draftApi.updateDraft({
      listingMode: value,
    });
  }

  async function continueToNext() {
    if (!draftApi.selection.category || !draftApi.selection.subCategory) {
      setError("Choose a category and subcategory to continue.");
      return;
    }

    if (itemSubCategories.length && !draftApi.selection.itemSubCategory) {
      setError("Choose an item subcategory to continue.");
      return;
    }

    if (draftApi.draft.listingMode === "bulk") {
      await draftApi.routeToStep("bulk");
      return;
    }

    await draftApi.routeToStep("info");
  }

  return {
    ...draftApi,
    categories,
    subCategories,
    itemSubCategories,
    modeOptions: PRODUCT_VARIANT_MODES,
    error,
    setError,
    chooseCategory,
    chooseSubCategory,
    chooseItemSubCategory,
    chooseVariantMode,
    chooseListingMode,
    continueToNext,
  };
}
