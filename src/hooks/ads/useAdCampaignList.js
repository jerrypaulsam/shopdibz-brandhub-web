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
  const page = Number(firstAdsQuery(router.query.page) || 1);
  const campaignId = Number(firstAdsQuery(router.query.campaign) || 0);
  const panel = firstAdsQuery(router.query.panel) || "details";
  const activeTab = useMemo(() => resolveCampaignTab(tabSlug), [tabSlug]);

  const [campaigns, setCampaigns] = useState([]);
  const [count, setCount] = useState(0);
  const [storeInfo, setStoreInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const selectedCampaign = useMemo(
    () => campaigns.find((campaign) => Number(campaign.id) === campaignId) || null,
    [campaignId, campaigns],
  );

  const summary = useMemo(() => summarizeCampaigns(campaigns), [campaigns]);

  const loadCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const [campaignData, storeData] = await Promise.all([
        fetchAdCampaigns({ status: activeTab.status, page }),
        fetchAdsStoreInfo().catch(() => ({})),
      ]);
      const collection = normalizeCampaignCollection(campaignData);
      setCampaigns(collection.results);
      setCount(collection.count);
      setStoreInfo(storeData || {});
      setHasNextPage(Boolean(collection.next) || page * 15 < collection.count);
      setHasPreviousPage(Boolean(collection.previous) || page > 1);
    } catch (error) {
      setCampaigns([]);
      setCount(0);
      setStoreInfo({});
      setHasNextPage(false);
      setHasPreviousPage(false);
      setMessage(
        error instanceof Error ? error.message : "Campaigns could not be loaded",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeTab.status, page]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCampaigns();
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

  async function goToPage(nextPage) {
    await router.replace(
      {
        pathname: "/campaigns-list",
        query: {
          tab: activeTab.slug,
          ...(nextPage > 1 ? { page: String(nextPage) } : {}),
          ...(campaignId ? { campaign: String(campaignId), panel } : {}),
        },
      },
      undefined,
      { shallow: true },
    );
  }

  async function openCampaign(nextCampaignId, nextPanel = "details") {
    await router.replace(
      {
        pathname: "/campaigns-list",
        query: {
          tab: activeTab.slug,
          ...(page > 1 ? { page: String(page) } : {}),
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
          ...(page > 1 ? { page: String(page) } : {}),
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
    campaigns,
    selectedCampaign,
    panel,
    storeInfo,
    summary,
    isLoading,
    message,
    actionMessage,
    actionError,
    isActionLoading,
    hasNextPage,
    hasPreviousPage,
    setTab,
    goToPage,
    openCampaign,
    closeCampaignPanel,
    downloadInvoice,
    changeCampaignStatus,
    saveCampaign,
  };
}
