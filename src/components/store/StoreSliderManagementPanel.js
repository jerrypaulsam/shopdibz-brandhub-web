/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreField from "./StoreField";
import StoreSection from "./StoreSection";
import StoreToggleRow from "./StoreToggleRow";

/**
 * @param {{ storeInfo: any, productGroups: any[], filteredBanners: any[], mobileSliderSelection: boolean, setMobileSliderSelection: (value: boolean) => void, selectedBanner: any, selectBanner: (banner: any) => void, productGroupName: string, setProductGroupName: (value: string) => void, setProductGroupSlug: (value: string) => void, link: string, setLink: (value: string) => void, preview: string, setPreview: (value: string) => void, setImageBase64: (value: string) => void, currentAspectRatio: string, preferredSize: string, canUseExternalLinks: boolean, message: string, isLoading: boolean, isSubmitting: boolean, onSubmit: () => Promise<boolean> }} props
 */
export default function StoreSliderManagementPanel({
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
  setImageBase64,
  currentAspectRatio,
  preferredSize,
  canUseExternalLinks,
  message,
  isLoading,
  isSubmitting,
  onSubmit,
}) {
  const shownGroups = productGroups.filter((group) =>
    String(group?.name || "")
      .toLowerCase()
      .includes(productGroupName.toLowerCase()),
  );

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setPreview(result);
      setImageBase64(result.split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <StoreSection title="Manage Website Sliders" subtitle="Review the current live set and switch between desktop and mobile slots.">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <StoreToggleRow
              label="Mobile Slider View"
              checked={mobileSliderSelection}
              helper={`Current Aspect Ratio: ${currentAspectRatio}`}
              onChange={setMobileSliderSelection}
            />
            <div className="rounded-sm border border-brand-gold/20 bg-[#17130a] px-4 py-3 text-sm text-brand-gold">
              Preferred Size: {preferredSize}
            </div>
          </div>

          {isLoading ? (
            <p className="mt-6 text-sm text-white/45">Loading live sliders...</p>
          ) : filteredBanners.length ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {filteredBanners.map((banner) => (
                <button
                  className={`overflow-hidden rounded-sm border text-left transition-colors ${
                    selectedBanner?.id === banner.id
                      ? "border-brand-gold"
                      : "border-white/10 hover:border-brand-gold/40"
                  }`}
                  type="button"
                  onClick={() => selectBanner(banner)}
                  key={banner.id}
                >
                  <div className="relative aspect-[16/6] bg-brand-black">
                    <img
                      src={banner.image}
                      alt="Live slider"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="font-bold text-brand-white">
                      Slider #{banner.id}
                    </span>
                    <span className="text-brand-gold">Edit</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-sm border border-white/10 bg-black/20 px-6 py-12 text-center">
              <p className="text-base font-bold text-brand-white">
                No active sliders found for this view.
              </p>
            </div>
          )}
        </StoreSection>

        <StoreSection title="Create Additional Sliders">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-white/60">
              Maximum 2 active sliders allowed per publish action.
            </p>
            {filteredBanners.length < 2 ? (
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-sm border border-white/15 px-5 text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                href="/store-slider-image-form"
              >
                Create New Sliders
              </Link>
            ) : (
              <p className="text-sm text-white/45">
                This view already has active sliders loaded for management.
              </p>
            )}
          </div>
        </StoreSection>
      </div>

      <StoreSection
        title="Update Selected Slider"
        subtitle={selectedBanner ? `Editing slider #${selectedBanner.id}` : "Choose a live slider to replace its image and linked destination."}
      >
        <AuthMessage>{message}</AuthMessage>

        {selectedBanner ? (
          <div className="mt-4 space-y-5">
            <div className="overflow-hidden rounded-sm border border-white/10 bg-brand-black">
              {preview ? (
                <div className="aspect-[16/6]">
                  <img
                    src={preview}
                    alt="Updated slider preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/6]">
                  <img
                    src={selectedBanner.image}
                    alt="Selected live slider"
                    className="h-full w-full object-cover opacity-75"
                  />
                </div>
              )}
            </div>

            <label className="block cursor-pointer rounded-sm border border-white/10 px-4 py-3 text-center text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold">
              Select Replacement Image
              <input className="hidden" type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            <div>
              <StoreField
                label="Link to Product Group"
                value={productGroupName}
                helper="Optional"
                onChange={(value) => {
                  setProductGroupName(value);
                  setProductGroupSlug("");
                }}
              />

              {productGroupName && shownGroups.length ? (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-sm border border-white/10 bg-[#0f0f0f]">
                  {shownGroups.slice(0, 8).map((group) => (
                    <button
                      className="block w-full border-b border-white/5 px-4 py-3 text-left text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-brand-white"
                      type="button"
                      onClick={() => {
                        setProductGroupName(group.name);
                        setProductGroupSlug(String(group.id));
                      }}
                      key={group.id}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {canUseExternalLinks ? (
              <StoreField
                label="External Redirect URL"
                value={link}
                helper="Optional"
                onChange={setLink}
              />
            ) : (
              <p className="text-sm text-white/45">
                External redirect URLs are available only on the Platinum plan.
              </p>
            )}

            <AuthButton
              type="button"
              disabled={isSubmitting || isLoading}
              onClick={onSubmit}
            >
              {isSubmitting ? "Updating..." : "Update Slider"}
            </AuthButton>
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-white/45">
            Select a slider card from the left to begin.
          </div>
        )}

        <div className="mt-6 border-t border-white/10 pt-6 text-sm text-white/55">
          <p>Store plan: {storeInfo?.plan || "Free"}</p>
        </div>
      </StoreSection>
    </div>
  );
}
