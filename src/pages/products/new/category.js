import ProductCategoryPanel from "@/src/components/product/ProductCategoryPanel";
import ProductFlowLayout from "@/src/components/product/ProductFlowLayout";
import { useProductCategoryForm } from "@/src/hooks/product/useProductCategoryForm";

export default function ProductCategoryPage() {
  const product = useProductCategoryForm();

  return (
    <ProductFlowLayout
      title="Choose Product Category"
      subtitle="Choose the best category first so the rest of your product details stay accurate."
      currentStep="category"
      query={product.buildQuery()}
      message={product.error}
    >
      <ProductCategoryPanel
        categories={product.categories}
        subCategories={product.subCategories}
        itemSubCategories={product.itemSubCategories}
        draft={product.draft}
        chooseCategory={product.chooseCategory}
        chooseSubCategory={product.chooseSubCategory}
        chooseItemSubCategory={product.chooseItemSubCategory}
        chooseVariantMode={product.chooseVariantMode}
        chooseListingMode={product.chooseListingMode}
        continueToNext={product.continueToNext}
      />
    </ProductFlowLayout>
  );
}
