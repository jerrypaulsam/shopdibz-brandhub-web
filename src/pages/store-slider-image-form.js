import DashboardShell from "@/src/components/dashboard/DashboardShell";
import { useRouter } from "next/router";
import StoreSliderImageFormPanel from "@/src/components/store/StoreSliderImageFormPanel";
import { useStoreSliderImageForm } from "@/src/hooks/store/useStoreSliderImageForm";

export default function StoreSliderImageFormPage() {
  const router = useRouter();
  const initialMobileSliderSelection = String(router.query.view || "").toLowerCase() === "mobile";
  const {
    storeInfo,
    productGroups,
    bannerImages,
    hasPublishedSliderSet,
    mobileSliderSelection,
    setMobileSliderSelection,
    slots,
    updateSlot,
    preferredSize,
    currentAspectRatio,
    canUseExternalLinks,
    message,
    isLoading,
    isSubmitting,
    submitForm,
  } = useStoreSliderImageForm(initialMobileSliderSelection);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        {storeInfo && !storeInfo.prem ? (
          <UpgradeCard message="Please upgrade your plan to publish Website Sliders." />
        ) : null}
        <StoreSliderImageFormPanel
          storeInfo={storeInfo}
          productGroups={productGroups}
          bannerImages={bannerImages}
          hasPublishedSliderSet={hasPublishedSliderSet}
          mobileSliderSelection={mobileSliderSelection}
          setMobileSliderSelection={setMobileSliderSelection}
          slots={slots}
          updateSlot={updateSlot}
          preferredSize={preferredSize}
          currentAspectRatio={currentAspectRatio}
          canUseExternalLinks={canUseExternalLinks}
          message={message}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onSubmit={submitForm}
        />
      </div>
    </DashboardShell>
  );
}

function UpgradeCard({ message }) {
  return (
    <div className="mb-6 rounded-sm border border-brand-gold/20 bg-[#17130a] px-4 py-3 text-sm text-brand-gold">
      {message}
    </div>
  );
}
