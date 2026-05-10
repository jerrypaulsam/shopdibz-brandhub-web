import { SHOPDIBZ_URLS } from "@/src/api/config";
import { getStoreJsonWithAuth } from "@/src/api/serverStoreProxy";
import { resolveProductSelection } from "@/src/data/product-catalog";

/**
 * @param {string} value
 * @returns {number}
 */
function toPage(value) {
  const page = Number(value || 1);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const {
    accessToken = "",
    storeUrl = "",
    tab = "active",
    page = "1",
    category = "",
    subCategory = "",
    item = "",
  } = req.query || {};

  if (!accessToken) {
    res.status(400).json({ message: "Access token is required" });
    return;
  }

  const selection = resolveProductSelection({
    categorySlug: String(category || ""),
    subCategorySlug: String(subCategory || ""),
    itemSubCategorySlug: String(item || ""),
  });
  const pageNumber = toPage(String(page));
  const normalizedTab = String(tab || "active");

  if (!storeUrl) {
    res.status(400).json({ message: "Store URL is required" });
    return;
  }

  /** @type {{ endpoint: string, query: Record<string, string | number> }} */
  let requestConfig;

  if (normalizedTab === "pending") {
    requestConfig = {
      endpoint: `${SHOPDIBZ_URLS.products}${storeUrl}/view/`,
      query: {
        page: pageNumber,
        query: "UA",
        cat: selection.category?.id || 0,
        sub: selection.subCategory?.id || 0,
        iSub: selection.itemSubCategory?.id || 0,
      },
    };
  } else if (normalizedTab === "archived") {
    requestConfig = {
      endpoint: `${SHOPDIBZ_URLS.products}store/${storeUrl}/archieved/`,
      query: {
        page: pageNumber,
      },
    };
  } else if (normalizedTab === "out-of-stock") {
    requestConfig = {
      endpoint: `${SHOPDIBZ_URLS.products}store/${storeUrl}/out_of_stock/`,
      query: {
        page: pageNumber,
      },
    };
  } else if (normalizedTab === "top") {
    requestConfig = {
      endpoint: `${SHOPDIBZ_URLS.sellerPanel}${storeUrl}/FTD/`,
      query: {
        key: 0,
        page: pageNumber,
      },
    };
  } else if (normalizedTab === "featured") {
    requestConfig = {
      endpoint: `${SHOPDIBZ_URLS.sellerPanel}${storeUrl}/FTD/`,
      query: {
        key: 1,
        page: pageNumber,
      },
    };
  } else if (normalizedTab === "daily-deals") {
    requestConfig = {
      endpoint: `${SHOPDIBZ_URLS.sellerPanel}${storeUrl}/FTD/`,
      query: {
        key: 2,
        page: pageNumber,
      },
    };
  } else {
    requestConfig = {
      endpoint: `${SHOPDIBZ_URLS.products}${storeUrl}/view/`,
      query: {
        page: pageNumber,
        query: "ALL",
        cat: selection.category?.id || 0,
        sub: selection.subCategory?.id || 0,
        iSub: selection.itemSubCategory?.id || 0,
      },
    };
  }

  const result = await getStoreJsonWithAuth({
    endpoint: requestConfig.endpoint,
    accessToken: String(accessToken),
    query: requestConfig.query,
  });

  res.status(result.status).json(result.data);
}
