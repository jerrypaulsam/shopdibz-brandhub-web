import { useState } from "react";
import {
  formatCampaignDate,
  formatCampaignMoney,
  getCampaignStatusLabel,
} from "@/src/utils/ads";

/**
 * @param {{ campaign: any, panel: string, actionMessage: string, actionError: string, isActionLoading: boolean, onClose: () => void, onOpenEdit: (campaignId: number, panel?: string) => Promise<void>, onStatusChange: (campaignId: number, status: string) => Promise<void>, onSave: (payload: { campaignId: number, budget: number, dailyBudget: number, endDate: string }) => Promise<void> }} props
 */
export default function CampaignSidePanel({
  campaign,
  panel,
  actionMessage,
  actionError,
  isActionLoading,
  onClose,
  onOpenEdit,
  onStatusChange,
  onSave,
}) {
  const [budget, setBudget] = useState(String(campaign?.budget || ""));
  const [dailyBudget, setDailyBudget] = useState(String(campaign?.dailyBudget || ""));
  const [endDate, setEndDate] = useState(
    campaign?.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : "",
  );

  if (!campaign) {
    return (
      <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <p className="text-sm text-white/45">
          Choose a campaign to view metrics, status controls, or edit budget settings.
        </p>
      </aside>
    );
  }

  return (
    <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
            Campaign
          </p>
          <h2 className="mt-2 text-lg font-extrabold text-brand-white">
            {campaign.productName || "Store Promotion"}
          </h2>
        </div>
        <button
          className="min-h-10 rounded-sm border border-white/10 px-3 text-sm font-semibold text-white/65 transition-colors hover:border-white/20 hover:text-brand-white"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {actionMessage ? (
        <div className="mt-5 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {actionMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="mt-5 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {actionError}
        </div>
      ) : null}

      {panel === "edit" ? (
        <div className="mt-6 space-y-4">
          <Field label="Status" value={getCampaignStatusLabel(campaign.status)} />
          <label className="space-y-2 text-sm text-white/60">
            <span className="block font-semibold text-brand-white">Budget</span>
            <input
              className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
              type="number"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span className="block font-semibold text-brand-white">Daily Budget</span>
            <input
              className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
              type="number"
              value={dailyBudget}
              onChange={(event) => setDailyBudget(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-white/60">
            <span className="block font-semibold text-brand-white">End Date</span>
            <input
              className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </label>
          <button
            className="min-h-11 w-full rounded-sm bg-brand-gold px-4 text-sm font-bold text-brand-black disabled:opacity-40"
            type="button"
            disabled={isActionLoading}
            onClick={() =>
              onSave({
                campaignId: campaign.id,
                budget: Number(budget || 0),
                dailyBudget: Number(dailyBudget || 0),
                endDate,
              })
            }
          >
            {isActionLoading ? "Saving..." : "Save Campaign"}
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <Field label="Promotion Ref" value={campaign.promotionRef} />
          <Field label="Campaign Type" value={campaign.type} />
          <Field label="Bidding" value={campaign.bidding} />
          <Field label="Budget Type" value={campaign.budgetType} />
          <Field label="Start Date" value={formatCampaignDate(campaign.startDate)} />
          <Field label="End Date" value={formatCampaignDate(campaign.endDate)} />
          <Field label="Budget" value={formatCampaignMoney(campaign.budget)} />
          <Field label="Daily Budget" value={formatCampaignMoney(campaign.dailyBudget)} />
          <Field label="Remaining" value={formatCampaignMoney(campaign.remainingBudget)} />
          <div className="grid gap-3 sm:grid-cols-2">
            {campaign.status !== "FINISHED" && campaign.status !== "DRAFT" ? (
              <button
                className="min-h-11 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:opacity-40"
                type="button"
                disabled={isActionLoading}
                onClick={() =>
                  onStatusChange(
                    campaign.id,
                    campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
                  )
                }
              >
                {campaign.status === "ACTIVE" ? "Pause Campaign" : "Activate Campaign"}
              </button>
            ) : null}
            {campaign.status !== "DRAFT" ? (
              <button
                className="min-h-11 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
                type="button"
                onClick={() => onOpenEdit(campaign.id, "edit")}
              >
                Edit Campaign
              </button>
            ) : null}
          </div>
        </div>
      )}
    </aside>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Field({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <span className="text-sm text-white/45">{label}</span>
      <span className="text-right text-sm font-semibold text-brand-white">
        {value || "---"}
      </span>
    </div>
  );
}
