import Link from "next/link";
import AuthButton from "@/src/components/auth/AuthButton";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import { titleCaseValue } from "@/src/utils/product";

/**
 * @param {{ draft: any, selectionSummary: string, isBookCategory: boolean, gstOptions: Array<any>, shipZonesPreset: string[], shipExZonesPreset: string[], variationTypes: string[], fieldErrors: Record<string, string>, updateDraft: (value: any) => void, addKeyword: (value: string) => string, removeKeyword: (value: string) => void, addAttribute: () => void, updateAttribute: (id: number, key: "key" | "value", value: string) => void, removeAttribute: (id: number) => void, removeVariation: (id: number) => void, toggleShipZone: (value: string) => void, toggleShipExZone: (value: string) => void, chooseVariantType: (value: string) => Promise<void>, submitInfoForm: () => Promise<void>, isSubmitting: boolean, buildQuery: (patch?: Record<string, string>) => Record<string, string> }} props
 */
export default function ProductInfoPanel({
  draft,
  selectionSummary,
  isBookCategory,
  gstOptions,
  shipZonesPreset,
  shipExZonesPreset,
  variationTypes,
  fieldErrors = {},
  updateDraft,
  addKeyword,
  removeKeyword,
  addAttribute,
  updateAttribute,
  removeAttribute,
  removeVariation,
  toggleShipZone,
  toggleShipExZone,
  chooseVariantType,
  submitInfoForm,
  isSubmitting,
  buildQuery,
}) {
  async function handleKeywordKeyDown(event) {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();
    const keyword = event.currentTarget.value;
    const message = addKeyword(keyword);
    if (!message) {
      event.currentTarget.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <StoreSection
        title="Listing Context"
        subtitle="The current category path and listing mode stay in the URL, which makes this step easy to reopen or share."
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-brand-white">{selectionSummary || "No category selected"}</p>
            <p className="mt-1 text-sm text-white/55">
              {draft.listingMode === "bulk" ? "Bulk listing" : "Single listing"} /{" "}
              {draft.variantMode === "with-variant" ? "With variant" : "Without variant"}
            </p>
          </div>
          <Link
            className="rounded-sm border border-white/15 px-4 py-2 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
            href={{
              pathname: "/products/new/category",
              query: buildQuery(),
            }}
          >
            Change category
          </Link>
        </div>
      </StoreSection>

      <StoreSection title="Core Product Details">
        <div className="grid gap-5 md:grid-cols-2">
          <StoreField
            label="Title"
            value={draft.title}
            maxLength={180}
            error={fieldErrors.title}
            onChange={(value) => updateDraft({ title: value })}
          />
          {!isBookCategory ? (
            <StoreField
              label="Brand Name"
              value={draft.brand}
              error={fieldErrors.brand}
              onChange={(value) => updateDraft({ brand: value })}
            />
          ) : (
            <StoreField
              label="Name of Publisher"
              value={draft.publisher}
              error={fieldErrors.publisher}
              onChange={(value) => updateDraft({ publisher: value })}
            />
          )}
          {draft.variantMode === "without-variant" ? (
            <>
              <StoreField
                label="MRP"
                type="number"
                value={draft.mrp}
                error={fieldErrors.mrp}
                onChange={(value) => updateDraft({ mrp: value })}
              />
              <StoreField
                label="Selling Price"
                type="number"
                value={draft.price}
                error={fieldErrors.price}
                onChange={(value) => updateDraft({ price: value })}
              />
            </>
          ) : null}
        </div>

        <div className="mt-5">
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Product Keywords</span>
            <input
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none placeholder:text-white/30"
              placeholder="Press enter or comma after each keyword"
              type="text"
              onKeyDown={handleKeywordKeyDown}
            />
          </label>
          {draft.keywords.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.keywords.map((keyword) => (
                <button
                  className="rounded-full border border-white/15 px-3 py-1 text-sm text-brand-white"
                  key={keyword}
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                >
                  {keyword} x
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </StoreSection>

      <StoreSection title="Compliance & Catalog Attributes">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-white/80">GST Rate</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={draft.gstRate}
              onChange={(event) => updateDraft({ gstRate: event.target.value })}
            >
              <option className="bg-black" value="">
                Choose GST rate
              </option>
              {gstOptions.map((option) => (
                <option className="bg-black" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.gstRate ? (
              <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.gstRate}</p>
            ) : null}
          </label>
          <StoreField
            label="HSN Code"
            value={draft.hsnCode}
            error={fieldErrors.hsnCode}
            onChange={(value) => updateDraft({ hsnCode: value })}
          />
          {draft.variantMode === "without-variant" ? (
            <StoreField
              label="SKU Code"
              value={draft.skuCode}
              error={fieldErrors.skuCode}
              onChange={(value) => updateDraft({ skuCode: value })}
            />
          ) : null}
          <StoreField
            label={isBookCategory ? "ISBN" : "MPN / GTIN"}
            value={draft.mpn}
            onChange={(value) => updateDraft({ mpn: value })}
          />
          <StoreField
            label="Manufacturer"
            value={draft.manufacturerValue}
            error={fieldErrors.manufacturerValue}
            onChange={(value) => updateDraft({ manufacturerValue: value })}
          />
          <StoreField
            label="Country of Origin"
            value={draft.originCountryValue}
            error={fieldErrors.originCountryValue}
            onChange={(value) => updateDraft({ originCountryValue: value })}
          />
        </div>

        <div className="mt-5 space-y-4">
          {draft.attributes.map((attribute) => (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" key={attribute.id}>
              <StoreField
                label="Attribute Title"
                value={attribute.key}
                error={fieldErrors[`attribute-${attribute.id}-key`]}
                onChange={(value) => updateAttribute(attribute.id, "key", value)}
              />
              <StoreField
                label="Attribute Value"
                value={attribute.value}
                error={fieldErrors[`attribute-${attribute.id}-value`]}
                onChange={(value) => updateAttribute(attribute.id, "value", value)}
              />
              <button
                className="mt-8 h-12 rounded-sm border border-red-400/40 px-4 text-sm font-semibold text-red-300 hover:border-red-300"
                type="button"
                onClick={() => removeAttribute(attribute.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 max-w-xs">
          <button
            className="w-full rounded-sm border border-white/15 px-4 py-3 text-sm font-semibold text-brand-white hover:border-brand-gold hover:text-brand-gold"
            type="button"
            onClick={addAttribute}
          >
            Add Attribute
          </button>
        </div>
      </StoreSection>

      <StoreSection title="Description & Optional Details">
        <div className="grid gap-5">
          <StoreField
            label="Product Description"
            multiline
            maxLength={6000}
            helper="Supports HTML tags in the description as well."
            value={draft.description}
            error={fieldErrors.description}
            onChange={(value) => updateDraft({ description: value })}
          />
          {!isBookCategory ? (
            <StoreField
              label="Brand Authenticity Certificate"
              helper="Public URL to the certificate."
              value={draft.brandCertificate}
              onChange={(value) => updateDraft({ brandCertificate: value })}
            />
          ) : null}
          <StoreField
            label="Video URL (YouTube)"
            value={draft.videoUrl}
            error={fieldErrors.videoUrl}
            onChange={(value) => updateDraft({ videoUrl: value })}
          />
        </div>
      </StoreSection>

      <StoreSection title="Availability, Shipping & Variant Path">
        {draft.variantMode === "without-variant" ? (
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-white/80">Item Availability</span>
              <select
                className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
                value={draft.stock}
                onChange={(event) => updateDraft({ stock: event.target.value })}
              >
                <option className="bg-black" value="S">
                  In Stock
                </option>
                <option className="bg-black" value="O">
                  Out of Stock
                </option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-white/80">Item Condition</span>
              <select
                className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
                value={draft.condition}
                onChange={(event) => updateDraft({ condition: event.target.value })}
              >
                <option className="bg-black" value="N">
                  New
                </option>
                <option className="bg-black" value="R">
                  Refurbished
                </option>
              </select>
            </label>
            {draft.stock === "S" ? (
              <StoreField
                label={draft.enablePrebooking ? "Prebook Quantity" : "Quantity"}
                value={draft.maxStock}
                onChange={(value) => updateDraft({ maxStock: value })}
              />
            ) : null}
            {fieldErrors.variations ? (
              <p className="text-sm font-semibold text-red-300">{fieldErrors.variations}</p>
            ) : null}
          </div>
        ) : (
          <div className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-white/80">Variation Type</span>
              <select
                className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                value={draft.variantType}
                disabled={draft.variations.length > 0}
                onChange={(event) => chooseVariantType(event.target.value)}
              >
                <option className="bg-black" value="">
                  Choose variation type
                </option>
                {variationTypes.map((variationType) => (
                  <option className="bg-black" key={variationType} value={variationType}>
                    {titleCaseValue(variationType)}
                  </option>
                ))}
              </select>
              {draft.variations.length ? (
                <p className="mt-2 text-xs text-white/45">
                  Variation type is locked to {titleCaseValue(draft.variantType)} while variants exist.
                </p>
              ) : null}
            </label>

            {draft.variations.length ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-brand-white">
                    Added {titleCaseValue(draft.variantType)} Options
                  </p>
                  <Link
                    className="rounded-sm border border-brand-gold/40 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-gold hover:border-brand-gold hover:text-brand-white"
                    href={{
                      pathname: "/products/new/variation",
                      query: buildQuery(),
                    }}
                  >
                    Add Another
                  </Link>
                </div>
                {draft.variations.map((variation) => (
                  <div
                    className="rounded-sm border border-white/10 bg-black/20 p-4"
                    key={variation.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-brand-white">
                          {variation.variationTypes[0]?.name}
                        </p>
                        <p className="mt-1 text-sm text-white/55">
                          {variation.variationTypes[0]?.typeMap} / Rs. {variation.price} / MRP Rs.{" "}
                          {variation.mrp}
                        </p>
                      </div>
                      <button
                        className="rounded-sm border border-red-400/40 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-red-300"
                        type="button"
                        onClick={() => removeVariation(variation.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[
            ["enablePrebooking", "Enable Prebooking", "Platinum behavior on Flutter is kept as a normal toggle on web for now."],
            ["showSizeChart", "Show Size Chart", "Enable this when the store-level size guide should appear for this product."],
            ["shippingProfile", "Shipping Profile", "Turn this on when the product has restricted delivery zones instead of all-India shipping."],
          ].map(([key, label, helper]) => (
            <label className="flex items-start gap-3 rounded-sm border border-white/10 p-4" key={key}>
              <input
                checked={Boolean(draft[key])}
                className="mt-1"
                type="checkbox"
                onChange={(event) => updateDraft({ [key]: event.target.checked })}
              />
              <span>
                <span className="block text-sm font-bold text-brand-white">{label}</span>
                <span className="mt-1 block text-sm leading-6 text-white/55">{helper}</span>
              </span>
            </label>
          ))}
        </div>

        {draft.shippingProfile ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-brand-white">Delivery Zones</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {shipZonesPreset.map((zone) => {
                  const active = draft.shipZones.includes(zone);
                  return (
                    <button
                      className={`rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] ${
                        active
                          ? "border-brand-gold bg-brand-gold/10 text-brand-white"
                          : "border-white/10 text-white/55"
                      }`}
                      key={zone}
                      type="button"
                      onClick={() => toggleShipZone(zone)}
                    >
                      {zone}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-brand-white">Excluded Delivery Zones</p>
              <div className="mt-3 flex max-h-60 flex-wrap gap-2 overflow-y-auto">
                {shipExZonesPreset.map((zone) => {
                  const active = draft.shipExZones.includes(zone);
                  return (
                    <button
                      className={`rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] ${
                        active
                          ? "border-brand-gold bg-brand-gold/10 text-brand-white"
                          : "border-white/10 text-white/55"
                      }`}
                      key={zone}
                      type="button"
                      onClick={() => toggleShipExZone(zone)}
                    >
                      {zone}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </StoreSection>

      <div className="max-w-xs">
        <AuthButton type="button" disabled={isSubmitting} onClick={submitInfoForm}>
          {isSubmitting
            ? "Submitting..."
            : draft.variantMode === "with-variant"
              ? "Add Product"
              : "Continue To Images"}
        </AuthButton>
      </div>
    </div>
  );
}
