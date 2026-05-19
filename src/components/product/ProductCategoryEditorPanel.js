import { useMemo, useState } from "react";
import AuthButton from "@/src/components/auth/AuthButton";
import ProductSearchableSelect from "@/src/components/product/ProductSearchableSelect";
import StoreSection from "@/src/components/store/StoreSection";
import { findProductCategoryPathMatches } from "@/src/data/product-category-search";

/**
 * @param {{ title: string, form: any, categories: any[], subCategories: any[], itemSubCategories: any[], fieldErrors: Record<string, string>, setFormField: (field: string, value: string) => void, submit: () => Promise<void>, isSubmitting: boolean }} props
 */
export default function ProductCategoryEditorPanel({
  title,
  form,
  categories,
  subCategories,
  itemSubCategories,
  fieldErrors = {},
  setFormField,
  submit,
  isSubmitting,
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
    setFormField("categorySlug", path.categorySlug);
    setFormField("subCategorySlug", path.subCategorySlug);
    setFormField("itemSubCategorySlug", path.itemSubCategorySlug || "");
    setCatalogSearch(path.label);
  }

  return (
    <StoreSection title="Update Category">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2 rounded-sm border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Product</p>
          <p className="mt-2 text-base font-bold text-brand-white">{title || "Product"}</p>
        </div>

        <div className="md:col-span-2 rounded-[18px] border border-white/10 bg-black/20 p-4">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-white/80">Smart Category Search</p>
              <p className="mt-1 text-xs leading-5 text-white/45">
                Search with product or category keywords to find the most probable path from category.json and fill the fields in one click.
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

        <div>
          <ProductSearchableSelect
            label="Category"
            value={form.categorySlug}
            options={categoryOptions}
            placeholder="Select category"
            onChange={(value) => setFormField("categorySlug", value)}
          />
          {fieldErrors.categorySlug ? (
            <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.categorySlug}</p>
          ) : null}
        </div>

        <div>
          <ProductSearchableSelect
            label="Subcategory"
            value={form.subCategorySlug}
            options={subCategoryOptions}
            placeholder="Select subcategory"
            onChange={(value) => setFormField("subCategorySlug", value)}
            disabled={!form.categorySlug}
            emptyMessage={form.categorySlug ? "No subcategories found." : "Choose a category first."}
          />
          {fieldErrors.subCategorySlug ? (
            <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.subCategorySlug}</p>
          ) : null}
        </div>

        {itemSubCategories.length ? (
          <div className="md:col-span-2">
            <ProductSearchableSelect
              label="Item Subcategory"
              value={form.itemSubCategorySlug}
              options={itemSubCategoryOptions}
              placeholder="Select item subcategory"
              onChange={(value) => setFormField("itemSubCategorySlug", value)}
              disabled={!form.subCategorySlug}
              emptyMessage={form.subCategorySlug ? "No item subcategories found." : "Choose a subcategory first."}
            />
            {fieldErrors.itemSubCategorySlug ? (
              <p className="mt-2 text-xs font-semibold text-red-300">{fieldErrors.itemSubCategorySlug}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6 max-w-xs">
        <AuthButton type="button" disabled={isSubmitting} onClick={submit}>
          {isSubmitting ? "Updating..." : "Update Category"}
        </AuthButton>
      </div>
    </StoreSection>
  );
}
