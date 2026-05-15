import { useRouter } from "next/router";
import ProductCategoryEditorPanel from "@/src/components/product/ProductCategoryEditorPanel";
import ProductEditorPanel from "@/src/components/product/ProductEditorPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductCategoryUpdateForm } from "@/src/hooks/product/useProductCategoryUpdateForm";
import { useProductUpdateForm } from "@/src/hooks/product/useProductUpdateForm";

export default function ProductUpdatePage() {
  const router = useRouter();
  const section = Array.isArray(router.query.section) ? router.query.section[0] : String(router.query.section || "");
  const isCategorySection = section === "category";
  const product = useProductUpdateForm({ enabled: !isCategorySection });
  const categoryForm = useProductCategoryUpdateForm({ enabled: isCategorySection });
  const activeForm = isCategorySection ? categoryForm : product;

  return (
    <ProductWorkspaceLayout
      title={isCategorySection ? "Update Product Category" : "Update Product Details"}
      subtitle={
        isCategorySection
          ? "Update the category path separately from the main product details."
          : "Edit the product metadata, shipping profile, and catalog fields while keeping the product slug stable in the route."
      }
      message={activeForm.error}
      success={activeForm.success}
    >
      {activeForm.isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
          Loading product editor...
        </div>
      ) : isCategorySection ? (
        <ProductCategoryEditorPanel
          title={categoryForm.title}
          form={categoryForm.form}
          categories={categoryForm.categories}
          subCategories={categoryForm.subCategories}
          itemSubCategories={categoryForm.itemSubCategories}
          fieldErrors={categoryForm.fieldErrors}
          setFormField={categoryForm.setFormField}
          submit={categoryForm.submit}
          isSubmitting={categoryForm.isSubmitting}
        />
      ) : (
        <ProductEditorPanel
          form={product.form}
          categoryTrail={product.categoryTrail}
          isBookCategory={product.isBookCategory}
          fieldErrors={product.fieldErrors}
          setFormField={product.setFormField}
          addAttribute={product.addAttribute}
          updateAttribute={product.updateAttribute}
          removeAttribute={product.removeAttribute}
          addKeyword={product.addKeyword}
          removeKeyword={product.removeKeyword}
          toggleShipZone={product.toggleShipZone}
          toggleShipExZone={product.toggleShipExZone}
          submit={product.submit}
          isSubmitting={product.isSubmitting}
        />
      )}
    </ProductWorkspaceLayout>
  );
}
