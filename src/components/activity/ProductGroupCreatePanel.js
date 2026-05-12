import { useState } from "react";
import Link from "next/link";
import AspectCropDialog from "@/src/components/media/AspectCropDialog";
import { PRODUCT_GROUP_DISCOUNT_TYPES } from "@/src/utils/activity";
import ActivityFileInput from "./ActivityFileInput";

/**
 * @param {{ groupName: string, groupDiscountType: string, groupDiscount: string, groupImageName: string, isActionLoading: boolean, isPremium: boolean, pricingUrl: string, showOnHome: boolean, onGroupNameChange: (value: string) => void, onGroupDiscountTypeChange: (value: string) => void, onGroupDiscountChange: (value: string) => void, onShowOnHomeChange: (value: boolean) => void, onImageCropped: (payload: { fileName: string, base64: string }) => void, onSubmit: () => void }} props
 */
export default function ProductGroupCreatePanel({
  groupName,
  groupDiscountType,
  groupDiscount,
  groupImageName,
  isActionLoading,
  isPremium,
  pricingUrl,
  showOnHome,
  onGroupNameChange,
  onGroupDiscountTypeChange,
  onGroupDiscountChange,
  onShowOnHomeChange,
  onImageCropped,
  onSubmit,
}) {
  const [cropFile, setCropFile] = useState(null);

  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
          Product Group
        </p>
        <StatusPill label={isPremium ? "Premium" : "Upgrade required"} tone={isPremium ? "gold" : "red"} />
      </div>

      <h3 className="mt-3 text-xl font-extrabold text-brand-white">
        Create a group for merchandising and banner-driven campaigns
      </h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
        After creating the group, use the Product Groups area to bulk add product
        codes and manage visibility.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-brand-white">Group name</span>
          <input
            className="mt-2 min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-4 text-sm text-brand-white outline-none transition-colors focus:border-brand-gold/50"
            maxLength={30}
            type="text"
            value={groupName}
            onChange={(event) => onGroupNameChange(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-brand-white">Offer type</span>
          <select
            className="mt-2 min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-4 text-sm text-brand-white outline-none transition-colors focus:border-brand-gold/50"
            value={groupDiscountType}
            onChange={(event) => onGroupDiscountTypeChange(event.target.value)}
          >
            {PRODUCT_GROUP_DISCOUNT_TYPES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-brand-white">Discount</span>
          <input
            className="mt-2 min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-4 text-sm text-brand-white outline-none transition-colors focus:border-brand-gold/50"
            inputMode="numeric"
            type="number"
            value={groupDiscount}
            onChange={(event) => onGroupDiscountChange(event.target.value)}
          />
          <span className="mt-2 block text-xs text-white/40">
            Use rupees for Amount or percent value for Percentage.
          </span>
        </label>

        <div className="block">
          <span className="text-sm font-semibold text-brand-white">
            Show on brand page
          </span>
          <div className="mt-2 flex gap-3">
            <ToggleButton
              active={showOnHome}
              label="Yes"
              onClick={() => onShowOnHomeChange(true)}
            />
            <ToggleButton
              active={!showOnHome}
              label="No"
              onClick={() => onShowOnHomeChange(false)}
            />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ActivityFileInput
          accept="image/*"
          fileName={groupImageName}
          helper="Upload a cover image for the group banner card. Preferred image size: 1134px x 634px."
          id="product-group-cover"
          label="Group banner image"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) {
              setCropFile(file);
            }
          }}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="min-h-11 rounded-sm bg-brand-red px-5 text-sm font-semibold text-brand-white transition-colors hover:bg-[#ff6969] disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isActionLoading}
          onClick={onSubmit}
        >
          {isActionLoading ? "Creating..." : "Create product group"}
        </button>

        <Link
          className="inline-flex min-h-11 items-center rounded-sm border border-white/10 px-5 text-sm font-semibold text-white/75 transition-colors hover:border-white/20 hover:text-brand-white"
          href="/product-groups"
        >
          Manage groups
        </Link>

        {!isPremium && pricingUrl ? (
          <a
            className="inline-flex min-h-11 items-center rounded-sm border border-brand-gold/30 px-5 text-sm font-semibold text-brand-gold transition-colors hover:border-brand-gold hover:text-brand-white"
            href={pricingUrl}
            rel="noreferrer"
            target="_blank"
          >
            Upgrade plan
          </a>
        ) : null}
      </div>
      <AspectCropDialog
        open={Boolean(cropFile)}
        file={cropFile}
        title="Crop Product Group Banner"
        aspectRatio={1134 / 634}
        outputWidth={1134}
        outputHeight={634}
        outputMimeType="image/jpeg"
        onCancel={() => setCropFile(null)}
        onConfirm={({ fileName, base64 }) => {
          onImageCropped({
            fileName,
            base64,
          });
          setCropFile(null);
        }}
      />
    </section>
  );
}

/**
 * @param {{ active: boolean, label: string, onClick: () => void }} props
 */
function ToggleButton({ active, label, onClick }) {
  return (
    <button
      className={`min-h-11 rounded-sm border px-5 text-sm font-semibold transition-colors ${
        active
          ? "border-brand-gold/60 bg-brand-gold/10 text-brand-white"
          : "border-white/10 bg-black/20 text-white/65 hover:border-white/20"
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/**
 * @param {{ label: string, tone: "gold" | "green" | "red" }} props
 */
function StatusPill({ label, tone }) {
  const className =
    tone === "green"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : tone === "red"
        ? "border-red-500/30 bg-red-500/10 text-red-200"
        : "border-brand-gold/30 bg-brand-gold/10 text-brand-gold";

  return (
    <span className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${className}`}>
      {label}
    </span>
  );
}
