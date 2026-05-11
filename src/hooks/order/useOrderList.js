import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchOrderList } from "@/src/api/orders";
import { getDashboardSession } from "@/src/api/dashboard";
import { logScreenView } from "@/src/api/analytics";
import {
  firstQueryValue,
  normalizeOrderCollection,
  resolveOrderTab,
} from "@/src/utils/orders";

export function useOrderList() {
  const router = useRouter();
  const tabSlug = firstQueryValue(router.query.tab) || "pending";
  const activeTab = useMemo(() => resolveOrderTab(tabSlug), [tabSlug]);

  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [message, setMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(async (nextPage = 1, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setMessage("");
      }
      const data = await fetchOrderList({
        tab: activeTab.slug,
        page: nextPage,
      });
      const collection = normalizeOrderCollection(data);
      setOrders((current) =>
        append ? [...current, ...collection.results] : collection.results,
      );
      setCount(collection.count);
      setHasNextPage(Boolean(collection.next) || nextPage * 15 < collection.count);
      setPage(nextPage);
    } catch (error) {
      if (!append) {
        setOrders([]);
        setCount(0);
        setHasNextPage(false);
      }
      setMessage(
        error instanceof Error ? error.message : "Orders could not be loaded",
      );
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [activeTab.slug]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadOrders(1, false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadOrders]);

  useEffect(() => {
    const session = getDashboardSession();

    logScreenView(
      "order_tab_screen",
      session.storeUrl || "Anonymous",
      "store",
    );
  }, []);

  async function setTab(nextTab) {
    const resolvedTab = resolveOrderTab(nextTab);
    await router.replace(
      {
        pathname: "/orders-list",
        query: {
          tab: resolvedTab.slug,
        },
      },
      undefined,
      { shallow: true },
    );
  }

  async function loadMore() {
    if (isLoading || isLoadingMore || !hasNextPage) {
      return;
    }

    await loadOrders(page + 1, true);
  }

  return {
    activeTab,
    page,
    orders,
    count,
    isLoading,
    isLoadingMore,
    message,
    hasNextPage,
    setTab,
    loadMore,
  };
}
