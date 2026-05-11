import AnalyticsGrid from "./AnalyticsGrid";
import CreateActions from "./CreateActions";
import DashboardHeader from "./DashboardHeader";
import LatestOrders from "./LatestOrders";
import NewsBanner from "./NewsBanner";
import OrderAttentionPanel from "./OrderAttentionPanel";
import PremiumBanner from "./PremiumBanner";
import RightPanel from "./RightPanel";
import WeeklyAnalytics from "./WeeklyAnalytics";
import AeyraInfoPanel from "./AeyraInfoPanel";
import { useDashboardHome } from "@/src/hooks/dashboard/useDashboardHome";
import { useState } from "react";

export default function DashboardHome() {
  const [isAeyraOpen, setIsAeyraOpen] = useState(false);
  const {
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
  } = useDashboardHome();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 xl:px-8">
      <div className="space-y-5">
        <NewsBanner onTap={() => setIsAeyraOpen(true)} />
        {!hidePremiumBanner ? (
          <PremiumBanner
            storeInfo={storeInfo}
            onHide={() => setHidePremiumBanner(true)}
          />
        ) : null}
        <DashboardHeader
          storeInfo={storeInfo}
          actions={<CreateActions storeInfo={storeInfo} />}
        />
      </div>

      {error ? (
        <div className="mt-5 rounded-sm border border-red-400/30 bg-red-950/20 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0 space-y-8">
          <AnalyticsGrid cards={analyticsCards} />
          <OrderAttentionPanel storeInfo={storeInfo} />
          <section className="space-y-4">
            <div className="text-center">
              <h2
                className={`text-lg font-extrabold text-brand-white ${
                  pendingOrders.length ? "animate-pulse" : ""
                }`}
              >
                {pendingOrders.length ? "New Pending Orders" : "Pending Orders"}
              </h2>
            </div>
            <LatestOrders orders={pendingOrders} />
          </section>
          <WeeklyAnalytics
            analytics={weeklyAnalytics}
            dailyVisits={dailyVisits}
            currentDailyVisits={storeInfo.dailyVisits}
            storeInfo={storeInfo}
          />

          {isLoading ? (
            <div className="rounded-sm border border-white/10 bg-[#121212] p-6 text-center text-sm text-white/45">
              Loading dashboard data...
            </div>
          ) : null}
        </section>

        <RightPanel
          storeInfo={storeInfo}
          managers={managers}
          weeklyAnalytics={weeklyAnalytics}
          dailyVisits={dailyVisits}
        />
      </div>
      <AeyraInfoPanel open={isAeyraOpen} onClose={() => setIsAeyraOpen(false)} />
    </div>
  );
}
