/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";

import AuthButton from "@/src/components/auth/AuthButton";
import AuthMessage from "@/src/components/auth/AuthMessage";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import AspectCropDialog from "@/src/components/media/AspectCropDialog";
import StoreField from "./StoreField";
import StoreSection from "./StoreSection";

/**
 * @param {{ storeInfo: any, productGroups: any[], filteredBanners: any[], mobileSliderSelection: boolean, setMobileSliderSelection: (value: boolean) => void, selectedBanner: any, selectBanner: (banner: any) => void, productGroupName: string, setProductGroupName: (value: string) => void, setProductGroupSlug: (value: string) => void, link: string, setLink: (value: string) => void, preview: string, setPreview: (value: string) => void, imageBase64: string, setImageBase64: (value: string) => void, currentAspectRatio: string, preferredSize: string, canUseExternalLinks: boolean, message: string, isLoading: boolean, isSubmitting: boolean, onSubmit: () => Promise<boolean>, onDelete: (bannerId: number) => Promise<boolean> }} props
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
  imageBase64,
  setImageBase64,
  currentAspectRatio,
  preferredSize,
  canUseExternalLinks,
  message,
  isLoading,
  isSubmitting,
  onSubmit,
  onDelete,
}) {
  const { confirm } = useConfirm();
  const fileInputRef = useRef(null);
  const [cropFile, setCropFile] = useState(null);
  const aspectClass = currentAspectRatio === "4:5" ? "aspect-[4/5]" : "aspect-[16/6]";
  const shownGroups = productGroups.filter((group) =>
    String(group?.name || "")
      .toLowerCase()
      .includes(productGroupName.toLowerCase()),
  );

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }
    setCropFile(file);
  }

  async function handleDelete(bannerId) {
    const accepted = await confirm({
      title: "Remove Slider",
      message: "This live slider will be removed from your storefront.",
      confirmLabel: "Remove Slider",
    });

    if (!accepted) {
      return;
    }

    await onDelete(bannerId);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <StoreSection title="Manage Website Sliders" subtitle="Review the current live set and switch between desktop and mobile slots.">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                  Active View
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
              <MetricCard label="Preferred Size" value={preferredSize} compact />
            </div>
          </div>

          {isLoading ? (
            <p className="mt-6 text-sm text-white/45">Loading live sliders...</p>
          ) : filteredBanners.length ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {filteredBanners.map((banner) => (
                <div
                  className={`overflow-hidden rounded-sm border transition-colors ${
                    selectedBanner?.id === banner.id
                      ? "border-brand-gold"
                      : "border-white/10 hover:border-brand-gold/40"
                  }`}
                  key={banner.id}
                >
                  <button
                    className="block w-full text-left"
                    type="button"
                    onClick={() => selectBanner(banner)}
                  >
                    <div className={`relative ${aspectClass} bg-brand-black`}>
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
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold">
                        {selectedBanner?.id === banner.id ? "Selected" : "Edit"}
                      </span>
                    </div>
                  </button>
                  <div className="border-t border-white/10 px-4 py-3">
                    <button
                      className="text-xs font-bold uppercase tracking-[0.12em] text-red-300 hover:text-red-100"
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleDelete(banner.id)}
                    >
                      Remove Slider
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-sm border border-white/10 bg-black/20 px-6 py-12 text-center">
              <p className="text-base font-bold text-brand-white">
                No active sliders found for this view.
              </p>
              <p className="mt-3 text-sm text-white/45">
                Use the publish flow when you want to create a new 2-image carousel set.
              </p>
            </div>
          )}
        </StoreSection>

        <StoreSection title="Workspace Notes">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-white/60">
              Pick a live slider on the left, replace the creative, or remove it from the storefront if needed.
            </p>
            <div className="grid w-full gap-3 sm:grid-cols-2">
              <MetricCard label="Visible Sliders" value={String(filteredBanners.length)} />
              <MetricCard label="Store Plan" value={storeInfo?.plan || "Free"} />
            </div>
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
                <div className={aspectClass}>
                  <img
                    src={preview}
                    alt="Updated slider preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className={aspectClass}>
                  <img
                    src={selectedBanner.image}
                    alt="Selected live slider"
                    className="h-full w-full object-cover opacity-75"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="Banner ID" value={`#${selectedBanner.id}`} />
              <MetricCard label="View" value={mobileSliderSelection ? "Mobile" : "Desktop"} />
            </div>

            <button
              className="block w-full rounded-sm border border-white/10 px-4 py-3 text-center text-sm font-bold text-brand-white transition-colors hover:border-brand-gold hover:text-brand-gold"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Replacement Image
            </button>
            <input
              ref={fileInputRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

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

            {imageBase64 ? (
              <AuthButton
                type="button"
                disabled={isSubmitting || isLoading}
                onClick={onSubmit}
              >
                {isSubmitting ? "Updating..." : "Update Slider"}
              </AuthButton>
            ) : null}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-white/45">
            Select a slider card from the left to begin.
          </div>
        )}

        <div className="mt-6 border-t border-white/10 pt-6 text-sm text-white/55">
          <p>Store plan: {storeInfo?.plan || "Free"}</p>
        </div>
        <AspectCropDialog
          open={Boolean(cropFile)}
          file={cropFile}
          title="Crop Replacement Slider"
          aspectRatio={currentAspectRatio === "4:5" ? 4 / 5 : 16 / 6}
          outputWidth={currentAspectRatio === "4:5" ? 1080 : 1920}
          outputHeight={currentAspectRatio === "4:5" ? 1350 : 720}
          onCancel={() => setCropFile(null)}
          onConfirm={({ dataUrl, base64 }) => {
            setPreview(dataUrl);
            setImageBase64(base64);
            setCropFile(null);
          }}
        />
      </StoreSection>
    </div>
  );
}

/**
 * @param {{ label: string, value: string, compact?: boolean }} props
 */
function MetricCard({ label, value, compact = false }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className={`mt-2 font-black text-brand-white ${compact ? "text-sm" : "text-lg"}`}>
        {value}
      </p>
    </div>
  );
}
