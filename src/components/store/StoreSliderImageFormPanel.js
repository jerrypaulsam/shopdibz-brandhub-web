/* eslint-disable @next/next/no-img-element */

import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import StoreField from "./StoreField";
import StoreSection from "./StoreSection";
import StoreToggleRow from "./StoreToggleRow";

/**
 * @param {{ storeInfo: any, productGroups: any[], bannerImages: any[], mobileSliderSelection: boolean, setMobileSliderSelection: (value: boolean) => void, slots: any[], updateSlot: (index: number, patch: Record<string, string>) => void, preferredSize: string, currentAspectRatio: string, canUseExternalLinks: boolean, message: string, isLoading: boolean, isSubmitting: boolean, onSubmit: () => Promise<boolean> }} props
 */
export default function StoreSliderImageFormPanel({
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
  onSubmit,
}) {
  return (
    <div className="space-y-6">
      <StoreSection
        title="Update Website Sliders"
        subtitle="Publish exactly two banners per set and keep mobile and desktop creative separate."
      >
        <div className="space-y-6">
          <StoreToggleRow
            label="Update Mobile Sliders?"
            checked={mobileSliderSelection}
            helper={`Current Aspect Ratio: ${currentAspectRatio}`}
            onChange={setMobileSliderSelection}
          />

          <div className="rounded-sm border border-brand-gold/20 bg-[#17130a] px-4 py-3 text-sm text-brand-gold">
            Preferred Size: {preferredSize}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {slots.map((slot, index) => (
              <BannerSlotEditor
                index={index}
                slot={slot}
                productGroups={productGroups}
                canUseExternalLinks={canUseExternalLinks}
                onUpdate={updateSlot}
                key={`slot-${index}`}
              />
            ))}
          </div>

          <AuthMessage>{message}</AuthMessage>

          <div className="max-w-xs">
            <AuthButton
              type="button"
              disabled={isLoading || isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting ? "Publishing..." : "Publish Sliders"}
            </AuthButton>
          </div>
        </div>
      </StoreSection>

      <StoreSection
        title="Current Slider Set"
        subtitle={`${mobileSliderSelection ? "Mobile" : "Desktop"} banners already published for this store.`}
      >
        {bannerImages.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {bannerImages.map((banner) => (
              <div
                className="overflow-hidden rounded-sm border border-white/10 bg-black/20"
                key={banner.id}
              >
                <div className="relative aspect-[16/6] bg-brand-black">
                  <img
                    src={banner.image}
                    alt="Store slider"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/45">
            No {mobileSliderSelection ? "mobile" : "desktop"} sliders published yet.
          </p>
        )}
      </StoreSection>

      <StoreSection title="Publishing Notes">
        <div className="space-y-3 text-sm leading-6 text-white/60">
          <p>Exactly two slider images are required for each publish action.</p>
          <p>Product group links are optional and help route traffic into curated collections.</p>
          <p>
            External links are {canUseExternalLinks ? "available on this plan." : "available only on the Platinum plan."}
          </p>
          <p>Store plan: {storeInfo?.plan || "Free"}</p>
        </div>
      </StoreSection>
    </div>
  );
}

/**
 * @param {{ index: number, slot: any, productGroups: any[], canUseExternalLinks: boolean, onUpdate: (index: number, patch: Record<string, string>) => void }} props
 */
function BannerSlotEditor({
  index,
  slot,
  productGroups,
  canUseExternalLinks,
  onUpdate,
}) {
  const filteredGroups = productGroups.filter((group) =>
    String(group?.name || "")
      .toLowerCase()
      .includes(String(slot.productGroupName || "").toLowerCase()),
  );

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      onUpdate(index, {
        preview: result,
        imageBase64: result.split(",")[1] || "",
      });
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="rounded-sm border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-brand-white">Slider {index + 1}</h3>
        <label className="cursor-pointer rounded-sm border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold">
          Select Image
          <input className="hidden" type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      <div className="mt-4 overflow-hidden rounded-sm border border-white/10 bg-brand-black">
        {slot.preview ? (
          <div className="relative aspect-[16/6]">
            <img
              src={slot.preview}
              alt={`Slider ${index + 1} preview`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/6] items-center justify-center text-sm text-white/35">
            No image selected for this slot
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <StoreField
            label="Link to Product Group"
            value={slot.productGroupName}
            helper="Optional"
            onChange={(value) =>
              onUpdate(index, {
                productGroupName: value,
                productGroupSlug: "",
              })
            }
          />

          {slot.productGroupName && filteredGroups.length ? (
            <div className="mt-2 max-h-48 overflow-y-auto rounded-sm border border-white/10 bg-[#0f0f0f]">
              {filteredGroups.slice(0, 8).map((group) => (
                <button
                  className="block w-full border-b border-white/5 px-4 py-3 text-left text-sm text-white/65 transition-colors hover:bg-white/5 hover:text-brand-white"
                  type="button"
                  onClick={() =>
                    onUpdate(index, {
                      productGroupName: group.name,
                      productGroupSlug: String(group.id),
                    })
                  }
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
            label="External URL"
            value={slot.link}
            helper="Optional"
            onChange={(value) => onUpdate(index, { link: value })}
          />
        ) : null}
      </div>
    </section>
  );
}
