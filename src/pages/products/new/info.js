import ProductFlowLayout from "@/src/components/product/ProductFlowLayout";
import ProductInfoPanel from "@/src/components/product/ProductInfoPanel";
import { useProductInfoForm } from "@/src/hooks/product/useProductInfoForm";

export default function ProductInfoPage() {
  const product = useProductInfoForm();

  return (
    <ProductFlowLayout
      title="Enter Product Details"
      subtitle="Add the main product details your customers need before you publish the listing."
      currentStep="info"
      query={product.buildQuery()}
      message={product.error}
      success={product.success}
    >
      <ProductInfoPanel
        draft={product.draft}
        selectionSummary={product.getSelectionSummary()}
        isBookCategory={product.isBookCategory}
        gstOptions={product.gstOptions}
        shipZonesPreset={product.shipZonesPreset}
        shipExZonesPreset={product.shipExZonesPreset}
        variationTypes={product.variationTypes}
        fieldErrors={product.fieldErrors}
        updateDraft={product.updateDraft}
        addKeyword={product.addKeyword}
        removeKeyword={product.removeKeyword}
        addAttribute={product.addAttribute}
        updateAttribute={product.updateAttribute}
        removeAttribute={product.removeAttribute}
        removeVariation={product.removeVariation}
        toggleShipZone={product.toggleShipZone}
        toggleShipExZone={product.toggleShipExZone}
        chooseVariantType={product.chooseVariantType}
        submitInfoForm={product.submitInfoForm}
        isSubmitting={product.isSubmitting}
        buildQuery={product.buildQuery}
      />
    </ProductFlowLayout>
  );
}
