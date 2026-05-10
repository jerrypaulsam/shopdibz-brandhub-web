import DashboardShell from "@/src/components/dashboard/DashboardShell";
import CampaignCreateWorkspace from "@/src/components/ads/CampaignCreateWorkspace";
import { useCampaignCreateForm } from "@/src/hooks/ads/useCampaignCreateForm";

export default function CampaignCreatePage() {
  const campaignForm = useCampaignCreateForm();

  return (
    <DashboardShell>
      <CampaignCreateWorkspace {...campaignForm} />
    </DashboardShell>
  );
}
