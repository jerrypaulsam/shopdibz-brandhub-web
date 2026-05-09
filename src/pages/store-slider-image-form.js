import DashboardShell from "@/src/components/dashboard/DashboardShell";
import StoreSliderImageFormPanel from "@/src/components/store/StoreSliderImageFormPanel";
import { useStoreSliderImageForm } from "@/src/hooks/store/useStoreSliderImageForm";

export default function StoreSliderImageFormPage() {
  const {
    storeInfo,
    productGroups,
    bannerImages,
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
  } = useStoreSliderImageForm();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        <StoreSliderImageFormPanel
          storeInfo={storeInfo}
          productGroups={productGroups}
          bannerImages={bannerImages}
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
