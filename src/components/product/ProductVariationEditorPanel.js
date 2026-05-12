import AuthButton from "@/src/components/auth/AuthButton";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import { titleCaseValue } from "@/src/utils/product";

/**
 * @param {{ form: any, mappingOptions: any[], lockedVariantType?: string, fieldErrors: Record<string, string>, isNew?: boolean, setFormField: (field: string, value: string) => void, submit: () => Promise<void>, isSubmitting: boolean }} props
 */
export default function ProductVariationEditorPanel({
  form,
  mappingOptions,
  lockedVariantType,
  fieldErrors = {},
  isNew = false,
  setFormField,
  submit,
  isSubmitting,
}) {
  return (
    <div className="space-y-6">
      <StoreSection title={isNew ? "New Variation" : "Variation Details"}>
        <div className="grid gap-5 md:grid-cols-2">
          {isNew ? (
            <div className="block">
              <span className="text-sm font-semibold text-white/80">Variation Type</span>
              <div className="mt-3 w-full rounded-[15px] border border-white/15 bg-white/[0.03] px-4 py-3 text-base font-semibold text-brand-white">
                {titleCaseValue(lockedVariantType || form.variantType || "Variation")}
              </div>
              {fieldErrors.variantType ? (
                <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.variantType}</p>
              ) : null}
            </div>
          ) : null}

          <StoreField label="Variation Name" value={form.name} error={fieldErrors.name} onChange={(value) => setFormField("name", value)} />
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Type Mapping</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.typeMap}
              onChange={(event) => setFormField("typeMap", event.target.value)}
            >
              <option className="bg-black" value="">Choose mapping</option>
              {mappingOptions.map((option) => (
                <option
                  className="bg-black"
                  key={typeof option === "object" ? option.name : String(option)}
                  value={typeof option === "object" ? option.name : String(option)}
                >
                  {typeof option === "object" ? option.name : String(option)}
                </option>
              ))}
            </select>
            {fieldErrors.typeMap ? (
              <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.typeMap}</p>
            ) : null}
          </label>
          <StoreField label="MRP" value={form.mrp} error={fieldErrors.mrp} onChange={(value) => setFormField("mrp", value)} />
          <StoreField label="Selling Price" value={form.price} error={fieldErrors.price} onChange={(value) => setFormField("price", value)} />
          <StoreField label="SKU Code" value={form.variationSkuCode} error={fieldErrors.variationSkuCode} onChange={(value) => setFormField("variationSkuCode", value)} />
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Availability</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.stock}
              onChange={(event) => setFormField("stock", event.target.value)}
            >
              <option className="bg-black" value="S">In Stock</option>
              <option className="bg-black" value="O">Out of Stock</option>
            </select>
          </label>
          {form.stock === "S" ? (
            <StoreField label="Stock Quantity" value={form.maxStock} error={fieldErrors.maxStock} onChange={(value) => setFormField("maxStock", value)} />
          ) : null}
        </div>
      </StoreSection>

      <div className="max-w-xs">
        <AuthButton type="button" disabled={isSubmitting} onClick={submit}>
          {isSubmitting ? "Saving..." : isNew ? "Add Variant" : "Update Variant"}
        </AuthButton>
      </div>
    </div>
  );
}
