import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductGroupProducts } from "@/src/api/products";
import { normalizePaginatedCollection } from "@/src/utils/product";

function firstValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return typeof value === "string" ? value : "";
}

export function useProductGroupProducts() {
  const router = useRouter();
  const groupId = Number(firstValue(router.query["group-id"]) || 0);

  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [message, setMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async (nextPage = 1, append = false) => {
    if (!groupId) {
      return;
    }

    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setMessage("");
      }
      const data = await fetchProductGroupProducts({ groupId, page: nextPage });
      const collection = normalizePaginatedCollection(data);
      setProducts((current) => (append ? [...current, ...collection.results] : collection.results));
      setCount(collection.count);
      setHasNextPage(Boolean(collection.next) || nextPage * 15 < collection.count);
      setPage(nextPage);
    } catch (error) {
      if (!append) {
        setProducts([]);
        setCount(0);
        setHasNextPage(false);
      }
      setMessage(
        error instanceof Error ? error.message : "Product group items could not be loaded",
      );
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [groupId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProducts(1, false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadProducts]);

  async function loadMore() {
    if (isLoading || isLoadingMore || !hasNextPage) {
      return;
    }

    await loadProducts(page + 1, true);
  }

  return {
    groupId,
    page,
    products,
    count,
    isLoading,
    isLoadingMore,
    message,
    hasNextPage,
    loadMore,
  };
}
