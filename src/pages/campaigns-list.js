import DashboardShell from "@/src/components/dashboard/DashboardShell";
import AdCampaignsWorkspace from "@/src/components/ads/AdCampaignsWorkspace";
import { useAdCampaignList } from "@/src/hooks/ads/useAdCampaignList";

export default function CampaignsListPage() {
  const adState = useAdCampaignList();

  return (
    <DashboardShell>
      <AdCampaignsWorkspace
        {...adState}
        onCloseCampaignPanel={adState.closeCampaignPanel}
        onDownloadInvoice={adState.downloadInvoice}
        onOpenCampaign={adState.openCampaign}
        onPageChange={adState.goToPage}
        onSaveCampaign={adState.saveCampaign}
        onStatusChange={adState.changeCampaignStatus}
        onTabChange={adState.setTab}
      />
    </DashboardShell>
  );
}
