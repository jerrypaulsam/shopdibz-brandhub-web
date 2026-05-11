import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchPaymentBreakdown,
  fetchPaymentList,
  fetchPaymentsStoreInfo,
} from "@/src/api/payments";
import { getDashboardSession } from "@/src/api/dashboard";
import { logScreenView } from "@/src/api/analytics";
import {
  firstPaymentQuery,
  getPaymentStatus,
  normalizePaymentCollection,
  resolvePaymentTab,
  summarizePayments,
} from "@/src/utils/payments";

function filterPaymentsByTab(payments, tabSlug) {
  if (tabSlug === "pending") {
    return payments.filter(
      (payment) => payment?.transactionId == null && payment?.tId == null,
    );
  }

  if (tabSlug === "settled") {
    return payments.filter((payment) => payment?.transactionId != null || payment?.tId != null);
  }

  return payments;
}

export function usePaymentsWorkspace() {
  const router = useRouter();
  const tabSlug = firstPaymentQuery(router.query.tab) || "pending";
  const selectedPaymentId = Number(firstPaymentQuery(router.query.payment) || 0);
  const activeTab = useMemo(() => resolvePaymentTab(tabSlug), [tabSlug]);

  const [allPayments, setAllPayments] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState(null);
  const [storeInfo, setStoreInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isBreakdownLoading, setIsBreakdownLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [breakdownMessage, setBreakdownMessage] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const filteredPayments = useMemo(
    () => filterPaymentsByTab(allPayments, activeTab.slug),
    [activeTab.slug, allPayments],
  );

  const summary = useMemo(
    () => summarizePayments(allPayments),
    [allPayments],
  );

  const selectedPayment = useMemo(
    () =>
      filteredPayments.find(
        (payment) => Number(payment.id) === Number(selectedPaymentId),
      ) || null,
    [filteredPayments, selectedPaymentId],
  );

  const loadPayments = useCallback(async (nextPage = 1, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setMessage("");
      }
      const [paymentData, storeData] = await Promise.all([
        fetchPaymentList({ page: nextPage }),
        fetchPaymentsStoreInfo().catch(() => ({})),
      ]);
      const collection = normalizePaymentCollection(paymentData);
      setAllPayments((current) =>
        append ? [...current, ...collection.results] : collection.results,
      );
      setStoreInfo(storeData || {});
      setHasNextPage(Boolean(collection.next) || nextPage * 15 < collection.count);
      setPage(nextPage);
    } catch (error) {
      if (!append) {
        setAllPayments([]);
        setStoreInfo({});
        setHasNextPage(false);
      }
      setMessage(
        error instanceof Error ? error.message : "Payments could not be loaded",
      );
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const loadBreakdown = useCallback(async () => {
    if (!selectedPaymentId) {
      setPaymentBreakdown(null);
      setBreakdownMessage("");
      return;
    }

    try {
      setIsBreakdownLoading(true);
      setBreakdownMessage("");
      const data = await fetchPaymentBreakdown(selectedPaymentId);
      setPaymentBreakdown(data);
    } catch (error) {
      setPaymentBreakdown(null);
      setBreakdownMessage(
        error instanceof Error
          ? error.message
          : "Fee breakdown could not be loaded",
      );
    } finally {
      setIsBreakdownLoading(false);
    }
  }, [selectedPaymentId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadPayments(1, false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadPayments, activeTab.slug]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadBreakdown();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadBreakdown]);

  useEffect(() => {
    const session = getDashboardSession();

    logScreenView(
      "payment_list_screen",
      session.storeUrl || "Anonymous",
      "store",
    );
  }, []);

  async function setTab(nextTab) {
    const resolved = resolvePaymentTab(nextTab);
    await router.replace(
      {
        pathname: router.pathname,
        query: {
          tab: resolved.slug,
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

    await loadPayments(page + 1, true);
  }

  async function openPayment(paymentId) {
    await router.replace(
      {
        pathname: router.pathname,
        query: {
          tab: activeTab.slug,
          payment: String(paymentId),
        },
      },
      undefined,
      { shallow: true },
    );
  }

  async function closePayment() {
    await router.replace(
      {
        pathname: router.pathname,
        query: {
          tab: activeTab.slug,
        },
      },
      undefined,
      { shallow: true },
    );
  }

  return {
    activeTab,
    page,
    payments: filteredPayments.map((payment) => ({
      ...payment,
      statusLabel: getPaymentStatus(payment),
      transactionId: payment?.transactionId || payment?.tId || null,
      amount: Number(payment?.amount || payment?.amt || 0),
      penalty: Number(payment?.penalty || payment?.pen || 0),
      shipCost: Number(payment?.shipCost || payment?.shCost || 0),
      initiateDate: payment?.initiateDate || payment?.initDate,
      orderId: payment?.orderId || payment?.oId,
    })),
    allPayments,
    selectedPayment,
    summary,
    storeInfo,
    selectedPaymentId,
    paymentBreakdown,
    isLoading,
    isLoadingMore,
    isBreakdownLoading,
    message,
    breakdownMessage,
    hasNextPage,
    setTab,
    loadMore,
    openPayment,
    closePayment,
  };
}
