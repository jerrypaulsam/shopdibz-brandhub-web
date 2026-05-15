import AuthButton from "@/src/components/auth/AuthButton";
import StoreSection from "@/src/components/store/StoreSection";

/**
 * @param {{ categories: Array<any>, subCategories: Array<any>, itemSubCategories: Array<any>, draft: any, chooseCategory: (value: string) => void, chooseSubCategory: (value: string) => void, chooseItemSubCategory: (value: string) => void, chooseVariantMode: (value: string) => void, chooseListingMode: (value: string) => void, continueToNext: () => Promise<void> }} props
 */
export default function ProductCategoryPanel({
  categories,
  subCategories,
  itemSubCategories,
  draft,
  chooseCategory,
  chooseSubCategory,
  chooseItemSubCategory,
  chooseVariantMode,
  chooseListingMode,
  continueToNext,
}) {
  return (
    <div className="space-y-6">
      <StoreSection
        title="Category Selection"
        subtitle="Choose the most specific category path so search, analytics, and bulk templates stay aligned."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-white/80">Category</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={draft.categorySlug}
              onChange={(event) => chooseCategory(event.target.value)}
            >
              <option className="bg-black" value="">
                Select category
              </option>
              {categories.map((category) => (
                <option className="bg-black" key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-white/80">Subcategory</span>
            <select
              className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
              value={draft.subCategorySlug}
              onChange={(event) => chooseSubCategory(event.target.value)}
            >
              <option className="bg-black" value="">
                Select subcategory
              </option>
              {subCategories.map((subCategory) => (
                <option className="bg-black" key={subCategory.slug} value={subCategory.slug}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {itemSubCategories.length ? (
          <div className="mt-5">
            <label className="block">
              <span className="text-sm font-semibold text-white/80">
                Item Subcategory
              </span>
              <select
                className="mt-3 w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none"
                value={draft.itemSubCategorySlug}
                onChange={(event) => chooseItemSubCategory(event.target.value)}
              >
                <option className="bg-black" value="">
                  Select item subcategory
                </option>
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
            </label>
          </div>
        ) : null}
      </StoreSection>

      <StoreSection
        title="Listing Type"
        subtitle="Pick the listing path first. We keep this in the URL so the right workspace can be opened directly."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            ["single", "Single Product", "Work through the guided product form and publish one product."],
            ["bulk", "Bulk Listing", "Upload the sheet, verify it, and submit it as a batch."],
          ].map(([value, label, copy]) => (
            <button
              className={`rounded-sm border p-5 text-left transition-colors ${
                draft.listingMode === value
                  ? "border-brand-gold bg-brand-gold/10"
                  : "border-white/10 hover:border-white/20"
              }`}
              key={value}
              type="button"
              onClick={() => chooseListingMode(value)}
            >
              <p className="text-sm font-bold text-brand-white">{label}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">{copy}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {[
            [
              "without-variant",
              "Without Variant",
              draft.listingMode === "bulk"
                ? "Use the non-variation bulk sheet and validation flow."
                : "Use one SKU with one image set and direct stock tracking.",
            ],
            [
              "with-variant",
              "With Variant",
              draft.listingMode === "bulk"
                ? "Use the variation bulk sheet so each row maps to the correct variation contract."
                : "Keep size, colour, weight, material, or flavour combinations under one listing.",
            ],
          ].map(([value, label, copy]) => (
            <button
              className={`rounded-sm border p-5 text-left transition-colors ${
                draft.variantMode === value
                  ? "border-brand-gold bg-brand-gold/10"
                  : "border-white/10 hover:border-white/20"
              }`}
              key={value}
              type="button"
              onClick={() => chooseVariantMode(value)}
            >
              <p className="text-sm font-bold text-brand-white">{label}</p>
              <p className="mt-2 text-sm leading-6 text-white/55">{copy}</p>
            </button>
          ))}
        </div>

        {draft.listingMode === "bulk" ? (
          <div className="mt-5 rounded-sm border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-white/55">
            Bulk listing keeps the same variant choice all the way through template download, sheet verification, and final upload.
          </div>
        ) : null}
      </StoreSection>

      <div className="max-w-xs">
        <AuthButton type="button" onClick={continueToNext}>
          Continue
        </AuthButton>
      </div>
    </div>
  );
}
