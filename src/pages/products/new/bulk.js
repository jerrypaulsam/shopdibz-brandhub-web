import ProductBulkUploadPanel from "@/src/components/product/ProductBulkUploadPanel";
import ProductFlowLayout from "@/src/components/product/ProductFlowLayout";
import { useProductBulkUploadForm } from "@/src/hooks/product/useProductBulkUploadForm";

export default function ProductBulkPage() {
  const product = useProductBulkUploadForm();

  return (
    <ProductFlowLayout
      title="Bulk Listing"
      subtitle="Upload, verify, and submit your product sheet in a dedicated workspace instead of an in-page modal."
      currentStep="bulk"
      query={product.buildQuery()}
      message={product.error}
      success={product.success}
    >
      <ProductBulkUploadPanel
        draft={product.draft}
        selectionSummary={product.getSelectionSummary()}
        fileName={product.fileName}
        onFileSelected={product.onFileSelected}
        onChooseVariantMode={product.chooseVariantMode}
        submitBulkCreate={product.submitBulkCreate}
        submitBulkVerify={product.submitBulkVerify}
        isSubmitting={product.isSubmitting}
        templateLinks={product.templateLinks}
      />
    </ProductFlowLayout>
  );
}
