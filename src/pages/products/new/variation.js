import ProductFlowLayout from "@/src/components/product/ProductFlowLayout";
import ProductVariationPanel from "@/src/components/product/ProductVariationPanel";
// import SellerPayoutEstimateCard from "@/src/components/product/SellerPayoutEstimateCard";
import { useProductVariationForm } from "@/src/hooks/product/useProductVariationForm";

export default function ProductVariationPage() {
  const product = useProductVariationForm();

  return (
    <ProductFlowLayout
      title="Enter Variation Info"
      subtitle="Add each variation with the right pricing, stock, SKU, and option details."
      currentStep="variation"
      query={product.buildQuery()}
      message={product.error}
      // listingTipsContent={<SellerPayoutEstimateCard price={product.form.price} />}
    >
      <ProductVariationPanel
        draft={product.draft}
        form={product.form}
        mappingOptions={product.mappingOptions}
        error={product.error}
        fieldErrors={product.fieldErrors}
        setFormField={product.setFormField}
        addCurrentVariation={product.addCurrentVariation}
        finishVariations={product.finishVariations}
        removeVariation={product.removeVariation}
      />
    </ProductFlowLayout>
  );
}
