import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { searchProducts } from "@/src/api/products";
import { normalizePaginatedCollection } from "@/src/utils/product";

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
 * @param {any[]} products
 * @param {string} sort
 * @returns {any[]}
 */
function sortProducts(products, sort) {
  const nextProducts = [...products];

  switch (sort) {
    case "latest":
      return nextProducts.sort((left, right) => Number(right?.id || 0) - Number(left?.id || 0));
    case "price-high":
      return nextProducts.sort(
        (left, right) =>
          Number(right?.price || right?.prdtInfo?.price || 0) -
          Number(left?.price || left?.prdtInfo?.price || 0),
      );
    case "price-low":
      return nextProducts.sort(
        (left, right) =>
          Number(left?.price || left?.prdtInfo?.price || 0) -
          Number(right?.price || right?.prdtInfo?.price || 0),
      );
    case "best-rated":
      return nextProducts.sort(
        (left, right) =>
          Number(right?.averageReview || right?.rating || 0) -
          Number(left?.averageReview || left?.rating || 0),
      );
    default:
      return nextProducts;
  }
}

/**
 * @returns {{
 * query: string,
 * label: string,
 * sort: string,
 * page: number,
 * products: any[],
 * isLoading: boolean,
 * message: string,
 * hasNextPage: boolean,
 * hasPreviousPage: boolean,
 * updateRoute: (patch: Record<string, string>) => Promise<void>,
 * }}
 */
export function useProductSearch() {
  const router = useRouter();
  const query = useMemo(() => firstValue(router.query.query), [router.query.query]);
  const label = useMemo(
    () => firstValue(router.query.label) || firstValue(router.query.query),
    [router.query.label, router.query.query],
  );
  const sort = useMemo(
    () => firstValue(router.query.sort) || "relevance",
    [router.query.sort],
  );
  const page = useMemo(
    () => Number(firstValue(router.query.page) || 1),
    [router.query.page],
  );

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadProducts = useCallback(async () => {
    if (!query) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      const data = await searchProducts({
        query,
        page,
      });
      const collection = normalizePaginatedCollection(data);
      setProducts(sortProducts(collection.results, sort));
      setHasNextPage(Boolean(collection.next) || page * 15 < collection.count);
      setHasPreviousPage(Boolean(collection.previous) || page > 1);
    } catch (error) {
      setProducts([]);
      setMessage(error instanceof Error ? error.message : "Search could not be loaded");
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, query, sort]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProducts();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadProducts]);

  async function updateRoute(patch) {
    await router.replace(
      {
        pathname: "/search",
        query: {
          query,
          label,
          sort,
          page: String(page),
          ...patch,
        },
      },
      undefined,
      { shallow: true },
    );
  }

  return {
    query,
    label,
    sort,
    page,
    products,
    isLoading,
    message,
    hasNextPage,
    hasPreviousPage,
    updateRoute,
  };
}
