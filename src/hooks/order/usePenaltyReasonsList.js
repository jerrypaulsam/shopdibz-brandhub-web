import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchPenaltyReasons } from "@/src/api/orders";
import { getDashboardSession } from "@/src/api/dashboard";
import { logScreenView } from "@/src/api/analytics";
import { firstQueryValue, normalizeOrderCollection } from "@/src/utils/orders";

export function usePenaltyReasonsList() {
  const router = useRouter();
  const page = Number(firstQueryValue(router.query.page) || 1);

  const [reasons, setReasons] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadReasons = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchPenaltyReasons({ page });
      const collection = normalizeOrderCollection(data);
      setReasons(collection.results);
      setCount(collection.count);
      setHasNextPage(Boolean(collection.next) || page * 15 < collection.count);
      setHasPreviousPage(Boolean(collection.previous) || page > 1);
    } catch (error) {
      setReasons([]);
      setCount(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Penalty reasons could not be loaded",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadReasons();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadReasons]);

  useEffect(() => {
    const session = getDashboardSession();

    logScreenView(
      "penalty_reasons",
      session.storeUrl || "Anonymous",
      "store",
    );
  }, []);

  async function goToPage(nextPage) {
    await router.replace(
      {
        pathname: "/penalty-reasons",
        query: nextPage > 1 ? { page: String(nextPage) } : {},
      },
      undefined,
      { shallow: true },
    );
  }

  return {
    page,
    reasons,
    count,
    isLoading,
    message,
    hasNextPage,
    hasPreviousPage,
    goToPage,
  };
}
