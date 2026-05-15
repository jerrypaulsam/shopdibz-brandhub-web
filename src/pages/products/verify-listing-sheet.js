import ProductBulkVerificationPanel from "@/src/components/product/ProductBulkVerificationPanel";
import ProductWorkspaceLayout from "@/src/components/product/ProductWorkspaceLayout";
import { useProductBulkVerificationForm } from "@/src/hooks/product/useProductBulkVerificationForm";

export default function ProductVerifyListingSheetPage() {
  const product = useProductBulkVerificationForm();

  return (
    <ProductWorkspaceLayout
      title="Verify Listing Sheet"
      subtitle="Check your bulk listing file before submission and catch format issues early."
      message={product.error}
      success={product.success}
      aside={
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-gold">
            Before You Upload
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-white/55">
            <p>Use the standard listing template so headers and required columns match the verification contract.</p>
            <p>Verification checks the uploaded sheet and sends the report to your registered seller email.</p>
            <p>After the report looks clean, continue to the full bulk listing flow when you are ready to submit products.</p>
          </div>
        </div>
      }
    >
      <ProductBulkVerificationPanel
        fileName={product.fileName}
        isSubmitting={product.isSubmitting}
        templateLinks={product.templateLinks}
        onFileSelected={product.onFileSelected}
        submitBulkVerify={product.submitBulkVerify}
      />
    </ProductWorkspaceLayout>
  );
}
