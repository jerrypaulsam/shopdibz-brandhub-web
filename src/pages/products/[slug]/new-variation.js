import ProductVariationEditorPanel from "@/src/components/product/ProductVariationEditorPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useAddNewVariationForm } from "@/src/hooks/product/useAddNewVariationForm";

export default function AddNewVariationPage() {
  const product = useAddNewVariationForm();

  return (
    <ProductWorkspaceLayout
      title="Add New Variation"
      subtitle="Create a new variation under the current product slug with a direct-linkable route."
      message={product.error}
      success={product.success}
    >
      {product.isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
          Loading variation form...
        </div>
      ) : (
        <ProductVariationEditorPanel
          form={product.form}
          mappingOptions={product.mappingOptions}
          variationTypes={product.variationTypes}
          isNew
          setFormField={product.setFormField}
          submit={product.submit}
          isSubmitting={product.isSubmitting}
        />
      )}
    </ProductWorkspaceLayout>
  );
}
