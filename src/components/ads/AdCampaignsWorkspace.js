import Link from "next/link";
import CampaignTabs from "./CampaignTabs";
import AdCampaignCard from "./AdCampaignCard";
import CampaignSidePanel from "./CampaignSidePanel";
import { formatCampaignMoney } from "@/src/utils/ads";
import InfiniteScrollTrigger from "@/src/components/app/InfiniteScrollTrigger";
import ToastMessage from "@/src/components/app/ToastMessage";

/**
 * @param {{ activeTab: { slug: string, label: string, description: string }, count: number, campaigns: any[], selectedCampaign: any, panel: string, storeInfo: any, summary: { totalBudget: number, totalSpend: number, totalClicks: number, totalImpressions: number }, isLoading: boolean, isLoadingMore: boolean, message: string, actionMessage: string, actionError: string, isActionLoading: boolean, hasNextPage: boolean, onTabChange: (value: string) => void, onLoadMore: () => void, onOpenCampaign: (campaignId: number, panel?: string) => Promise<void>, onCloseCampaignPanel: () => Promise<void>, onDownloadInvoice: (campaignId: number) => Promise<void>, onStatusChange: (campaignId: number, status: string) => Promise<void>, onSaveCampaign: (payload: { campaignId: number, budget: number, dailyBudget: number, endDate: string }) => Promise<void> }} props
 */
export default function AdCampaignsWorkspace(props) {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <ToastMessage message={props.message} type="error" />
      <ToastMessage message={props.actionError} type="error" />
      <ToastMessage message={props.actionMessage} type="success" />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Campaigns
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
            Ad campaign workspace
          </h1>
        </div>

        <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
            Campaign tips
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            <li>CTR tracks how often impressions turn into clicks.</li>
            <li>CPC helps compare traffic efficiency between campaigns.</li>
            <li>CPM helps with top-of-funnel brand visibility.</li>
            <li>Finished campaigns expose invoice download when spend exists.</li>
          </ul>
          <Link
            className="mt-5 inline-flex min-h-10 items-center rounded-sm border border-brand-gold/30 px-4 text-sm font-semibold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
            href="/campaigns/create?mode=store"
          >
            Create store campaign
          </Link>
        </aside>
      </section>

      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-white">
              {props.activeTab.label} campaigns
            </h2>
            <p className="mt-2 text-sm text-white/50">{props.activeTab.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Total Budget" value={formatCampaignMoney(props.summary.totalBudget)} />
            <SummaryCard label="Spend" value={formatCampaignMoney(props.summary.totalSpend)} />
            <SummaryCard label="Clicks" value={`${props.summary.totalClicks}`} />
            <SummaryCard label="Impressions" value={`${props.summary.totalImpressions}`} />
          </div>
        </div>
        <div className="mt-5">
          <CampaignTabs activeTab={props.activeTab.slug} onChange={props.onTabChange} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          {props.isLoading ? (
            <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-12 text-center text-sm text-white/45">
              Loading campaigns...
            </div>
          ) : null}

          {!props.isLoading && !props.campaigns.length ? (
            <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-16 text-center">
              <p className="text-base font-bold text-brand-white">
                No {props.activeTab.label.toLowerCase()} campaigns
              </p>
              <p className="mt-2 text-sm text-white/45">
                When campaigns enter this stage, they will appear here.
              </p>
            </div>
          ) : null}

          {!props.isLoading
            ? props.campaigns.map((campaign) => (
                <AdCampaignCard
                  campaign={campaign}
                  isActive={props.selectedCampaign?.id === campaign.id}
                  isActionLoading={props.isActionLoading}
                  key={campaign.id}
                  onDownloadInvoice={props.onDownloadInvoice}
                  onOpen={props.onOpenCampaign}
                />
              ))
            : null}

          {!props.isLoading && props.campaigns.length ? (
            <InfiniteScrollTrigger
              hasMore={props.hasNextPage}
              isLoading={props.isLoadingMore}
              label="Loading more campaigns..."
              onLoadMore={props.onLoadMore}
            />
          ) : null}
        </div>

        <CampaignSidePanel
          actionError={props.actionError}
          actionMessage={props.actionMessage}
          campaign={props.selectedCampaign}
          isActionLoading={props.isActionLoading}
          key={`${props.selectedCampaign?.id || "empty"}:${props.panel}`}
          panel={props.panel}
          onClose={props.onCloseCampaignPanel}
          onOpenEdit={props.onOpenCampaign}
          onSave={props.onSaveCampaign}
          onStatusChange={props.onStatusChange}
        />
      </section>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function SummaryCard({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
