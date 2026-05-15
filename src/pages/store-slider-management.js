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
    removeBanner,
  } = useStoreSliderManagement();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1320px] px-4 py-8 md:px-6">
        {storeInfo && !storeInfo.prem ? (
          <UpgradeCard message="Please upgrade your plan to manage Website Sliders." />
        ) : null}
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
          onDelete={removeBanner}
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
