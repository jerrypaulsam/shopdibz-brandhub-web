import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductSearchTitles } from "@/src/api/products";
import { normalizeSearchTitleCollection } from "@/src/utils/product";

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
 * query: string,
 * setQuery: (value: string) => void,
 * suggestions: Array<{ id: string | number, title: string, slug: string, count: number }>,
 * isLoading: boolean,
 * message: string,
 * submitSearch: (value?: string) => Promise<void>,
 * }}
 */
export function useProductSearchTitle() {
  const router = useRouter();
  const routeQuery = useMemo(() => firstValue(router.query.query), [router.query.query]);
  const [query, setQuery] = useState(routeQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setQuery(routeQuery);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [routeQuery]);

  useEffect(() => {
    if (!query.trim()) {
      const timeoutId = window.setTimeout(() => {
        setSuggestions([]);
        setIsLoading(false);
        setMessage("");
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setMessage("");
        const data = await fetchProductSearchTitles(query.trim());
        setSuggestions(normalizeSearchTitleCollection(data));
      } catch (error) {
        setSuggestions([]);
        setMessage(
          error instanceof Error
            ? error.message
            : "Search suggestions could not be loaded",
        );
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  async function submitSearch(value = query) {
    const nextQuery = value.trim();

    if (!nextQuery) {
      setMessage("Enter a product keyword to search.");
      return;
    }

    const requestQuery = nextQuery.startsWith("SHDZ")
      ? nextQuery
      : nextQuery.slice(0, 25);

    await router.push({
      pathname: "/search",
      query: {
        query: requestQuery,
        label: nextQuery,
        page: "1",
        sort: "relevance",
      },
    });
  }

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    message,
    submitSearch,
  };
}
