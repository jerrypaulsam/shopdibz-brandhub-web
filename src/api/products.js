import { getDashboardSession } from "./dashboard";

/**
 * @param {string} url
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
async function postProductJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.message || data?.detail || data?.error || "Product request failed",
    );
  }

  return data;
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
export function createSingleProduct(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/create-single", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
export function createProductWithVariants(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/create-variant", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {{ variants: boolean, fileBase64: string, fileName: string, categoryId: number, subCategoryId: number, itemSubCategoryId?: number }} payload
 * @returns {Promise<any>}
 */
export function createProductsInBulk(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/bulk-create", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {{ variants: boolean, fileBase64: string, fileName: string }} payload
 * @returns {Promise<any>}
 */
export function verifyBulkProductSheet(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/verify-bulk-upload", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {string} slug
 * @returns {Promise<any>}
 */
export function fetchProductDetail(slug) {
  const session = getDashboardSession();
  const query = new URLSearchParams({
    accessToken: session.accessToken,
    slug,
  });

  return fetch(`/api/products/detail?${query.toString()}`).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Product detail request failed");
    }

    return data;
  });
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
export function updateExistingProduct(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/update", {
    accessToken: session.accessToken,
    ...payload,
  });
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
export function updateExistingVariation(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/update-variation", {
    accessToken: session.accessToken,
    ...payload,
  });
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<any>}
 */
export function addNewVariationToProduct(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/add-new-variation", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    ...payload,
  });
}

/**
 * @param {{ slug: string, images: Array<{ base64: string, filename: string }> }} payload
 * @returns {Promise<any>}
 */
export function addFurtherProductImages(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/add-further-images", {
    accessToken: session.accessToken,
    slug: payload.slug,
    images: payload.images,
  });
}

/**
 * @param {{ variationId: number, images: Array<{ base64: string, filename: string }> }} payload
 * @returns {Promise<any>}
 */
export function addVariationImages(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/add-variation-images", {
    accessToken: session.accessToken,
    variationId: payload.variationId,
    images: payload.images,
  });
}

/**
 * @param {{ imageId: number }} payload
 * @returns {Promise<any>}
 */
export function removeExistingProductImage(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/remove-image", {
    accessToken: session.accessToken,
    imageId: payload.imageId,
  });
}

/**
 * @param {{ imageId: number, cover: boolean, imageBase64: string, filename: string }} payload
 * @returns {Promise<any>}
 */
export function replaceExistingProductImage(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/update-image", {
    accessToken: session.accessToken,
    ...payload,
  });
}

/**
 * @param {{ imageId: number }} payload
 * @returns {Promise<any>}
 */
export function makeExistingProductCoverImage(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/make-cover-image", {
    accessToken: session.accessToken,
    imageId: payload.imageId,
  });
}

/**
 * @param {{ variationId: number }} payload
 * @returns {Promise<any>}
 */
export function deleteExistingVariation(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/delete-variation", {
    accessToken: session.accessToken,
    variationId: payload.variationId,
  });
}

/**
 * @param {{ pickupPin: string, deliveryPin: string, weight: string, length: string, width: string, height: string, shippingMode: string }} payload
 * @returns {Promise<any>}
 */
export function calculateShippingRates(payload) {
  return postProductJson("/api/products/shipping-rates", payload);
}

/**
 * @param {{
 * tab?: string,
 * page?: number,
 * category?: string,
 * subCategory?: string,
 * item?: string,
 * }} payload
 * @returns {Promise<any>}
 */
export function fetchProductList(payload = {}) {
  const session = getDashboardSession();
  const query = new URLSearchParams({
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    tab: payload.tab || "active",
    page: String(payload.page || 1),
  });

  [
    ["category", payload.category || ""],
    ["subCategory", payload.subCategory || ""],
    ["item", payload.item || ""],
  ].forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  return fetch(`/api/products/list?${query.toString()}`).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Product list request failed");
    }

    return data;
  });
}

/**
 * @param {string} query
 * @returns {Promise<any>}
 */
export function fetchProductSearchTitles(query) {
  const session = getDashboardSession();
  const search = new URLSearchParams({
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    query,
  });

  return fetch(`/api/products/search-title?${search.toString()}`).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Search suggestion request failed");
    }

    return data;
  });
}

/**
 * @param {{ query: string, page?: number, sort?: string }} payload
 * @returns {Promise<any>}
 */
export function searchProducts(payload) {
  const session = getDashboardSession();
  const search = new URLSearchParams({
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    query: payload.query,
    page: String(payload.page || 1),
  });

  if (payload.sort) {
    search.set("sort", payload.sort);
  }

  return fetch(`/api/products/search?${search.toString()}`).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Search request failed");
    }

    return data;
  });
}

/**
 * @param {{ slug: string, page?: number }} payload
 * @returns {Promise<any>}
 */
export function fetchProductReviews(payload) {
  const session = getDashboardSession();
  const search = new URLSearchParams({
    accessToken: session.accessToken,
    slug: payload.slug,
    page: String(payload.page || 1),
  });

  return fetch(`/api/products/reviews?${search.toString()}`).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Product reviews request failed");
    }

    return data;
  });
}

/**
 * @param {{ reviewId: number, vote: string }} payload
 * @returns {Promise<any>}
 */
export function voteProductReview(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/review-vote", {
    accessToken: session.accessToken,
    reviewId: payload.reviewId,
    vote: payload.vote,
  });
}

/**
 * @param {{ slug: string, page?: number }} payload
 * @returns {Promise<any>}
 */
export function fetchProductQuestions(payload) {
  const session = getDashboardSession();
  const search = new URLSearchParams({
    accessToken: session.accessToken,
    slug: payload.slug,
    page: String(payload.page || 1),
  });

  return fetch(`/api/products/questions?${search.toString()}`).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Product questions request failed");
    }

    return data;
  });
}

/**
 * @param {{ questionId: number, answer: string }} payload
 * @returns {Promise<any>}
 */
export function createProductAnswer(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/create-answer", {
    accessToken: session.accessToken,
    questionId: payload.questionId,
    answer: payload.answer,
  });
}

/**
 * @param {{ answerId: number }} payload
 * @returns {Promise<any>}
 */
export function deleteProductAnswer(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/delete-answer", {
    accessToken: session.accessToken,
    answerId: payload.answerId,
  });
}

/**
 * @param {{ page?: number }} payload
 * @returns {Promise<any>}
 */
export function fetchProductGroups(payload = {}) {
  const session = getDashboardSession();
  return postProductJson("/api/store/product-groups", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    page: payload.page || 1,
  });
}

/**
 * @param {{ groupId: number, page?: number }} payload
 * @returns {Promise<any>}
 */
export function fetchProductGroupProducts(payload) {
  const session = getDashboardSession();
  const search = new URLSearchParams({
    accessToken: session.accessToken,
    groupId: String(payload.groupId),
    page: String(payload.page || 1),
  });

  return fetch(`/api/products/group-products?${search.toString()}`).then(async (response) => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Product group products request failed");
    }

    return data;
  });
}

/**
 * @param {{ slug: string, action: string }} payload
 * @returns {Promise<any>}
 */
export function changeProductStatus(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/change-status", {
    accessToken: session.accessToken,
    slug: payload.slug,
    action: payload.action,
  });
}
