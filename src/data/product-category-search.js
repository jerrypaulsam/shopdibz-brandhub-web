/**
 * @param {string} value
 * @returns {string}
 */
function normalizeSearchValue(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * @param {Array<any>} categories
 * @returns {Array<{
 *   key: string,
 *   categorySlug: string,
 *   subCategorySlug: string,
 *   itemSubCategorySlug: string,
 *   categoryName: string,
 *   subCategoryName: string,
 *   itemSubCategoryName: string,
 *   label: string,
 *   searchText: string,
 * }>}
 */
export function createProductCategoryPathIndex(categories) {
  return (categories || []).flatMap((category) =>
    (category.sub || []).flatMap((subCategory) => {
      const itemSubCategories = subCategory.itemSub || [];

      if (!itemSubCategories.length) {
        const label = [category.name, subCategory.name].filter(Boolean).join(" / ");

        return [
          {
            key: `${category.slug}__${subCategory.slug}`,
            categorySlug: category.slug,
            subCategorySlug: subCategory.slug,
            itemSubCategorySlug: "",
            categoryName: category.name,
            subCategoryName: subCategory.name,
            itemSubCategoryName: "",
            label,
            searchText: normalizeSearchValue(label),
          },
        ];
      }

      return itemSubCategories.map((itemSubCategory) => {
        const label = [
          category.name,
          subCategory.name,
          itemSubCategory.name,
        ]
          .filter(Boolean)
          .join(" / ");

        return {
          key: `${category.slug}__${subCategory.slug}__${itemSubCategory.slug}`,
          categorySlug: category.slug,
          subCategorySlug: subCategory.slug,
          itemSubCategorySlug: itemSubCategory.slug,
          categoryName: category.name,
          subCategoryName: subCategory.name,
          itemSubCategoryName: itemSubCategory.name,
          label,
          searchText: normalizeSearchValue(label),
        };
      });
    }),
  );
}

/**
 * @param {{
 *   categoryName: string,
 *   subCategoryName: string,
 *   itemSubCategoryName: string,
 *   searchText: string,
 * }} path
 * @param {string} normalizedQuery
 * @returns {number}
 */
function scoreProductCategoryPath(path, normalizedQuery) {
  if (!normalizedQuery) {
    return 0;
  }

  const categoryName = normalizeSearchValue(path.categoryName);
  const subCategoryName = normalizeSearchValue(path.subCategoryName);
  const itemSubCategoryName = normalizeSearchValue(path.itemSubCategoryName);
  const queryTokens = normalizedQuery.split(" ").filter(Boolean);

  let score = 0;

  if (path.searchText === normalizedQuery) score += 400;
  if (itemSubCategoryName && itemSubCategoryName === normalizedQuery) score += 260;
  if (subCategoryName === normalizedQuery) score += 220;
  if (categoryName === normalizedQuery) score += 140;
  if (itemSubCategoryName && itemSubCategoryName.startsWith(normalizedQuery)) score += 120;
  if (subCategoryName.startsWith(normalizedQuery)) score += 90;
  if (path.searchText.startsWith(normalizedQuery)) score += 80;
  if (itemSubCategoryName && itemSubCategoryName.includes(normalizedQuery)) score += 70;
  if (subCategoryName.includes(normalizedQuery)) score += 55;
  if (categoryName.includes(normalizedQuery)) score += 35;
  if (path.searchText.includes(normalizedQuery)) score += 30;

  queryTokens.forEach((token) => {
    if (itemSubCategoryName.includes(token)) score += 24;
    if (subCategoryName.includes(token)) score += 16;
    if (categoryName.includes(token)) score += 10;
    if (path.searchText.includes(token)) score += 4;
  });

  return score;
}

/**
 * @param {Array<any>} categories
 * @param {string} query
 * @param {number} [limit=5]
 * @returns {Array<{
 *   key: string,
 *   categorySlug: string,
 *   subCategorySlug: string,
 *   itemSubCategorySlug: string,
 *   categoryName: string,
 *   subCategoryName: string,
 *   itemSubCategoryName: string,
 *   label: string,
 *   searchText: string,
 *   score: number,
 * }>}
 */
export function findProductCategoryPathMatches(categories, query, limit = 5) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return [];
  }

  return createProductCategoryPathIndex(categories)
    .map((path) => ({
      ...path,
      score: scoreProductCategoryPath(path, normalizedQuery),
    }))
    .filter((path) => path.score > 0)
    .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
    .slice(0, limit);
}
