import DashboardShell from "@/src/components/dashboard/DashboardShell";
import StoreSliderManagementPanel from "@/src/components/store/StoreSliderManagementPanel";
import { useStoreSliderManagement } from "@/src/hooks/store/useStoreSliderManagement";

export default function StoreSliderManagementPage() {
  const {
    storeInfo,
    productGroups,
    filteredBanners,
    mobileSliderSelection,
    setMobileSliderSelection,
    selectedBanner,
    selectBanner,
    productGroupName,
    setProductGroupName,
    setProductGroupSlug,
    link,
    setLink,
    preview,
    setPreview,
    imageBase64,
    setImageBase64,
    currentAspectRatio,
    preferredSize,
    canUseExternalLinks,
    message,
    isLoading,
    isSubmitting,
    submitUpdate,
  } = useStoreSliderManagement();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1320px] px-4 py-8 md:px-6">
        <StoreSliderManagementPanel
          storeInfo={storeInfo}
          productGroups={productGroups}
          filteredBanners={filteredBanners}
          mobileSliderSelection={mobileSliderSelection}
          setMobileSliderSelection={setMobileSliderSelection}
          selectedBanner={selectedBanner}
          selectBanner={selectBanner}
          productGroupName={productGroupName}
          setProductGroupName={setProductGroupName}
          setProductGroupSlug={setProductGroupSlug}
          link={link}
          setLink={setLink}
          preview={preview}
          setPreview={setPreview}
          imageBase64={imageBase64}
          setImageBase64={setImageBase64}
          currentAspectRatio={currentAspectRatio}
          preferredSize={preferredSize}
          canUseExternalLinks={canUseExternalLinks}
          message={message}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          onSubmit={submitUpdate}
        />
      </div>
    </DashboardShell>
  );
}
