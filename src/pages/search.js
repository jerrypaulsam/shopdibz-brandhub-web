import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ProductSearchResultsPanel from "@/src/components/product/ProductSearchResultsPanel";
import { useProductSearch } from "@/src/hooks/product/useProductSearch";

export default function SearchPage() {
  const search = useProductSearch();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1360px] px-4 py-8 md:px-6">
        <ProductSearchResultsPanel
          query={search.query}
          label={search.label}
          sort={search.sort}
          page={search.page}
          products={search.products}
          isLoading={search.isLoading}
          message={search.message}
          hasNextPage={search.hasNextPage}
          hasPreviousPage={search.hasPreviousPage}
          onUpdateRoute={search.updateRoute}
        />
      </div>
    </DashboardShell>
  );
}
