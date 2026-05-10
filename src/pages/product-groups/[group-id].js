import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ProductGroupProductsPanel from "@/src/components/product/ProductGroupProductsPanel";
import { useProductGroupProducts } from "@/src/hooks/product/useProductGroupProducts";

export default function ProductGroupProductsPage() {
  const productGroup = useProductGroupProducts();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1360px] px-4 py-8 md:px-6">
        <ProductGroupProductsPanel
          groupId={productGroup.groupId}
          products={productGroup.products}
          count={productGroup.count}
          isLoading={productGroup.isLoading}
          message={productGroup.message}
          page={productGroup.page}
          hasNextPage={productGroup.hasNextPage}
          hasPreviousPage={productGroup.hasPreviousPage}
          onGoToPage={productGroup.goToPage}
        />
      </div>
    </DashboardShell>
  );
}
