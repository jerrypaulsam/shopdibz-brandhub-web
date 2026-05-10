import ProductImageWorkspacePanel from "@/src/components/product/ProductImageWorkspacePanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductImageWorkspace } from "@/src/hooks/product/useProductImageWorkspace";

export default function ProductVariationImagesPage() {
  const product = useProductImageWorkspace("variation");

  return (
    <ProductWorkspaceLayout
      title="Add Variation Images"
      subtitle="Upload images for the current variation using the slug and variation-id route."
      message={product.error}
      success={product.success}
    >
      {product.isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
          Loading variation image workspace...
        </div>
      ) : (
        <ProductImageWorkspacePanel
          title="Variation Image Library"
          currentImages={product.activeVariation?.imgs || []}
          selectedImages={product.images}
          maxImages={product.maxImages}
          onFilesSelected={product.onFilesSelected}
          removeImage={product.removeImage}
          removeCurrentImage={product.removeCurrentImage}
          replaceCurrentImage={product.replaceCurrentImage}
          makeCoverImage={product.makeCoverImage}
          submit={product.submit}
          isSubmitting={product.isSubmitting}
        />
      )}
    </ProductWorkspaceLayout>
  );
}
