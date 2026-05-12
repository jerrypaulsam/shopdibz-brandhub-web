import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ProductGroupsPanel from "@/src/components/product/ProductGroupsPanel";
import { useProductGroups } from "@/src/hooks/product/useProductGroups";

export default function ProductGroupsPage() {
  const productGroups = useProductGroups();

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1360px] px-4 py-8 md:px-6">
        <ProductGroupsPanel
          groups={productGroups.groups}
          isLoading={productGroups.isLoading}
          isSaving={productGroups.isSaving}
          loadingGroupId={productGroups.loadingGroupId}
          message={productGroups.message}
          onOpenGroup={productGroups.openGroup}
          onDeleteGroup={productGroups.removeGroup}
          onSaveGroup={productGroups.saveGroup}
        />
      </div>
    </DashboardShell>
  );
}
