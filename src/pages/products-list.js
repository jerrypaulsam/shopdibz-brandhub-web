import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ProductListPanel from "@/src/components/product/ProductListPanel";
import { useProductList } from "@/src/hooks/product/useProductList";

export default function ProductsListPage() {
  const productList = useProductList();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1360px] px-4 py-8 md:px-6">
        <ProductListPanel
          filters={productList.filters}
          categories={productList.categories}
          subCategories={productList.subCategories}
          itemSubCategories={productList.itemSubCategories}
          searchInput={productList.searchInput}
          setSearchInput={productList.setSearchInput}
          products={productList.products}
          count={productList.count}
          isLoading={productList.isLoading}
          isRefreshing={productList.isRefreshing}
          hasNextPage={productList.hasNextPage}
          hasPreviousPage={productList.hasPreviousPage}
          message={productList.message}
          loadingSlug={productList.loadingSlug}
          onSubmitSearch={productList.submitSearch}
          onUpdateFilters={productList.updateFilters}
          onGoToPage={productList.goToPage}
          onArchiveProduct={productList.archiveProduct}
          onRestoreProduct={productList.restoreProduct}
          onHideProduct={productList.hideProduct}
          onDeleteVariation={productList.deleteVariation}
        />
      </div>
    </DashboardShell>
  );
}
