import ProductVariationEditorPanel from "@/src/components/product/ProductVariationEditorPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductVariationUpdateForm } from "@/src/hooks/product/useProductVariationUpdateForm";

export default function ProductVariationUpdatePage() {
  const product = useProductVariationUpdateForm();

  return (
    <ProductWorkspaceLayout
      title="Update Variation Info"
      subtitle="Edit pricing, stock, SKU, and option details for this variation."
      message={product.error}
      success={product.success}
    >
      {product.isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
          Loading variation editor...
        </div>
      ) : (
        <ProductVariationEditorPanel
          form={product.form}
          mappingOptions={product.mappingOptions}
          variationFields={product.variationFields}
          fieldErrors={product.fieldErrors}
          setFormField={product.setFormField}
          setVariationField={product.setVariationField}
          submit={product.submit}
          isSubmitting={product.isSubmitting}
        />
      )}
    </ProductWorkspaceLayout>
  );
}
