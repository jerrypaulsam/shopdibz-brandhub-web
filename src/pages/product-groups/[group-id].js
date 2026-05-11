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
          isLoadingMore={productGroup.isLoadingMore}
          message={productGroup.message}
          hasNextPage={productGroup.hasNextPage}
          onLoadMore={productGroup.loadMore}
        />
      </div>
    </DashboardShell>
  );
}
