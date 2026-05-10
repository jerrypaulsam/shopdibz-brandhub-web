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
  const page = Number(firstQueryValue(router.query.page) || 1);
  const activeTab = useMemo(() => resolveOrderTab(tabSlug), [tabSlug]);

  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchOrderList({
        tab: activeTab.slug,
        page,
      });
      const collection = normalizeOrderCollection(data);
      setOrders(collection.results);
      setCount(collection.count);
      setHasNextPage(Boolean(collection.next) || page * 15 < collection.count);
      setHasPreviousPage(Boolean(collection.previous) || page > 1);
    } catch (error) {
      setOrders([]);
      setCount(0);
      setHasNextPage(false);
      setHasPreviousPage(false);
      setMessage(
        error instanceof Error ? error.message : "Orders could not be loaded",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeTab.slug, page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadOrders();
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

  async function goToPage(nextPage) {
    await router.replace(
      {
        pathname: "/orders-list",
        query: {
          tab: activeTab.slug,
          ...(nextPage > 1 ? { page: String(nextPage) } : {}),
        },
      },
      undefined,
      { shallow: true },
    );
  }

  return {
    activeTab,
    page,
    orders,
    count,
    isLoading,
    message,
    hasNextPage,
    hasPreviousPage,
    setTab,
    goToPage,
  };
}
