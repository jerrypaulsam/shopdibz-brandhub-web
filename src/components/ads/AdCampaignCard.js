import {
  formatCampaignCompactCount,
  formatCampaignCompactMoney,
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
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] xl:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getCampaignStatusTone(campaign.status)}`}
            >
              {getCampaignStatusLabel(campaign.status)}
            </span>
            <span
              className="min-w-0 break-all text-xs font-semibold text-white/45"
              title={campaign.promotionRef || ""}
            >
              Ref {campaign.promotionRef}
            </span>
          </div>
          <h3
            className="mt-3 line-clamp-2 max-w-3xl text-xl font-black leading-tight text-brand-white"
            title={campaign.productName || "Store Promotion"}
          >
            {campaign.productName || "Store Promotion"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/45">
            {campaign.type === "STORE" ? "Store campaign" : "Product campaign"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
          <Metric
            label="Budget"
            value={formatCampaignCompactMoney(campaign.budget)}
            title={formatCampaignMoney(campaign.budget)}
          />
          <Metric
            label="Daily"
            value={formatCampaignCompactMoney(campaign.dailyBudget)}
            title={formatCampaignMoney(campaign.dailyBudget)}
          />
          <Metric
            label="Spend"
            value={formatCampaignCompactMoney(campaign.spend)}
            title={formatCampaignMoney(campaign.spend)}
          />
          <Metric
            label="Rem."
            value={formatCampaignCompactMoney(campaign.remainingBudget)}
            title={formatCampaignMoney(campaign.remainingBudget)}
          />
          <Metric
            label="Clicks"
            value={formatCampaignCompactCount(campaign.clicks)}
            title={`${campaign.clicks || 0}`}
          />
          <Metric
            label="Impr."
            value={formatCampaignCompactCount(campaign.impressions)}
            title={`${campaign.impressions || 0}`}
          />
          <Metric
            label="Sales"
            value={formatCampaignCompactCount(campaign.sales)}
            title={`${campaign.sales || 0}`}
          />
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
 * @param {{ label: string, value: string, title?: string }} props
 */
function Metric({ label, value, title }) {
  return (
    <div className="flex min-w-0 min-h-[82px] flex-col justify-between rounded-sm border border-white/10 bg-black/20 px-3 py-3">
      <p className="break-words text-[10px] font-bold uppercase leading-4 tracking-[0.12em] text-white/40">
        {label}
      </p>
      <p
        className="mt-2 break-words text-[15px] font-semibold leading-5 tabular-nums text-brand-white"
        title={title || value}
      >
        {value}
      </p>
    </div>
  );
}
