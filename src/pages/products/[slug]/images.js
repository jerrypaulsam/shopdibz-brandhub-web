import ProductImageWorkspacePanel from "@/src/components/product/ProductImageWorkspacePanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductImageWorkspace } from "@/src/hooks/product/useProductImageWorkspace";

export default function ProductFurtherImagesPage() {
  const product = useProductImageWorkspace("product");

  return (
    <ProductWorkspaceLayout
      title="Add Further Images"
      subtitle="Upload more product images for the current slug without leaving the product workspace."
      message={product.error}
      success={product.success}
    >
      {product.isLoading ? (
        <div className="rounded-sm border border-white/10 bg-[#121212] p-8 text-sm text-white/55">
          Loading image workspace...
        </div>
      ) : (
        <ProductImageWorkspacePanel
          title="Product Image Library"
          currentImages={product.product?.prdtImg || []}
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
