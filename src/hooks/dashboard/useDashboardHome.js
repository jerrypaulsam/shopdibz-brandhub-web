import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchDailyVisits,
  getDashboardSession,
  fetchManagers,
  fetchOrders,
  fetchStoreInfo,
  fetchWeeklyAnalytics,
} from "@/src/api/dashboard";
import { getCachedStoreInfo } from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

const fallbackStore = {
  name: "Your Brand",
  url: "",
  logo: "/assets/logo/icon-192.png",
  description:
    "Use this space to monitor orders, revenue, store health, products, and growth signals.",
  prem: false,
  plan: "F",
  earned: 0,
  orders: 0,
  pOrders: 0,
  packedOrders: 0,
  shippedOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  followers: 0,
  totalProducts: 0,
  countReview: 0,
  level: 0,
  penalty: 0,
  wallet: 0,
  dailyVisits: 0,
  averageShippingTime: 0,
  totalProductViews: 0,
  averageReview: 0,
  points: 0,
  tin: "",
};

/**
 * @returns {{ storeInfo: any, pendingOrders: any[], managers: any[], weeklyAnalytics: any[], isLoading: boolean, error: string, hidePremiumBanner: boolean, setHidePremiumBanner: (value: boolean) => void, analyticsCards: Array<{ label: string, value: string, tone: string }> }}
 */
export function useDashboardHome() {
  const router = useRouter();
  const [storeInfo, setStoreInfo] = useState(() =>
    normalizeStoreInfo(getCachedStoreInfo()),
  );
  const [pendingOrders, setPendingOrders] = useState([]);
  const [managers, setManagers] = useState([]);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState([]);
  const [dailyVisits, setDailyVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [hidePremiumBanner, setHidePremiumBanner] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const session = getDashboardSession();
        const cachedStore = getCachedStoreInfo();

        if (!session.accessToken) {
          await router.replace("/login");
          return;
        }

        if (!session.storeUrl && !cachedStore?.url) {
          await router.replace("/");
          return;
        }

        const [
          store,
          orders,
          managerList,
          weekly,
          dailyVisitResult,
        ] = await Promise.allSettled([
          fetchStoreInfo(),
          fetchOrders("AC", 1),
          fetchManagers(),
          fetchWeeklyAnalytics(),
          fetchDailyVisits(),
        ]);

        if (!isCurrent) {
          return;
        }

        const nextStore =
          store.status === "fulfilled" ? store.value : cachedStore || {};
        const nextOrders = orders.status === "fulfilled" ? orders.value : {};
        const nextManagers =
          managerList.status === "fulfilled" ? managerList.value : {};
        const nextWeekly = weekly.status === "fulfilled" ? weekly.value : {};
        const nextDailyVisits =
          dailyVisitResult.status === "fulfilled" ? dailyVisitResult.value : {};

        const resolvedStoreInfo = normalizeStoreInfo(nextStore);

        setStoreInfo(resolvedStoreInfo);
        setPendingOrders(nextOrders.results || []);
        setManagers(nextManagers.results || []);
        setWeeklyAnalytics(nextWeekly.results || []);
        setDailyVisits(nextDailyVisits.results || []);

        if (resolvedStoreInfo?.bankVerify === false) {
          await router.replace("/settings/bank/create");
          return;
        }

        if (resolvedStoreInfo?.close === true) {
          await router.replace("/store-closed");
          return;
        }

        if (resolvedStoreInfo?.paywall === false) {
          await router.replace("/onboard-payment");
          return;
        }

        logScreenView(
          "dashboard_screen",
          resolvedStoreInfo?.url || "Anonymous",
          "store",
        );
      } catch (loadError) {
        if (!isCurrent) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Dashboard data could not be loaded",
        );
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isCurrent = false;
    };
  }, [router]);

  const analyticsCards = useMemo(
    () => [
      {
        label: "Total Amount",
        value: formatMoney(storeInfo.earned || 0),
        tone: "gold",
      },
      {
        label: "Total Orders",
        value: `${storeInfo.orders || 0}`,
        tone: "blue",
      },
      {
        label: "Pending Orders",
        value: `${storeInfo.pOrders || pendingOrders.length || 0} nos`,
        tone: "green",
      },
      {
        label: "Followers",
        value: `${storeInfo.followers || 0}`,
        tone: "purple",
      },
      {
        label: "Total Products",
        value: `${storeInfo.totalProducts || 0}`,
        tone: "yellow",
      },
      {
        label: "No. Of Rating",
        value: `${storeInfo.countReview || 0}`,
        tone: "orange",
      },
      {
        label: "Store Level",
        value: `${storeInfo.level || 0}`,
        tone: "pink",
      },
      {
        label: "Penalty",
        value: formatMoney(storeInfo.penalty || 0),
        tone: "red",
      },
    ],
    [storeInfo, pendingOrders.length],
  );

  return {
    storeInfo,
    pendingOrders,
    managers,
    weeklyAnalytics,
    dailyVisits,
    isLoading,
    error,
    hidePremiumBanner,
    setHidePremiumBanner,
    analyticsCards,
  };
}

/**
 * @param {number} value
 * @returns {string}
 */
function formatMoney(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }

  return false;
}

/**
 * @param {any[]} values
 * @returns {any}
 */
function firstDefined(values) {
  return values.find((value) => value !== undefined && value !== null);
}

/**
 * @param {any[]} values
 * @returns {number}
 */
function toNumber(values) {
  const resolved = firstDefined(values);
  const numeric = Number(resolved || 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

/**
 * @param {any} raw
 * @returns {any}
 */
function normalizeStoreInfo(raw) {
  const store = raw || {};

  return {
    ...fallbackStore,
    ...store,
    name: firstDefined([store.name, store.storeName, fallbackStore.name]),
    url: firstDefined([store.url, store.storeUrl, fallbackStore.url]),
    logo: normalizeStoreAssetUrl(firstDefined([store.logo, store.storeLogo, ""])),
    description: firstDefined([
      store.description,
      store.desc,
      fallbackStore.description,
    ]),
    prem: toBoolean(firstDefined([store.prem, store.isPremium])),
    plan: String(firstDefined([store.plan, store.activePlan, fallbackStore.plan])),
    earned: toNumber([store.earned, store.totalAmount]),
    orders: toNumber([store.orders, store.totalOrders]),
    pOrders: toNumber([store.pOrders, store.pendingOrders]),
    packedOrders: toNumber([store.packedOrders, store.pacOrders]),
    shippedOrders: toNumber([store.shippedOrders, store.shOrders]),
    completedOrders: toNumber([store.completedOrders, store.comOrders]),
    cancelledOrders: toNumber([store.cancelledOrders, store.canOrders]),
    followers: toNumber([store.followers, store.folls]),
    totalProducts: toNumber([store.totalProducts, store.productCount, store.totProds]),
    countReview: toNumber([store.countReview, store.reviewCount, store.rCnt]),
    level: toNumber([store.level]),
    penalty: toNumber([store.penalty]),
    wallet: toNumber([store.wallet, store.adWallet]),
    dailyVisits: toNumber([store.dailyVisits, store.dVisits]),
    averageShippingTime: toNumber([
      store.averageShippingTime,
      store.avgShippingTime,
      store.avgShip,
    ]),
    totalProductViews: toNumber([
      store.totalProductViews,
      store.productViews,
      store.prdtViews,
    ]),
    averageReview: toNumber([store.averageReview, store.rating, store.rAvg]),
    points: toNumber([store.points]),
    tin: String(firstDefined([store.tin, store.gstin, ""])),
    bankVerify: firstDefined([store.bankVerify, store.bank_verify, store.bV]),
    paywall: firstDefined([store.paywall]),
    close: toBoolean(firstDefined([store.close, store.closed])),
    userCode: firstDefined([store.userCode, store.uCode, ""]),
    shipType: firstDefined([store.shipType, store.shType, "SE"]),
    shipMode: firstDefined([store.shipMode, store.mode, "0"]),
    storeTheme: String(firstDefined([store.storeTheme, store.theme, "0"])),
  };
}

/**
 * @param {any} value
 * @returns {string}
 */
function normalizeStoreAssetUrl(value) {
  const resolved = String(value || "").trim();

  if (
    !resolved ||
    resolved === "/" ||
    resolved.toLowerCase() === "null" ||
    resolved.toLowerCase() === "undefined" ||
    resolved === "https://shopdibz-test.s3.amazonaws.com/media/store/store_logos/defaultstorelogo.png"
  ) {
    return "";
  }

  if (resolved.startsWith("https://") || resolved.startsWith("http://")) {
    return resolved;
  }

  if (resolved.startsWith("//")) {
    return `https:${resolved}`;
  }

  if (resolved.startsWith("/media/")) {
    return `https://www.shopdibz.com${resolved}`;
  }

  if (resolved.startsWith("media/")) {
    return `https://www.shopdibz.com/${resolved}`;
  }

  return resolved;
}
