import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  addProductToFeaturedFeed,
  changeProductStatus,
  deleteExistingProduct,
  deleteExistingVariation,
  fetchProductList,
  removeProductFromFeaturedFeed,
} from "@/src/api/products";
import { getDashboardSession } from "@/src/api/dashboard";
import { logScreenView } from "@/src/api/analytics";
import { normalizePaginatedCollection } from "@/src/utils/product";
import {
  getItemSubCategories,
  getProductCategories,
  getSubCategories,
} from "@/src/data/product-catalog";

const DEFAULT_QUERY = {
  tab: "active",
  page: "1",
  category: "",
  "sub-category": "",
  item: "",
};

/**
 * @param {string | string[] | undefined} value
 * @returns {string}
 */
function firstValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return typeof value === "string" ? value : "";
}

/**
 * @returns {{
 * filters: Record<string, string>,
 * categories: any[],
 * subCategories: any[],
 * itemSubCategories: any[],
 * searchInput: string,
 * setSearchInput: (value: string) => void,
 * products: any[],
 * isLoading: boolean,
 * isRefreshing: boolean,
 * message: string,
 * count: number,
 * hasNextPage: boolean,
 * hasPreviousPage: boolean,
 * updateFilters: (patch: Record<string, string>) => Promise<void>,
 * submitSearch: () => Promise<void>,
 * goToPage: (page: number) => Promise<void>,
 * archiveProduct: (slug: string) => Promise<void>,
 * restoreProduct: (slug: string) => Promise<void>,
 * hideProduct: (slug: string) => Promise<void>,
 * deleteProduct: (slug: string) => Promise<void>,
 * deleteVariation: (variationId: number) => Promise<void>,
 * addToPromotionFeed: (slug: string, type: number) => Promise<void>,
 * removeFromPromotionFeed: (slug: string) => Promise<void>,
 * loadingSlug: string,
 * router: import("next/router").NextRouter,
 * }}
 */
export function useProductList() {
  const router = useRouter();
  const filters = useMemo(
    () => ({
      tab: firstValue(router.query.tab) || DEFAULT_QUERY.tab,
      page: firstValue(router.query.page) || DEFAULT_QUERY.page,
      category: firstValue(router.query.category) || DEFAULT_QUERY.category,
      "sub-category":
        firstValue(router.query["sub-category"]) || DEFAULT_QUERY["sub-category"],
      item: firstValue(router.query.item) || DEFAULT_QUERY.item,
    }),
    [router.query],
  );

  const categories = useMemo(() => getProductCategories(), []);
  const subCategories = useMemo(
    () => getSubCategories(filters.category),
    [filters.category],
  );
  const subCategorySlug = filters["sub-category"];
  const itemSubCategories = useMemo(
    () => getItemSubCategories(filters.category, subCategorySlug),
    [filters.category, subCategorySlug],
  );

  const [searchInput, setSearchInput] = useState("");
  const [rawProducts, setRawProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingSlug, setLoadingSlug] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setMessage("");
      setIsLoading(true);

      const data = await fetchProductList({
        tab: filters.tab,
        page: Number(filters.page || 1),
        category: filters.category,
        subCategory: filters["sub-category"],
        item: filters.item,
      });

      const collection = normalizePaginatedCollection(data);
      setRawProducts(collection.results);
      setCount(collection.count);
      setHasNextPage(Boolean(collection.next) || Number(filters.page || 1) * 15 < collection.count);
      setHasPreviousPage(Boolean(collection.previous) || Number(filters.page || 1) > 1);

      const session = getDashboardSession();
      logScreenView(
        "products_list",
        session.storeUrl || "Anonymous",
        "store",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product list could not be loaded");
      setRawProducts([]);
      setCount(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const products = useMemo(() => {
    const needle = searchInput.trim().toLowerCase();

    if (!needle) {
      return rawProducts;
    }

    return rawProducts.filter((product) => {
      const title = String(product?.title || "").toLowerCase();
      const brand = String(product?.brand || product?.brd || "").toLowerCase();
      const slug = String(product?.slug || "").toLowerCase();
      const productCode = String(
        product?.productCode || product?.product_code || product?.prdtCode || "",
      ).toLowerCase();

      return (
        title.includes(needle) ||
        brand.includes(needle) ||
        slug.includes(needle) ||
        productCode.includes(needle)
      );
    });
  }, [rawProducts, searchInput]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProducts();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadProducts]);

  async function updateFilters(patch) {
    setIsRefreshing(true);

    try {
      await router.replace(
        {
          pathname: "/products-list",
          query: Object.fromEntries(
            Object.entries({
              ...filters,
              ...patch,
            }).filter(([, value]) => value),
          ),
        },
        undefined,
        { shallow: true },
      );
    } finally {
      setIsRefreshing(false);
    }
  }

  async function submitSearch() {
    const nextQuery = searchInput.trim();

    if (!nextQuery) {
      setMessage("Enter a product keyword to search.");
      return;
    }

    await router.push({
      pathname: "/search-title",
      query: {
        query: nextQuery,
      },
    });
  }

  async function goToPage(page) {
    await updateFilters({
      page: String(page),
    });
  }

  async function changeStatus(slug, action) {
    try {
      setLoadingSlug(slug);
      setMessage("");
      await changeProductStatus({ slug, action });
      setMessage(
        action === "restore"
          ? "Product restored successfully."
          : "Product status updated successfully.",
      );
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product status update failed");
    } finally {
      setLoadingSlug("");
    }
  }

  async function deleteVariation(variationId) {
    try {
      setMessage("");
      setLoadingSlug(`variation-${variationId}`);
      await deleteExistingVariation({ variationId });
      setMessage("Variation deleted successfully.");
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Variation could not be deleted");
    } finally {
      setLoadingSlug("");
    }
  }

  async function deleteProduct(slug) {
    if (typeof window !== "undefined" && !window.confirm("Delete this product permanently?")) {
      return;
    }

    try {
      setMessage("");
      setLoadingSlug(`delete:${slug}`);
      await deleteExistingProduct({ slug });
      setMessage("Product deleted successfully.");
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product could not be deleted");
    } finally {
      setLoadingSlug("");
    }
  }

  async function addToPromotionFeed(slug, type) {
    try {
      setMessage("");
      setLoadingSlug(`promotion:${slug}:${type}`);
      await addProductToFeaturedFeed({ slug, type });
      setMessage(
        type === 0
          ? "Added to Top products."
          : type === 1
            ? "Added to Featured products."
            : "Added to Daily Deals.",
      );
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product could not be promoted");
    } finally {
      setLoadingSlug("");
    }
  }

  async function removeFromPromotionFeed(slug) {
    try {
      setMessage("");
      setLoadingSlug(`promotion-remove:${slug}`);
      await removeProductFromFeaturedFeed({ slug });
      setMessage("Product removed from promotional feed.");
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Promotion could not be updated");
    } finally {
      setLoadingSlug("");
    }
  }

  return {
    filters,
    categories,
    subCategories,
    itemSubCategories,
    searchInput,
    setSearchInput,
    products,
    isLoading,
    isRefreshing,
    message,
    count,
    hasNextPage,
    hasPreviousPage,
    updateFilters,
    submitSearch,
    goToPage,
    archiveProduct: (slug) => changeStatus(slug, "archive"),
    restoreProduct: (slug) => changeStatus(slug, "restore"),
    hideProduct: (slug) => changeStatus(slug, "hide"),
    deleteProduct,
    deleteVariation,
    addToPromotionFeed,
    removeFromPromotionFeed,
    loadingSlug,
    router,
  };
}
