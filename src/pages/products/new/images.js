import ProductFlowLayout from "@/src/components/product/ProductFlowLayout";
import ProductImagePanel from "@/src/components/product/ProductImagePanel";
import { useProductImageForm } from "@/src/hooks/product/useProductImageForm";

export default function ProductImagePage() {
  const product = useProductImageForm();

  return (
    <ProductFlowLayout
      title="Select Images"
      subtitle="Upload the product media and send the final single-product create request from this step."
      currentStep="images"
      query={product.buildQuery()}
      message={product.error}
      success={product.success}
    >
      <ProductImagePanel
        images={product.images}
        onFilesSelected={product.onFilesSelected}
        removeImage={product.removeImage}
        submitProduct={product.submitProduct}
        isSubmitting={product.isSubmitting}
      />
    </ProductFlowLayout>
  );
}
