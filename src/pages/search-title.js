import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ProductSearchSuggestionsPanel from "@/src/components/product/ProductSearchSuggestionsPanel";
import { useProductSearchTitle } from "@/src/hooks/product/useProductSearchTitle";

export default function SearchTitlePage() {
  const search = useProductSearchTitle();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1260px] px-4 py-8 md:px-6">
        <ProductSearchSuggestionsPanel
          query={search.query}
          setQuery={search.setQuery}
          suggestions={search.suggestions}
          isLoading={search.isLoading}
          message={search.message}
          onSubmitSearch={search.submitSearch}
        />
      </div>
    </DashboardShell>
  );
}
