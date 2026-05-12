/**
 * @param {string[]} value
 * @returns {string}
 */
export function encodePseudoArray(value) {
  return JSON.stringify(value || []).replaceAll("[", "{").replaceAll("]", "}");
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function parsePseudoArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  try {
    const normalized = String(value)
      .replaceAll("'", '"')
      .replaceAll("{", "[")
      .replaceAll("}", "]");
    const parsed = JSON.parse(normalized);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item));
    }

    return [];
  } catch {
    return [];
  }
}

/**
 * @param {unknown} value
 * @returns {Record<string, string[]>}
 */
export function parseProductAttributes(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, attributeValue]) => [
      key,
      Array.isArray(attributeValue)
        ? attributeValue.map((item) => String(item))
        : [String(attributeValue)],
    ]),
  );
}

/**
 * @param {Record<string, string[]>} value
 * @returns {Array<{ id: number, key: string, value: string }>}
 */
export function attributeMapToRows(value) {
  return Object.entries(value)
    .filter(([key]) => key !== "Manufacturer" && key !== "Country of Origin")
    .map(([key, attributeValue], index) => ({
      id: Date.now() + index,
      key,
      value: Array.isArray(attributeValue) ? String(attributeValue[0] || "") : "",
    }));
}

/**
 * @param {Array<{ id: number, key: string, value: string }>} attributes
 * @param {string} manufacturerValue
 * @param {string} originCountryValue
 * @returns {Record<string, string[]>}
 */
export function buildAttributePayload(attributes, manufacturerValue, originCountryValue) {
  /** @type {Record<string, string[]>} */
  const result = {};

  if (manufacturerValue.trim()) {
    result.Manufacturer = [manufacturerValue.trim()];
  }

  if (originCountryValue.trim()) {
    result["Country of Origin"] = [originCountryValue.trim()];
  }

  attributes.forEach((attribute) => {
    if (attribute.key.trim() && attribute.value.trim()) {
      result[attribute.key.trim()] = [attribute.value.trim()];
    }
  });

  return result;
}

/**
 * @param {Array<any>} variations
 * @param {string | number | undefined} variationId
 * @returns {any | null}
 */
export function resolveActiveVariation(variations, variationId) {
  if (!variations?.length) {
    return null;
  }

  const numericVariationId = Number(variationId || 0);

  return (
    variations.find((variation) => Number(variation.id) === numericVariationId) ||
    variations[0] ||
    null
  );
}

/**
 * @param {any} value
 * @returns {{ results: any[], next: boolean | string, previous: boolean | string, count: number }}
 */
export function normalizePaginatedCollection(value) {
  const results =
    value?.results ||
    value?.data?.results ||
    value?.data ||
    value?.products ||
    value?.items ||
    value?.list ||
    [];

  return {
    results: Array.isArray(results) ? results : [],
    next: value?.next || value?.data?.next || false,
    previous: value?.previous || value?.data?.previous || false,
    count: Number(
      value?.count ||
        value?.data?.count ||
        (Array.isArray(results) ? results.length : 0),
    ),
  };
}

/**
 * @param {any} value
 * @returns {any[]}
 */
export function normalizeProductGroupList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.results)) {
    return value.results;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

/**
 * @param {any} value
 * @returns {string}
 */
export function normalizeRemoteAssetUrl(value) {
  const resolved = String(value || "").trim();

  if (!resolved || resolved === "/" || resolved.toLowerCase() === "null" || resolved.toLowerCase() === "undefined") {
    return "";
  }

  if (resolved.startsWith("https://") || resolved.startsWith("http://")) {
    return resolved;
  }

  if (resolved.startsWith("//")) {
    return `https:${resolved}`;
  }

  if (resolved.startsWith("/media/")) {
    return `https://www.shopdibz.com${resolved}`;
  }

  if (resolved.startsWith("media/")) {
    return `https://www.shopdibz.com/${resolved}`;
  }

  return resolved;
}

/**
 * @param {any} product
 * @returns {string}
 */
export function getProductPrimaryImage(product) {
  if (product?.image || product?.img) {
    return String(product?.image || product?.img || "");
  }

  const gallery =
    product?.prdtImg ||
    product?.images ||
    product?.product_images ||
    product?.gallery ||
    [];

  if (Array.isArray(gallery) && gallery.length) {
    return String(
      gallery.find((image) => image?.cover)?.images ||
        gallery[0]?.images ||
        gallery[0]?.image ||
        gallery[0]?.url ||
        "",
    );
  }

  const variations = product?.prdtVari || product?.productVariations || product?.variations || [];

  if (Array.isArray(variations) && variations.length) {
    const firstVariation = variations[0];
    const variationImages = firstVariation?.imgs || firstVariation?.images || [];

    if (variationImages.length) {
      return String(
        variationImages.find((image) => image?.cover)?.images ||
          variationImages[0]?.images ||
          variationImages[0]?.image ||
          variationImages[0]?.url ||
          "",
      );
    }
  }

  return "";
}

/**
 * @param {any} product
 * @returns {{ minPrice: number, maxPrice: number, minMrp: number, maxMrp: number }}
 */
export function getProductPriceRange(product) {
  const variations = product?.prdtVari || product?.productVariations || product?.variations || [];

  if (Array.isArray(variations) && variations.length) {
    const prices = variations.map((variation) => Number(variation?.price || 0));
    const mrps = variations.map((variation) => Number(variation?.mrp || 0));

    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      minMrp: Math.min(...mrps),
      maxMrp: Math.max(...mrps),
    };
  }

  return {
    minPrice: Number(product?.prdtInfo?.price || product?.price || 0),
    maxPrice: Number(product?.prdtInfo?.price || product?.price || 0),
    minMrp: Number(product?.prdtInfo?.mrp || product?.mrp || 0),
    maxMrp: Number(product?.prdtInfo?.mrp || product?.mrp || 0),
  };
}

/**
 * @param {any} product
 * @returns {string}
 */
export function getProductCategoryTrail(product) {
  const parts = [
    product?.catName || product?.category?.name || product?.categoryName,
    product?.subCatName || product?.subCategory?.name || product?.subcategoryName,
    product?.itemSubName || product?.itemSubCategory?.name || product?.itemName,
  ].filter(Boolean);

  return parts.join(" / ");
}

/**
 * @param {any} product
 * @returns {number}
 */
export function getProductStockValue(product) {
  const directStock = Number(product?.mStock || product?.stock || 0);

  if (directStock > 0) {
    return directStock;
  }

  const variations = product?.prdtVari || product?.productVariations || product?.variations || [];

  if (Array.isArray(variations) && variations.length) {
    return variations.reduce(
      (sum, variation) => sum + Number(variation?.mStock || variation?.stock || 0),
      0,
    );
  }

  return 0;
}

/**
 * @param {any} product
 * @returns {string}
 */
export function getProductTitle(product) {
  return String(product?.title || product?.tit || product?.name || "Untitled Product");
}

/**
 * @param {any} product
 * @returns {string}
 */
export function getProductCode(product) {
  return String(
    product?.productCode ||
      product?.pCode ||
      product?.product_code ||
      product?.prdtCode ||
      "",
  );
}

/**
 * @param {any} product
 * @returns {number}
 */
export function getProductRating(product) {
  return Number(product?.averageReview ?? product?.rating ?? product?.rat ?? 0);
}

/**
 * @param {any} product
 * @returns {number}
 */
export function getProductReviewCount(product) {
  return Number(product?.countReview ?? product?.rCount ?? product?.rCnt ?? product?.reviewCount ?? 0);
}

/**
 * @param {any} product
 * @returns {boolean}
 */
export function getProductHasVariants(product) {
  return Boolean(product?.variants ?? product?.var ?? false);
}

/**
 * @param {any} product
 * @returns {boolean}
 */
export function getProductApprovalStatus(product) {
  return Boolean(product?.approved ?? product?.aprvd ?? false);
}

/**
 * @param {any} product
 * @returns {Array<any>}
 */
export function getProductVariations(product) {
  return Array.isArray(product?.productVariations)
    ? product.productVariations
    : Array.isArray(product?.prdtVari)
      ? product.prdtVari
      : Array.isArray(product?.variations)
        ? product.variations
        : [];
}

/**
 * @param {any} variation
 * @returns {string}
 */
export function getVariationCode(variation) {
  return String(variation?.variationCode || variation?.varCode || "");
}

/**
 * @param {any} variation
 * @returns {string}
 */
export function getVariationLabel(variation) {
  return titleCaseValue(variation?.variation || variation?.vAtion || "Variation");
}

/**
 * @param {any} variation
 * @returns {string[]}
 */
export function getVariationTypeNames(variation) {
  const variationTypes = Array.isArray(variation?.variationTypes)
    ? variation.variationTypes
    : Array.isArray(variation?.vTypes)
      ? variation.vTypes
      : [];

  return variationTypes
    .map((item) => String(item?.name || item?.tMap || "").trim())
    .filter(Boolean);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function titleCaseValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

/**
 * @param {any} variation
 * @returns {{ price: number, mrp: number }}
 */
export function getVariationPriceInfo(variation) {
  return {
    price: Number(variation?.price || variation?.prc || 0),
    mrp: Number(variation?.mrp || variation?.mPrice || 0),
  };
}

/**
 * @param {any} value
 * @returns {Array<{ id: string | number, title: string, slug: string, count: number }>}
 */
export function normalizeSearchTitleCollection(value) {
  const rawList =
    value?.results ||
    value?.titles ||
    value?.data?.results ||
    value?.data?.titles ||
    value?.data ||
    [];

  if (!Array.isArray(rawList)) {
    return [];
  }

  return rawList
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `${item}-${index}`,
          title: item,
          slug: "",
          count: 0,
        };
      }

      const title =
        item?.title || item?.name || item?.label || item?.keyword || item?.query || "";

      return {
        id: item?.id || `${title}-${index}`,
        title,
        slug: item?.slug || "",
        count: Number(item?.count || item?.productCount || 0),
      };
    })
    .filter((item) => item.title);
}
