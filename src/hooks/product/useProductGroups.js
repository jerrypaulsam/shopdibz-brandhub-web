import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  deleteProductGroup,
  fetchProductGroups,
  updateProductGroup,
} from "@/src/api/products";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import { useToast } from "@/src/components/app/ToastProvider";
import { normalizeProductGroupList } from "@/src/utils/product";

export function useProductGroups() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const { showToast } = useToast();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingGroupId, setLoadingGroupId] = useState(0);
  const [message, setMessage] = useState("");

  const loadGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchProductGroups({ page: 1 });
      setGroups(normalizeProductGroupList(data));
    } catch (error) {
      setGroups([]);
      setMessage(error instanceof Error ? error.message : "Product groups could not be loaded");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadGroups();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadGroups]);

  async function openGroup(groupId) {
    await router.push(`/product-groups/${groupId}`);
  }

  async function saveGroup(group) {
    try {
      setIsSaving(true);
      setLoadingGroupId(Number(group.groupId || 0));
      setMessage("");
      await updateProductGroup(group);
      setGroups((currentGroups) =>
        currentGroups.map((currentGroup) =>
          Number(currentGroup?.id || 0) === Number(group.groupId || 0)
            ? {
                ...currentGroup,
                name: group.name,
                active: group.active,
                show: group.show,
              }
            : currentGroup,
        ),
      );
      await loadGroups();
      setMessage("Product group updated.");
      showToast({ message: "Product Group Updated", type: "success" });
      return true;
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Product group could not be updated";
      setMessage(nextMessage);
      showToast({ message: nextMessage, type: "error" });
      return false;
    } finally {
      setLoadingGroupId(0);
      setIsSaving(false);
    }
  }

  async function removeGroup(groupId) {
    const accepted = await confirm({
      title: "Delete Product Group",
      message: "This product group will be removed permanently from your store workspace.",
      confirmLabel: "Delete Group",
    });

    if (!accepted) {
      return false;
    }

    try {
      setIsSaving(true);
      setLoadingGroupId(Number(groupId || 0));
      setMessage("");
      await deleteProductGroup({ groupId: Number(groupId || 0) });
      setGroups((currentGroups) =>
        currentGroups.filter(
          (currentGroup) => Number(currentGroup?.id || 0) !== Number(groupId || 0),
        ),
      );
      setMessage("Product group deleted.");
      showToast({ message: "Product Group Deleted", type: "success" });
      return true;
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Product group could not be deleted";
      setMessage(nextMessage);
      showToast({ message: nextMessage, type: "error" });
      return false;
    } finally {
      setLoadingGroupId(0);
      setIsSaving(false);
    }
  }

  return {
    groups,
    isLoading,
    isSaving,
    loadingGroupId,
    message,
    openGroup,
    removeGroup,
    saveGroup,
  };
}
