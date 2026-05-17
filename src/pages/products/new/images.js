import ProductFlowLayout from "@/src/components/product/ProductFlowLayout";
import ProductImagePanel from "@/src/components/product/ProductImagePanel";
import { useProductImageForm } from "@/src/hooks/product/useProductImageForm";

export default function ProductImagePage() {
  const product = useProductImageForm();

  return (
    <ProductFlowLayout
      title="Select Images"
      subtitle="Upload clear product images to help customers understand the listing."
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
