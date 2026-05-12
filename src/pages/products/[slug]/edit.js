import ProductEditorPanel from "@/src/components/product/ProductEditorPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductUpdateForm } from "@/src/hooks/product/useProductUpdateForm";

export default function ProductUpdatePage() {
  const product = useProductUpdateForm();

  return (
    <ProductWorkspaceLayout
      title="Update Product Details"
      subtitle="Edit the product metadata, shipping profile, and catalog fields while keeping the product slug stable in the route."
      message={product.error}
      success={product.success}
    >
      {product.isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
          Loading product editor...
        </div>
      ) : (
        <ProductEditorPanel
          form={product.form}
          categories={product.categories}
          subCategories={product.subCategories}
          itemSubCategories={product.itemSubCategories}
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
