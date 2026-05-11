import categoryData from "./product-categories.json";

/**
 * @returns {Array<any>}
 */
export function getProductCategories() {
  return categoryData;
}

/**
 * @param {string} slug
 * @returns {any | null}
 */
export function findCategoryBySlug(slug) {
  return getProductCategories().find((category) => category.slug === slug) || null;
}

/**
 * @param {string} categorySlug
 * @returns {Array<any>}
 */
export function getSubCategories(categorySlug) {
  const category = findCategoryBySlug(categorySlug);
  return category?.sub || [];
}

/**
 * @param {string} categorySlug
 * @param {string} subCategorySlug
 * @returns {any | null}
 */
export function findSubCategoryBySlug(categorySlug, subCategorySlug) {
  return (
    getSubCategories(categorySlug).find(
      (subCategory) => subCategory.slug === subCategorySlug,
    ) || null
  );
}

/**
 * @param {string} categorySlug
 * @param {string} subCategorySlug
 * @returns {Array<any>}
 */
export function getItemSubCategories(categorySlug, subCategorySlug) {
  const subCategory = findSubCategoryBySlug(categorySlug, subCategorySlug);
  return subCategory?.itemSub || [];
}

/**
 * @param {string} categorySlug
 * @param {string} subCategorySlug
 * @param {string} itemSlug
 * @returns {any | null}
 */
export function findItemSubCategoryBySlug(categorySlug, subCategorySlug, itemSlug) {
  return (
    getItemSubCategories(categorySlug, subCategorySlug).find(
      (itemSubCategory) => itemSubCategory.slug === itemSlug,
    ) || null
  );
}

/**
 * @param {{ categorySlug?: string, subCategorySlug?: string, itemSubCategorySlug?: string }} value
 * @returns {{ category: any | null, subCategory: any | null, itemSubCategory: any | null }}
 */
export function resolveProductSelection(value) {
  const category = value.categorySlug ? findCategoryBySlug(value.categorySlug) : null;
  const subCategory =
    category && value.subCategorySlug
      ? findSubCategoryBySlug(value.categorySlug, value.subCategorySlug)
      : null;
  const itemSubCategory =
    subCategory && value.itemSubCategorySlug
      ? findItemSubCategoryBySlug(
          value.categorySlug,
          value.subCategorySlug,
          value.itemSubCategorySlug,
        )
      : null;

  return {
    category,
    subCategory,
    itemSubCategory,
  };
}
