import AuthButton from "@/src/components/auth/AuthButton";
import StoreSection from "@/src/components/store/StoreSection";

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
  return (
    <StoreSection title="Update Category">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2 rounded-sm border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Product</p>
          <p className="mt-2 text-base font-bold text-brand-white">{title || "Product"}</p>
        </div>

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
          <label className="block md:col-span-2">
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
      </div>

      <div className="mt-6 max-w-xs">
        <AuthButton type="button" disabled={isSubmitting} onClick={submit}>
          {isSubmitting ? "Updating..." : "Update Category"}
        </AuthButton>
      </div>
    </StoreSection>
  );
}
