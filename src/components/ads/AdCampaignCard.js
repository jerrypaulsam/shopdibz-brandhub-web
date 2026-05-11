import {
  formatCampaignDate,
  formatCampaignMoney,
  getCampaignStatusLabel,
  getCampaignStatusTone,
} from "@/src/utils/ads";

/**
 * @param {{ campaign: any, isActive: boolean, onOpen: (campaignId: number, panel?: string) => void, onDownloadInvoice: (campaignId: number) => Promise<void>, isActionLoading: boolean }} props
 */
export default function AdCampaignCard({
  campaign,
  isActive,
  onOpen,
  onDownloadInvoice,
  isActionLoading,
}) {
  const canEdit = campaign.status === "ACTIVE" || campaign.status === "PAUSED";
  const canOpen = Boolean(campaign.id);
  const canDownloadInvoice = campaign.status === "FINISHED";

  return (
    <article
      className={`rounded-sm border p-4 transition-colors ${
        isActive
          ? "border-brand-gold/50 bg-brand-gold/5"
          : "border-white/10 bg-[#121212]"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getCampaignStatusTone(campaign.status)}`}
            >
              {getCampaignStatusLabel(campaign.status)}
            </span>
            <span className="text-xs font-semibold text-white/45">
              Ref {campaign.promotionRef}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-black text-brand-white">
            {campaign.productName || "Store Promotion"}
          </h3>
          <p className="mt-2 text-sm text-white/45">
            {campaign.type === "STORE" ? "Store campaign" : "Product campaign"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Budget" value={formatCampaignMoney(campaign.budget)} />
          <Metric label="Daily" value={formatCampaignMoney(campaign.dailyBudget)} />
          <Metric label="Spend" value={formatCampaignMoney(campaign.spend)} />
          <Metric label="Remaining" value={formatCampaignMoney(campaign.remainingBudget)} />
          <Metric label="Clicks" value={`${campaign.clicks || 0}`} />
          <Metric label="Impr." value={`${campaign.impressions || 0}`} />
          <Metric label="Sales" value={`${campaign.sales || 0}`} />
          <Metric label="CTR" value={`${campaign.ctr ?? "-"}%`} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4 text-sm text-white/55">
          <span>Start {formatCampaignDate(campaign.startDate)}</span>
          <span>End {formatCampaignDate(campaign.endDate)}</span>
          <span>{campaign.bidding}</span>
          <span>{campaign.budgetType}</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {canOpen ? (
            <button
              className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
              type="button"
              onClick={() => onOpen(campaign.id, "details")}
            >
              Open
            </button>
          ) : null}
          {canEdit ? (
            <button
              className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:opacity-40"
              type="button"
              onClick={() => onOpen(campaign.id, "edit")}
            >
              Edit
            </button>
          ) : null}
          {canDownloadInvoice ? (
            <button
              className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:opacity-40"
              type="button"
              disabled={isActionLoading}
              onClick={() => onDownloadInvoice(campaign.id)}
            >
              Invoice
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Metric({ label, value }) {
  return (
    <div className="min-w-0 rounded-sm border border-white/10 bg-black/20 px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-semibold tabular-nums text-brand-white">
        {value}
      </p>
    </div>
  );
}
