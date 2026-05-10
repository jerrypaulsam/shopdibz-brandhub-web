import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { logScreenView } from "@/src/api/analytics";
import { getDashboardSession } from "@/src/api/dashboard";
import { deleteCoupon, fetchCoupons } from "@/src/api/coupons";
import {
  filterAndSortCoupons,
  firstCouponQuery,
  normalizeCoupons,
  resolveCouponSort,
  resolveCouponTab,
  summarizeCouponMetrics,
  summarizeCouponTabs,
} from "@/src/utils/coupons";

const PAGE_SIZE = 12;

export function useCouponList() {
  const router = useRouter();
  const tabSlug = firstCouponQuery(router.query.tab) || "active";
  const sortSlug = firstCouponQuery(router.query.sort) || "ending-soon";
  const search = firstCouponQuery(router.query.search);
  const page = Number(firstCouponQuery(router.query.page) || 1);

  const activeTab = useMemo(() => resolveCouponTab(tabSlug), [tabSlug]);
  const activeSort = useMemo(() => resolveCouponSort(sortSlug), [sortSlug]);

  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isDeletingId, setIsDeletingId] = useState(0);

  const filteredCoupons = useMemo(
    () => filterAndSortCoupons(coupons, activeTab.slug, search, activeSort.slug),
    [activeSort.slug, activeTab.slug, coupons, search],
  );

  const count = filteredCoupons.length;
  const metrics = useMemo(() => summarizeCouponMetrics(coupons), [coupons]);
  const tabSummary = useMemo(() => summarizeCouponTabs(coupons), [coupons]);
  const pageCount = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const safePage = Math.min(Math.max(page, 1), pageCount);

  const pagedCoupons = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE;
    return filteredCoupons.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredCoupons, safePage]);

  const hasNextPage = safePage < pageCount;
  const hasPreviousPage = safePage > 1;

  const loadCoupons = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchCoupons();
      setCoupons(normalizeCoupons(data));
    } catch (error) {
      setCoupons([]);
      setMessage(
        error instanceof Error ? error.message : "Coupons could not be loaded",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCoupons();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadCoupons]);

  useEffect(() => {
    const session = getDashboardSession();
    logScreenView("coupon_screen", session.storeUrl || "Anonymous", "store");
  }, []);

  async function replaceQuery(patch) {
    const nextQuery = {
      tab: activeTab.slug,
      sort: activeSort.slug,
      ...(search ? { search } : {}),
      ...(safePage > 1 ? { page: String(safePage) } : {}),
      ...patch,
    };

    Object.keys(nextQuery).forEach((key) => {
      if (
        nextQuery[key] === "" ||
        nextQuery[key] === undefined ||
        nextQuery[key] === null
      ) {
        delete nextQuery[key];
      }
    });

    await router.replace(
      {
        pathname: "/coupons-list",
        query: nextQuery,
      },
      undefined,
      { shallow: true },
    );
  }

  async function setTab(nextTab) {
    const resolved = resolveCouponTab(nextTab);
    await replaceQuery({
      tab: resolved.slug,
      page: undefined,
    });
  }

  async function setSort(nextSort) {
    const resolved = resolveCouponSort(nextSort);
    await replaceQuery({
      sort: resolved.slug,
      page: undefined,
    });
  }

  async function setSearch(nextSearch) {
    await replaceQuery({
      search: nextSearch || undefined,
      page: undefined,
    });
  }

  async function goToPage(nextPage) {
    await replaceQuery({
      page: nextPage > 1 ? String(nextPage) : undefined,
    });
  }

  async function removeCoupon(couponId) {
    try {
      setIsDeletingId(Number(couponId));
      setActionError("");
      setActionMessage("");
      await deleteCoupon(Number(couponId));
      setActionMessage("Deleted.");
      await loadCoupons();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Coupon could not be deleted",
      );
    } finally {
      setIsDeletingId(0);
    }
  }

  return {
    activeSort,
    activeTab,
    actionError,
    actionMessage,
    count,
    coupons: pagedCoupons,
    hasNextPage,
    hasPreviousPage,
    isDeletingId,
    isLoading,
    message,
    metrics,
    page: safePage,
    search,
    tabSummary,
    goToPage,
    removeCoupon,
    setSearch,
    setSort,
    setTab,
  };
}
