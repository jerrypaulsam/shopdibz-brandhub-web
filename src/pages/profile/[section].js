import { useRouter } from "next/router";
import AccountShell from "@/src/components/profile/AccountShell";
import {
  AccountSettingsSection,
  HeaderImageSection,
  StoreSettingsSection,
  StoreSlidersSection,
  SubscriptionSection,
  SupportSection,
} from "@/src/components/profile/AccountOverviewSections";
import { useAccountHub } from "@/src/hooks/profile/useAccountHub";

const validSections = new Set([
  "store-settings",
  "store-sliders",
  "header-image",
  "account-settings",
  "subscription",
  "support",
]);

export default function AccountSectionPage() {
  const router = useRouter();
  const section = String(router.query.section || "");

  const {
    storeInfo,
    bannerImages,
    sectionNav,
    isOwner,
    headerPreview,
    setHeaderPreview,
    setHeaderBase64,
    message,
    isLoading,
    isSubmitting,
    submitHeaderImage,
    removeHeaderImage,
    cancelSubscription,
    deactivateAccount,
  } = useAccountHub(validSections.has(section) ? section : "store-settings");

  const currentSection = validSections.has(section) ? section : "store-settings";

  return (
    <AccountShell navItems={sectionNav} storeInfo={storeInfo} title="Profile">
      {isLoading ? <LoadingCard /> : renderSection(currentSection, {
        storeInfo,
        bannerImages,
        isOwner,
        headerPreview,
        setHeaderPreview,
        setHeaderBase64,
        message,
        isSubmitting,
        submitHeaderImage,
        removeHeaderImage,
        cancelSubscription,
        deactivateAccount,
      })}
    </AccountShell>
  );
}

function renderSection(section, props) {
  if (section === "store-settings") {
    return <StoreSettingsSection storeInfo={props.storeInfo} />;
  }

  if (section === "store-sliders") {
    return <StoreSlidersSection bannerImages={props.bannerImages} />;
  }

  if (section === "header-image") {
    return (
      <HeaderImageSection
        storeInfo={props.storeInfo}
        headerPreview={props.headerPreview}
        setHeaderPreview={props.setHeaderPreview}
        setHeaderBase64={props.setHeaderBase64}
        message={props.message}
        isSubmitting={props.isSubmitting}
        onSubmit={props.submitHeaderImage}
        onDelete={props.removeHeaderImage}
      />
    );
  }

  if (section === "account-settings") {
    return (
      <AccountSettingsSection
        isOwner={props.isOwner}
        isSubmitting={props.isSubmitting}
        onDeactivate={props.deactivateAccount}
      />
    );
  }

  if (section === "subscription") {
    return (
      <SubscriptionSection
        storeInfo={props.storeInfo}
        isSubmitting={props.isSubmitting}
        onCancel={props.cancelSubscription}
      />
    );
  }

  return <SupportSection />;
}

function LoadingCard() {
  return (
    <div className="rounded-sm border border-white/10 bg-[#121212] p-6 text-sm text-white/45">
      Loading profile sections...
    </div>
  );
}
