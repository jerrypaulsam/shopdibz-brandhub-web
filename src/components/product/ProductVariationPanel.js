import AuthButton from "@/src/components/auth/AuthButton";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import { titleCaseValue } from "@/src/utils/product";

/**
 * @param {{ draft: any, form: any, mappingOptions: Array<any>, error: string, fieldErrors: Record<string, string>, setFormField: (field: string, value: string) => void, addCurrentVariation: () => Promise<void>, finishVariations: () => Promise<void>, removeVariation: (id: number) => void }} props
 */
export default function ProductVariationPanel({
  draft,
  form,
  mappingOptions,
  error,
  fieldErrors = {},
  setFormField,
  addCurrentVariation,
  finishVariations,
  removeVariation,
}) {
  const variantTypeLabel = titleCaseValue(draft.variantType || "Variation");

  return (
    <div className="space-y-6">
      <StoreSection
        title="Variation Builder"
        subtitle="Add one variant at a time. The variant type comes from the URL-driven info step so teams always land on the right builder."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <StoreField
            label={`${variantTypeLabel} Name`}
            value={form.name}
            error={fieldErrors.name}
            onChange={(value) => setFormField("name", value)}
          />

          <label className="block">
            <span className="text-sm font-semibold text-white/80">Map To {variantTypeLabel}</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.typeMap}
              onChange={(event) => setFormField("typeMap", event.target.value)}
            >
              <option className="bg-black" value="">
                Select mapping
              </option>
              {mappingOptions.map((option) => {
                if (typeof option === "object") {
                  return (
                    <option className="bg-black" key={option.name} value={option.name}>
                      {option.name}
                    </option>
                  );
                }

                return (
                  <option className="bg-black" key={option} value={String(option)}>
                    {String(option)}
                  </option>
                );
              })}
            </select>
            {fieldErrors.typeMap ? (
              <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.typeMap}</p>
            ) : null}
          </label>

          <StoreField
            label="MRP"
            type="number"
            value={form.mrp}
            error={fieldErrors.mrp}
            onChange={(value) => setFormField("mrp", value)}
          />
          <StoreField
            label="Selling Price"
            type="number"
            value={form.price}
            error={fieldErrors.price}
            onChange={(value) => setFormField("price", value)}
          />
          <StoreField
            label="SKU Code"
            value={form.variationSkuCode}
            error={fieldErrors.variationSkuCode}
            onChange={(value) => setFormField("variationSkuCode", value)}
          />
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Stock</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.stock}
              onChange={(event) => setFormField("stock", event.target.value)}
            >
              <option className="bg-black" value="S">
                In Stock
              </option>
              <option className="bg-black" value="O">
                Out of Stock
              </option>
            </select>
          </label>
          {form.stock === "S" ? (
            <StoreField
              label="Quantity"
              value={form.maxStock}
              error={fieldErrors.maxStock}
              onChange={(value) => setFormField("maxStock", value)}
            />
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <div className="mt-6 max-w-xs">
          <AuthButton type="button" onClick={addCurrentVariation}>
            Add {variantTypeLabel} Option
          </AuthButton>
        </div>
      </StoreSection>

      <StoreSection title="Added Variants">
        {draft.variations.length ? (
          <div className="space-y-3">
            {draft.variations.map((variation) => (
              <div
                className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-white/10 bg-black/20 p-4"
                key={variation.id}
              >
                <div>
                  <p className="text-sm font-bold text-brand-white">
                    {variation.variationTypes[0]?.name}
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    {variation.variationTypes[0]?.typeMap} / Rs. {variation.price} / MRP Rs.{" "}
                    {variation.mrp} / Stock {variation.maxStock}
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
            ))}
          </div>
        ) : (
          <p className="text-sm leading-6 text-white/55">
            No variants added yet. Once you add one, it becomes part of the product payload immediately.
          </p>
        )}
      </StoreSection>

      <div className="max-w-xs">
        <AuthButton
          type="button"
          disabled={!draft.variations.length}
          onClick={finishVariations}
        >
          Done With Variations
        </AuthButton>
      </div>
    </div>
  );
}
