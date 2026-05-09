import { useEffect, useMemo, useState } from "react";
import {
  fetchDailyVisits,
  fetchManagers,
  fetchOrders,
  fetchStoreInfo,
  fetchWeeklyAnalytics,
} from "@/src/api/dashboard";
import { logScreenView } from "@/src/api/analytics";

const fallbackStore = {
  name: "Your Brand",
  url: "",
  logo: "/assets/logo/seller-logo.png",
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
  const [storeInfo, setStoreInfo] = useState(fallbackStore);
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

        const nextStore = store.status === "fulfilled" ? store.value : {};
        const nextOrders = orders.status === "fulfilled" ? orders.value : {};
        const nextManagers =
          managerList.status === "fulfilled" ? managerList.value : {};
        const nextWeekly = weekly.status === "fulfilled" ? weekly.value : {};
        const nextDailyVisits =
          dailyVisitResult.status === "fulfilled" ? dailyVisitResult.value : {};

        setStoreInfo({
          ...fallbackStore,
          ...nextStore,
        });
        setPendingOrders(nextOrders.results || []);
        setManagers(nextManagers.results || []);
        setWeeklyAnalytics(nextWeekly.results || []);
        setDailyVisits(nextDailyVisits.results || []);

        logScreenView(
          "dashboard_screen",
          nextStore?.url || "Anonymous",
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
  }, []);

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
