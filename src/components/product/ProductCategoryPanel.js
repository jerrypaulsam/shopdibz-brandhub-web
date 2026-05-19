import { useMemo, useState } from "react";
import AuthButton from "@/src/components/auth/AuthButton";
import ProductSearchableSelect from "@/src/components/product/ProductSearchableSelect";
import StoreSection from "@/src/components/store/StoreSection";
import { findProductCategoryPathMatches } from "@/src/data/product-category-search";

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
  const [catalogSearch, setCatalogSearch] = useState("");
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    [categories],
  );
  const subCategoryOptions = useMemo(
    () =>
      subCategories.map((subCategory) => ({
        value: subCategory.slug,
        label: subCategory.name,
      })),
    [subCategories],
  );
  const itemSubCategoryOptions = useMemo(
    () =>
      itemSubCategories.map((itemSubCategory) => ({
        value: itemSubCategory.slug,
        label: itemSubCategory.name,
      })),
    [itemSubCategories],
  );
  const smartMatches = useMemo(
    () => findProductCategoryPathMatches(categories, catalogSearch, 5),
    [categories, catalogSearch],
  );

  function applySuggestedPath(path) {
    chooseCategory(path.categorySlug);
    chooseSubCategory(path.subCategorySlug);
    chooseItemSubCategory(path.itemSubCategorySlug || "");
    setCatalogSearch(path.label);
  }

  return (
    <div className="space-y-6">
      <StoreSection
        title="Category Selection"
        subtitle="Choose the most specific category path so search, analytics, and bulk templates stay aligned."
      >
        <div className="mb-5 rounded-[18px] border border-white/10 bg-black/20 p-4">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-white/80">Smart Category Search</p>
              <p className="mt-1 text-xs leading-5 text-white/45">
                Search with product or category keywords to see the most probable path from category.json and fill the dropdowns in one click.
              </p>
            </div>

            <input
              className="w-full rounded-[15px] border border-white/15 bg-transparent px-4 py-3 text-base text-brand-white outline-none placeholder:text-white/25"
              type="text"
              value={catalogSearch}
              placeholder="Try: t-shirt, cricket bat, face wash"
              onChange={(event) => setCatalogSearch(event.target.value)}
            />

            {catalogSearch.trim() ? (
              smartMatches.length ? (
                <div className="space-y-2">
                  {smartMatches.map((match, index) => (
                    <button
                      className={`block w-full rounded-[14px] border px-4 py-3 text-left transition-colors ${
                        index === 0
                          ? "border-brand-gold/35 bg-brand-gold/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                      key={match.key}
                      type="button"
                      onClick={() => applySuggestedPath(match)}
                    >
                      <p className="text-sm font-bold text-brand-white">
                        {index === 0 ? "Best match" : "Suggested path"}
                      </p>
                      <p className="mt-1 text-sm text-white/70">{match.label}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/45">
                  No probable category flow found for that search yet.
                </p>
              )
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ProductSearchableSelect
            label="Category"
            value={draft.categorySlug}
            options={categoryOptions}
            placeholder="Select category"
            onChange={chooseCategory}
          />

          <ProductSearchableSelect
            label="Subcategory"
            value={draft.subCategorySlug}
            options={subCategoryOptions}
            placeholder="Select subcategory"
            onChange={chooseSubCategory}
            disabled={!draft.categorySlug}
            emptyMessage={draft.categorySlug ? "No subcategories found." : "Choose a category first."}
          />
        </div>

        {itemSubCategories.length ? (
          <div className="mt-5">
            <ProductSearchableSelect
              label="Item Subcategory"
              value={draft.itemSubCategorySlug}
              options={itemSubCategoryOptions}
              placeholder="Select item subcategory"
              onChange={chooseItemSubCategory}
              disabled={!draft.subCategorySlug}
              emptyMessage={draft.subCategorySlug ? "No item subcategories found." : "Choose a subcategory first."}
            />
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
