/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";

import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import AspectCropDialog from "@/src/components/media/AspectCropDialog";
import StoreField from "./StoreField";
import StoreSection from "./StoreSection";

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
  const aspectClass = currentAspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-[16/6]";
  const filledSlots = slots.filter((slot) => slot.imageBase64).length;

  return (
    <div className="space-y-6">
      <StoreSection
        title="Update Website Sliders"
        subtitle="Publish exactly two banners per set and keep mobile and desktop creative separate."
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                  Slider Set
                </p>
                <h3 className="mt-2 text-xl font-black text-brand-white">
                  {mobileSliderSelection ? "Mobile Sliders" : "Desktop Sliders"}
                </h3>
              </div>
              <div className="inline-flex rounded-sm border border-white/10 bg-black/20 p-1">
                <button
                  className={`min-w-[120px] rounded-sm px-4 py-2 text-sm font-bold transition-colors ${
                    !mobileSliderSelection
                      ? "bg-brand-gold text-brand-black"
                      : "text-brand-white hover:text-brand-gold"
                  }`}
                  type="button"
                  onClick={() => setMobileSliderSelection(false)}
                >
                  Desktop
                </button>
                <button
                  className={`min-w-[120px] rounded-sm px-4 py-2 text-sm font-bold transition-colors ${
                    mobileSliderSelection
                      ? "bg-brand-gold text-brand-black"
                      : "text-brand-white hover:text-brand-gold"
                  }`}
                  type="button"
                  onClick={() => setMobileSliderSelection(true)}
                >
                  Mobile
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Aspect Ratio" value={currentAspectRatio} />
              <MetricCard label="Ready Slots" value={`${filledSlots} / 2`} />
            </div>
          </div>

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
                aspectClass={aspectClass}
                key={`slot-${index}`}
              />
            ))}
          </div>

          <AuthMessage>{message}</AuthMessage>

          {filledSlots ? (
            <div className="max-w-xs">
              <AuthButton
                type="button"
                disabled={isLoading || isSubmitting}
                onClick={onSubmit}
              >
                {isSubmitting ? "Publishing..." : "Publish Sliders"}
              </AuthButton>
            </div>
          ) : null}
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
                <div className={`relative ${aspectClass} bg-brand-black`}>
                  <img
                    src={banner.image}
                    alt="Store slider"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
                  <span className="text-sm font-bold text-brand-white">
                    Live Slider #{banner.id}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                    {mobileSliderSelection ? "Mobile" : "Desktop"}
                  </span>
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
  aspectClass,
}) {
  const fileInputRef = useRef(null);
  const [cropFile, setCropFile] = useState(null);
  const filteredGroups = productGroups.filter((group) =>
    String(group?.name || "")
      .toLowerCase()
      .includes(String(slot.productGroupName || "").toLowerCase()),
  );

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }
    setCropFile(file);
  }

  return (
    <section className="rounded-sm border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-brand-white">Slider {index + 1}</h3>
        <button
          className="rounded-sm border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          Select Image
        </button>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-sm border border-white/10 bg-brand-black">
        {slot.preview ? (
          <div className={`relative ${aspectClass}`}>
            <img
              src={slot.preview}
              alt={`Slider ${index + 1} preview`}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className={`flex ${aspectClass} items-center justify-center text-sm text-white/35`}>
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
        ) : (
          <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/45">
            External redirects are available only on the Platinum plan.
          </div>
        )}
      </div>
      <AspectCropDialog
        open={Boolean(cropFile)}
        file={cropFile}
        title={`Crop Slider ${index + 1}`}
        aspectRatio={aspectClass === "aspect-[4/5]" ? 4 / 5 : 16 / 6}
        outputWidth={aspectClass === "aspect-[4/5]" ? 1080 : 1920}
        outputHeight={aspectClass === "aspect-[4/5]" ? 1350 : 720}
        onCancel={() => setCropFile(null)}
        onConfirm={({ dataUrl, base64 }) => {
          onUpdate(index, {
            preview: dataUrl,
            imageBase64: base64,
          });
          setCropFile(null);
        }}
      />
    </section>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function MetricCard({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-brand-white">{value}</p>
    </div>
  );
}
