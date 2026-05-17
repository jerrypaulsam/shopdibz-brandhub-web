import Link from "next/link";
import { SPECIAL_PRODUCT_TYPES } from "@/src/utils/activity";
import ActivityFileInput from "./ActivityFileInput";

/**
 * @param {{ activeType: { slug: string }, fileName: string, isActionLoading: boolean, isPremium: boolean, pricingUrl: string, onTypeChange: (value: string) => void, onFileChange: (event: import("react").ChangeEvent<HTMLInputElement>) => void, onRemove: () => void, onUpload: () => void }} props
 */
export default function SpecialProductsPanel({
  activeType,
  fileName,
  isActionLoading,
  isPremium,
  pricingUrl,
  onTypeChange,
  onFileChange,
  onRemove,
  onUpload,
}) {
  return (
    <section className="theme-panel rounded-sm border p-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
          Special Products
        </p>
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
            isPremium
              ? "border-brand-gold/30 bg-brand-gold/10 text-brand-gold"
              : "border-red-500/30 bg-red-500/12 text-red-100 [html[data-theme='light']_&]:text-red-700"
          }`}
        >
          {isPremium ? "Premium" : "Premium required for upload"}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-extrabold text-brand-white">
        Bulk add or clear promoted slots
      </h3>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {SPECIAL_PRODUCT_TYPES.map((type) => (
          <button
            className={`rounded-sm border px-4 py-4 text-left transition-colors ${
              activeType.slug === type.slug
                ? "border-brand-gold/60 bg-brand-gold/10"
                : "theme-panel-soft hover:border-white/20"
            }`}
            key={type.slug}
            type="button"
            onClick={() => onTypeChange(type.slug)}
          >
            <p className="text-sm font-semibold text-brand-white">{type.label}</p>
            <p className="theme-text-muted mt-2 text-sm">{type.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <ActivityFileInput
          accept=".xls,.xlsx,.xlsm"
          fileName={fileName}
          helper="Upload the XLSM sheet to add products into the selected promotion bucket."
          id="special-products-file"
          label="Special products sheet"
          onChange={onFileChange}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="theme-primary-button min-h-11 rounded-sm border px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isActionLoading}
          onClick={onUpload}
        >
          {isActionLoading ? "Uploading..." : "Add from sheet"}
        </button>

        <button
          className="theme-action-neutral min-h-11 rounded-sm border px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isActionLoading}
          onClick={onRemove}
        >
          {isActionLoading ? "Removing..." : "Remove all from selected"}
        </button>

        {!isPremium && pricingUrl ? (
          <Link
            className="theme-action-accent inline-flex min-h-11 items-center rounded-sm border px-5 text-sm font-semibold transition-colors"
            href={pricingUrl}
          >
            Upgrade plan
          </Link>
        ) : null}
      </div>
    </section>
  );
}
