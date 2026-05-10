export const CAMPAIGN_TABS = [
  {
    slug: "pending",
    label: "Pending",
    status: "DRAFT",
    description: "Campaigns waiting for approval or activation.",
  },
  {
    slug: "active",
    label: "Active",
    status: "ACTIVE",
    description: "Live campaigns currently spending against impressions or clicks.",
  },
  {
    slug: "paused",
    label: "Paused",
    status: "PAUSED",
    description: "Campaigns temporarily stopped but still editable.",
  },
  {
    slug: "finished",
    label: "Finished",
    status: "FINISHED",
    description: "Completed campaigns with final performance data and invoice access.",
  },
];

/**
 * @param {unknown} value
 * @returns {string}
 */
export function firstAdsQuery(value) {
  if (Array.isArray(value)) {
    return String(value[0] || "");
  }

  return typeof value === "string" ? value : "";
}

/**
 * @param {string} slug
 * @returns {{ slug: string, label: string, status: string, description: string }}
 */
export function resolveCampaignTab(slug) {
  return CAMPAIGN_TABS.find((tab) => tab.slug === slug) || CAMPAIGN_TABS[0];
}

/**
 * @param {any} value
 * @returns {{ results: any[], next: boolean | string, previous: boolean | string, count: number }}
 */
export function normalizeCampaignCollection(value) {
  const results =
    value?.results ||
    value?.data?.results ||
    value?.campaigns ||
    value?.data ||
    [];

  return {
    results: Array.isArray(results) ? results : [],
    next: value?.next || value?.data?.next || false,
    previous: value?.previous || value?.data?.previous || false,
    count: Number(
      value?.count ||
        value?.data?.count ||
        (Array.isArray(results) ? results.length : 0),
    ),
  };
}

/**
 * @param {string} status
 * @returns {string}
 */
export function getCampaignStatusTone(status) {
  if (status === "ACTIVE") {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  }

  if (status === "PAUSED") {
    return "bg-amber-500/15 text-amber-200 border-amber-500/30";
  }

  if (status === "FINISHED") {
    return "bg-red-500/15 text-red-300 border-red-500/30";
  }

  return "bg-sky-500/15 text-sky-300 border-sky-500/30";
}

/**
 * @param {string} status
 * @returns {string}
 */
export function getCampaignStatusLabel(status) {
  return status === "DRAFT" ? "Pending" : String(status || "Campaign");
}

/**
 * @param {number | string | null | undefined} value
 * @returns {string}
 */
export function formatCampaignMoney(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

/**
 * @param {string | number | Date | null | undefined} value
 * @returns {string}
 */
export function formatCampaignDate(value) {
  if (!value) {
    return "---";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * @param {Array<any>} campaigns
 * @returns {{ totalBudget: number, totalSpend: number, totalClicks: number, totalImpressions: number }}
 */
export function summarizeCampaigns(campaigns) {
  return campaigns.reduce(
    (summary, campaign) => {
      summary.totalBudget += Number(campaign?.budget || 0);
      summary.totalSpend += Number(campaign?.spend || 0);
      summary.totalClicks += Number(campaign?.clicks || 0);
      summary.totalImpressions += Number(campaign?.impressions || 0);
      return summary;
    },
    {
      totalBudget: 0,
      totalSpend: 0,
      totalClicks: 0,
      totalImpressions: 0,
    },
  );
}
