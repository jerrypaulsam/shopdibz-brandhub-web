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
  const page = Number(firstValue(router.query.page) || 1);

  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadProducts = useCallback(async () => {
    if (!groupId) {
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchProductGroupProducts({ groupId, page });
      const collection = normalizePaginatedCollection(data);
      setProducts(collection.results);
      setCount(collection.count);
      setHasNextPage(Boolean(collection.next) || page * 15 < collection.count);
      setHasPreviousPage(Boolean(collection.previous) || page > 1);
    } catch (error) {
      setProducts([]);
      setCount(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
      setMessage(
        error instanceof Error ? error.message : "Product group items could not be loaded",
      );
    } finally {
      setIsLoading(false);
    }
  }, [groupId, page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProducts();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadProducts]);

  async function goToPage(nextPage) {
    await router.replace(
      {
        pathname: `/product-groups/${groupId}`,
        query: nextPage > 1 ? { page: String(nextPage) } : {},
      },
      undefined,
      { shallow: true },
    );
  }

  return {
    groupId,
    page,
    products,
    count,
    isLoading,
    message,
    hasNextPage,
    hasPreviousPage,
    goToPage,
  };
}
