import ProductFlowLayout from "@/src/components/product/ProductFlowLayout";
import ProductVariationPanel from "@/src/components/product/ProductVariationPanel";
import { useProductVariationForm } from "@/src/hooks/product/useProductVariationForm";

export default function ProductVariationPage() {
  const product = useProductVariationForm();

  return (
    <ProductFlowLayout
      title="Enter Variation Info"
      subtitle="Build out each variant record one by one before the final product create request is sent."
      currentStep="variation"
      query={product.buildQuery()}
      message={product.error}
    >
      <ProductVariationPanel
        draft={product.draft}
        form={product.form}
        mappingOptions={product.mappingOptions}
        error={product.error}
        setFormField={product.setFormField}
        addCurrentVariation={product.addCurrentVariation}
        removeVariation={product.removeVariation}
      />
    </ProductFlowLayout>
  );
}
