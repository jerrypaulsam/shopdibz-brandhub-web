import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  fetchAdCampaigns,
  fetchAdsStoreInfo,
  fetchCampaignInvoice,
  updateAdCampaign,
  updateAdCampaignStatus,
} from "@/src/api/ads";
import { getDashboardSession } from "@/src/api/dashboard";
import { logScreenView } from "@/src/api/analytics";
import {
  firstAdsQuery,
  normalizeCampaignCollection,
  resolveCampaignTab,
  summarizeCampaigns,
} from "@/src/utils/ads";

export function useAdCampaignList() {
  const router = useRouter();
  const tabSlug = firstAdsQuery(router.query.tab) || "pending";
  const campaignId = Number(firstAdsQuery(router.query.campaign) || 0);
  const panel = firstAdsQuery(router.query.panel) || "details";
  const activeTab = useMemo(() => resolveCampaignTab(tabSlug), [tabSlug]);

  const [campaigns, setCampaigns] = useState([]);
  const [count, setCount] = useState(0);
  const [storeInfo, setStoreInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);

  const normalizedCampaigns = useMemo(
    () =>
      campaigns.map((campaign) => ({
        ...campaign,
        status: campaign?.status || "DRAFT",
        bidding: campaign?.bidding || campaign?.bidType || "",
        budgetType: campaign?.budgetType || campaign?.budget_type || "",
        bidAmount: campaign?.bidAmount || campaign?.bid_amount || "",
        placements: Array.isArray(campaign?.placements) ? campaign.placements : [],
        type: campaign?.type || "All",
        budget: campaign?.budget || "0",
        dailyBudget: campaign?.dailyBudget || campaign?.daily_budget || "0",
        startDate: campaign?.startDate || campaign?.start_date || "",
        endDate: campaign?.endDate || campaign?.end_date || "",
        promotionRef: campaign?.promotionRef || campaign?.promotion_ref || "",
        productSlug: campaign?.productSlug || campaign?.product_slug || "",
        productName: campaign?.productName || campaign?.product_name || "",
        clicks: Number(campaign?.clicks || 0),
        impressions: Number(campaign?.impressions || 0),
        sales: Number(campaign?.sales || 0),
        spend: campaign?.spend || "0",
        ctr: campaign?.ctr,
        cpcEffective: campaign?.cpcEffective ?? campaign?.cpc_effective,
        cpmEffective: campaign?.cpmEffective ?? campaign?.cpm_effective,
        remainingBudget:
          campaign?.remainingBudget ?? campaign?.remaining_budget ?? 0,
      })),
    [campaigns],
  );

  const selectedCampaign = useMemo(
    () =>
      normalizedCampaigns.find((campaign) => Number(campaign.id) === campaignId) ||
      null,
    [campaignId, normalizedCampaigns],
  );

  const summary = useMemo(
    () => summarizeCampaigns(normalizedCampaigns),
    [normalizedCampaigns],
  );

  const loadCampaigns = useCallback(async (nextPage = 1, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setMessage("");
      }
      const [campaignData, storeData] = await Promise.all([
        fetchAdCampaigns({ status: activeTab.status, page: nextPage }),
        fetchAdsStoreInfo().catch(() => ({})),
      ]);
      const collection = normalizeCampaignCollection(campaignData);
      setCampaigns((current) =>
        append ? [...current, ...collection.results] : collection.results,
      );
      setCount(collection.count);
      setStoreInfo(storeData || {});
      setHasNextPage(Boolean(collection.next) || nextPage * 15 < collection.count);
      setPage(nextPage);
    } catch (error) {
      if (!append) {
        setCampaigns([]);
        setCount(0);
        setStoreInfo({});
        setHasNextPage(false);
      }
      setMessage(
        error instanceof Error ? error.message : "Campaigns could not be loaded",
      );
    } finally {
      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [activeTab.status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCampaigns(1, false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadCampaigns]);

  useEffect(() => {
    const session = getDashboardSession();

    logScreenView(
      "ad_campaign_screen",
      session.storeUrl || "Anonymous",
      "store",
    );
  }, []);

  async function setTab(nextTab) {
    const resolved = resolveCampaignTab(nextTab);
    await router.replace(
      {
        pathname: "/campaigns-list",
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

    await loadCampaigns(page + 1, true);
  }

  async function openCampaign(nextCampaignId, nextPanel = "details") {
    await router.replace(
      {
        pathname: "/campaigns-list",
        query: {
          tab: activeTab.slug,
          campaign: String(nextCampaignId),
          panel: nextPanel,
        },
      },
      undefined,
      { shallow: true },
    );
  }

  async function closeCampaignPanel() {
    await router.replace(
      {
        pathname: "/campaigns-list",
        query: {
          tab: activeTab.slug,
        },
      },
      undefined,
      { shallow: true },
    );
  }

  async function downloadInvoice(nextCampaignId) {
    try {
      setIsActionLoading(true);
      setActionError("");
      setActionMessage("");
      const data = await fetchCampaignInvoice(nextCampaignId);
      const invoiceUrl = String(data?.data || "");

      if (invoiceUrl && typeof window !== "undefined") {
        window.open(invoiceUrl, "_blank", "noopener,noreferrer");
        setActionMessage("Campaign invoice opened in a new tab.");
      } else {
        setActionError("Invoice not available.");
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Invoice not available.",
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function changeCampaignStatus(nextCampaignId, status) {
    try {
      setIsActionLoading(true);
      setActionError("");
      setActionMessage("");
      await updateAdCampaignStatus({
        campaignId: nextCampaignId,
        status,
      });
      setActionMessage("Campaign status updated.");
      await loadCampaigns();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Campaign status could not be updated",
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function saveCampaign(payload) {
    try {
      setIsActionLoading(true);
      setActionError("");
      setActionMessage("");
      await updateAdCampaign(payload);
      setActionMessage("Campaign updated.");
      await loadCampaigns();
      await openCampaign(payload.campaignId, "details");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Campaign update failed",
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  return {
    activeTab,
    page,
    count,
    campaigns: normalizedCampaigns,
    selectedCampaign,
    panel,
    storeInfo,
    summary,
    isLoading,
    isLoadingMore,
    message,
    actionMessage,
    actionError,
    isActionLoading,
    hasNextPage,
    setTab,
    loadMore,
    openCampaign,
    closeCampaignPanel,
    downloadInvoice,
    changeCampaignStatus,
    saveCampaign,
  };
}
