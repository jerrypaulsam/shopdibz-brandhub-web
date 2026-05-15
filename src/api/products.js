import { getDashboardSession } from "./dashboard";
import { resolveApiErrorMessage } from "./error";

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
      resolveApiErrorMessage({
        status: response.status,
        data,
        fallback: "Product request failed",
        notFound: "Product unavailable.",
      }),
    );
  }

  return data;
}

/**
 * @param {string} url
 * @param {{ query?: Record<string, string | number>, accessToken?: string }} options
 * @returns {Promise<any>}
 */
async function getProductJson(url, options = {}) {
  const search = new URLSearchParams();

  Object.entries(options.query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const response = await fetch(`${url}${search.toString() ? `?${search.toString()}` : ""}`, {
    headers: options.accessToken
      ? {
          Authorization: `Bearer ${options.accessToken}`,
        }
      : undefined,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      resolveApiErrorMessage({
        status: response.status,
        data,
        fallback: "Product request failed",
        notFound: "Product unavailable.",
      }),
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
  return getProductJson("/api/products/detail", {
    accessToken: session.accessToken,
    query: {
      slug,
    },
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
export function updateProductCategory(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/update-category", {
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
 * @param {{ slug: string }} payload
 * @returns {Promise<any>}
 */
export function deleteExistingProduct(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/delete", {
    accessToken: session.accessToken,
    slug: payload.slug,
  });
}

/**
 * @param {{ slug: string, type: number }} payload
 * @returns {Promise<any>}
 */
export function addProductToFeaturedFeed(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/featured-status", {
    accessToken: session.accessToken,
    slug: payload.slug,
    action: "add",
    type: payload.type,
  });
}

/**
 * @param {{ slug: string }} payload
 * @returns {Promise<any>}
 */
export function removeProductFromFeaturedFeed(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/products/featured-status", {
    accessToken: session.accessToken,
    slug: payload.slug,
    action: "remove",
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
  return getProductJson("/api/products/list", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
      tab: payload.tab || "active",
      page: String(payload.page || 1),
      category: payload.category || "",
      subCategory: payload.subCategory || "",
      item: payload.item || "",
    },
  });
}

/**
 * @param {string} query
 * @returns {Promise<any>}
 */
export function fetchProductSearchTitles(query) {
  const session = getDashboardSession();
  return getProductJson("/api/products/search-title", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
      query,
    },
  });
}

/**
 * @param {{ query: string, page?: number, sort?: string }} payload
 * @returns {Promise<any>}
 */
export function searchProducts(payload) {
  const session = getDashboardSession();
  return getProductJson("/api/products/search", {
    accessToken: session.accessToken,
    query: {
      storeUrl: session.storeUrl,
      query: payload.query,
      page: String(payload.page || 1),
    },
  });
}

/**
 * @param {{ slug: string, page?: number }} payload
 * @returns {Promise<any>}
 */
export function fetchProductReviews(payload) {
  const session = getDashboardSession();
  return getProductJson("/api/products/reviews", {
    accessToken: session.accessToken,
    query: {
      slug: payload.slug,
      page: String(payload.page || 1),
    },
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
  return getProductJson("/api/products/questions", {
    accessToken: session.accessToken,
    query: {
      slug: payload.slug,
      page: String(payload.page || 1),
    },
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
    orderId: payload.orderId,
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
 * @param {{ groupId: number, name: string, active: boolean, show: boolean }} payload
 * @returns {Promise<any>}
 */
export function updateProductGroup(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/store/update-product-group", {
    accessToken: session.accessToken,
    groupId: payload.groupId,
    name: payload.name,
    active: payload.active,
    show: payload.show,
  });
}

/**
 * @param {{ groupId: number, imageBase64: string, fileName: string }} payload
 * @returns {Promise<any>}
 */
export function updateProductGroupCover(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/store/update-product-group-cover", {
    accessToken: session.accessToken,
    groupId: payload.groupId,
    imageBase64: payload.imageBase64,
    fileName: payload.fileName,
  });
}

/**
 * @param {{ groupId: number }} payload
 * @returns {Promise<any>}
 */
export function deleteProductGroup(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/store/delete-product-group", {
    accessToken: session.accessToken,
    groupId: payload.groupId,
  });
}

/**
 * @param {{ groupId: number, fileBase64: string, fileName: string }} payload
 * @returns {Promise<any>}
 */
export function uploadProductGroupSheet(payload) {
  const session = getDashboardSession();
  return postProductJson("/api/store/product-group-bulk-upload", {
    accessToken: session.accessToken,
    storeUrl: session.storeUrl,
    groupId: payload.groupId,
    fileBase64: payload.fileBase64,
    fileName: payload.fileName,
  });
}

/**
 * @param {{ groupId: number, page?: number }} payload
 * @returns {Promise<any>}
 */
export function fetchProductGroupProducts(payload) {
  const session = getDashboardSession();
  return getProductJson("/api/products/group-products", {
    accessToken: session.accessToken,
    query: {
      groupId: String(payload.groupId),
      page: String(payload.page || 1),
    },
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
