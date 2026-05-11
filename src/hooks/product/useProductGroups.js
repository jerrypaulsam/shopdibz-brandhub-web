import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchProductGroups } from "@/src/api/products";
import { normalizeProductGroupList } from "@/src/utils/product";

export function useProductGroups() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return {
    groups,
    isLoading,
    message,
    openGroup,
  };
}
