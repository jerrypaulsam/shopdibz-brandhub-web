import AuthButton from "@/src/components/auth/AuthButton";
import StoreField from "@/src/components/store/StoreField";
import StoreSection from "@/src/components/store/StoreSection";
import {
  PRODUCT_GST_OPTIONS,
  PRODUCT_SHIP_EX_ZONES,
  PRODUCT_SHIP_ZONES,
} from "@/src/data/product-variation-options";

/**
 * @param {{ form: any, categories: any[], subCategories: any[], itemSubCategories: any[], fieldErrors: Record<string, string>, setFormField: (field: string, value: any) => void, addAttribute: () => void, updateAttribute: (id: number, key: "key" | "value", value: string) => void, removeAttribute: (id: number) => void, addKeyword: (value: string) => string, removeKeyword: (value: string) => void, toggleShipZone: (value: string) => void, toggleShipExZone: (value: string) => void, submit: () => Promise<void>, isSubmitting: boolean }} props
 */
export default function ProductEditorPanel({
  form,
  categories,
  subCategories,
  itemSubCategories,
  fieldErrors = {},
  setFormField,
  addAttribute,
  updateAttribute,
  removeAttribute,
  addKeyword,
  removeKeyword,
  toggleShipZone,
  toggleShipExZone,
  submit,
  isSubmitting,
}) {
  async function handleKeywordKeyDown(event) {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();
    const message = addKeyword(event.currentTarget.value);
    if (!message) {
      event.currentTarget.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <StoreSection title="Catalog Path & Identity">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Category</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.categorySlug}
              onChange={(event) => setFormField("categorySlug", event.target.value)}
            >
              <option className="bg-black" value="">Select category</option>
              {categories.map((category) => (
                <option className="bg-black" key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldErrors.categorySlug ? (
              <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.categorySlug}</p>
            ) : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Subcategory</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.subCategorySlug}
              onChange={(event) => setFormField("subCategorySlug", event.target.value)}
            >
              <option className="bg-black" value="">Select subcategory</option>
              {subCategories.map((subCategory) => (
                <option className="bg-black" key={subCategory.slug} value={subCategory.slug}>
                  {subCategory.name}
                </option>
              ))}
            </select>
            {fieldErrors.subCategorySlug ? (
              <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.subCategorySlug}</p>
            ) : null}
          </label>
          {itemSubCategories.length ? (
            <label className="block">
              <span className="text-sm font-semibold text-white/80">Item Subcategory</span>
              <select
                className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
                value={form.itemSubCategorySlug}
                onChange={(event) => setFormField("itemSubCategorySlug", event.target.value)}
              >
                <option className="bg-black" value="">Select item subcategory</option>
                {itemSubCategories.map((itemSubCategory) => (
                  <option
                    className="bg-black"
                    key={itemSubCategory.slug}
                    value={itemSubCategory.slug}
                  >
                    {itemSubCategory.name}
                  </option>
                ))}
                </select>
                {fieldErrors.itemSubCategorySlug ? (
                  <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.itemSubCategorySlug}</p>
                ) : null}
              </label>
          ) : null}
          <StoreField label="Title" value={form.title} error={fieldErrors.title} onChange={(value) => setFormField("title", value)} />
          <StoreField label="Brand" value={form.brand} onChange={(value) => setFormField("brand", value)} />
          <StoreField label="Publisher" value={form.publisher} onChange={(value) => setFormField("publisher", value)} />
        </div>
      </StoreSection>

      <StoreSection title="Pricing, Tax & Catalog Codes">
        <div className="grid gap-5 md:grid-cols-2">
          {!form.variants ? (
            <>
              <StoreField label="MRP" value={form.mrp} error={fieldErrors.mrp} onChange={(value) => setFormField("mrp", value)} />
              <StoreField label="Price" value={form.price} error={fieldErrors.price} onChange={(value) => setFormField("price", value)} />
              <StoreField label="SKU Code" value={form.skuCode} error={fieldErrors.skuCode} onChange={(value) => setFormField("skuCode", value)} />
            </>
          ) : null}
          <StoreField label="Shipping Cost" value={form.shipCost} onChange={(value) => setFormField("shipCost", value)} />
          <StoreField label="HSN Code" value={form.hsnCode} error={fieldErrors.hsnCode} onChange={(value) => setFormField("hsnCode", value)} />
          <StoreField label="MPN / GTIN" value={form.mpn} onChange={(value) => setFormField("mpn", value)} />
          <label className="block">
            <span className="text-sm font-semibold text-white/80">GST Rate</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.gstRate}
              onChange={(event) => setFormField("gstRate", event.target.value)}
            >
              <option className="bg-black" value="">Choose GST rate</option>
              {PRODUCT_GST_OPTIONS.map((option) => (
                <option className="bg-black" key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldErrors.gstRate ? (
              <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.gstRate}</p>
            ) : null}
          </label>
        </div>
      </StoreSection>

      <StoreSection title="Keywords, Description & Attributes">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Keywords</span>
            <input
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none placeholder:text-white/30"
              placeholder="Press enter or comma after each keyword"
              type="text"
              onKeyDown={handleKeywordKeyDown}
            />
          </label>
          {form.keywords.length ? (
            <div className="flex flex-wrap gap-2">
              {form.keywords.map((keyword) => (
                <button
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-brand-white"
                  key={keyword}
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                >
                  {keyword} x
                </button>
              ))}
            </div>
          ) : null}

          <StoreField
            label="Description"
            multiline
            value={form.description}
            error={fieldErrors.description}
            onChange={(value) => setFormField("description", value)}
          />
          <StoreField
            label="Brand Certificate URL"
            value={form.brandCertificate}
            onChange={(value) => setFormField("brandCertificate", value)}
          />
          <StoreField
            label="Video URL"
            value={form.videoUrl}
            error={fieldErrors.videoUrl}
            onChange={(value) => setFormField("videoUrl", value)}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <StoreField
              label="Manufacturer"
              value={form.manufacturerValue}
              error={fieldErrors.manufacturerValue}
              onChange={(value) => setFormField("manufacturerValue", value)}
            />
            <StoreField
              label="Country of Origin"
              value={form.originCountryValue}
              error={fieldErrors.originCountryValue}
              onChange={(value) => setFormField("originCountryValue", value)}
            />
          </div>

          <div className="space-y-4">
            {form.attributes.map((attribute) => (
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
                  className="mt-8 h-12 rounded-sm border border-red-400/40 px-4 text-sm font-semibold text-red-300"
                  type="button"
                  onClick={() => removeAttribute(attribute.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="max-w-xs">
            <button
              className="w-full rounded-sm border border-white/15 px-4 py-3 text-sm font-semibold text-brand-white"
              type="button"
              onClick={addAttribute}
            >
              Add Attribute
            </button>
          </div>
        </div>
      </StoreSection>

      <StoreSection title="Fulfillment Settings">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Stock</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.stock}
              onChange={(event) => setFormField("stock", event.target.value)}
            >
              <option className="bg-black" value="S">In Stock</option>
              <option className="bg-black" value="O">Out of Stock</option>
            </select>
          </label>
          <StoreField label="Max Stock" value={form.maxStock} onChange={(value) => setFormField("maxStock", value)} />
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Condition</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={form.condition}
              onChange={(event) => setFormField("condition", event.target.value)}
            >
              <option className="bg-black" value="N">New</option>
              <option className="bg-black" value="R">Refurbished</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {[
            ["shippingProfile", "Shipping Profile"],
            ["showSizeChart", "Show Size Chart"],
            ["enablePrebooking", "Enable Prebooking"],
          ].map(([field, label]) => (
            <label className="flex items-start gap-3 rounded-sm border border-white/10 p-4" key={field}>
              <input
                checked={Boolean(form[field])}
                className="mt-1"
                type="checkbox"
                onChange={(event) => setFormField(field, event.target.checked)}
              />
              <span className="text-sm font-semibold text-brand-white">{label}</span>
            </label>
          ))}
        </div>

        {form.shippingProfile ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div>
              <p className="text-sm font-bold text-brand-white">Shipping Zones</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRODUCT_SHIP_ZONES.map((zone) => (
                  <button
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      form.shipZones.includes(zone)
                        ? "border-brand-gold bg-brand-gold/10 text-brand-white"
                        : "border-white/10 text-white/55"
                    }`}
                    key={zone}
                    type="button"
                    onClick={() => toggleShipZone(zone)}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-brand-white">Excluded Zones</p>
              <div className="mt-3 flex max-h-64 flex-wrap gap-2 overflow-y-auto">
                {PRODUCT_SHIP_EX_ZONES.map((zone) => (
                  <button
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      form.shipExZones.includes(zone)
                        ? "border-brand-gold bg-brand-gold/10 text-brand-white"
                        : "border-white/10 text-white/55"
                    }`}
                    key={zone}
                    type="button"
                    onClick={() => toggleShipExZone(zone)}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </StoreSection>

      <div className="max-w-xs">
        <AuthButton type="button" disabled={isSubmitting} onClick={submit}>
          {isSubmitting ? "Updating..." : "Update Product"}
        </AuthButton>
      </div>
    </div>
  );
}
