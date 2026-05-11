import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { logScreenView } from "@/src/api/analytics";
import { fetchStoreInfo, getDashboardSession } from "@/src/api/dashboard";
import { fetchProductGroups } from "@/src/api/store";
import {
  bulkUpdateProducts,
  createProductGroup,
  removeSpecialProducts,
  requestMonthlyInvoice,
  uploadSpecialProducts,
} from "@/src/api/activity";
import {
  firstActivityQuery,
  formatInvoicePeriod,
  getActivityPricingUrl,
  hasVerifiedMobile,
  isPremiumStore,
  normalizeActivityGroups,
  PRODUCT_GROUP_DISCOUNT_TYPES,
  readFileAsBase64,
  resolveActivityPanel,
  resolveBulkUpdateMode,
  resolveSpecialProductType,
} from "@/src/utils/activity";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => String(index + 1));

/**
 * @returns {import("@/src/components/activity/ActivityWorkspace").ActivityWorkspaceProps}
 */
export function useActivityWorkspace() {
  const router = useRouter();
  const panelSlug = firstActivityQuery(router.query.panel) || "bulk-update";
  const bulkModeSlug =
    firstActivityQuery(router.query["bulk-mode"]) || "product-attributes";
  const specialTypeSlug =
    firstActivityQuery(router.query["special-type"]) || "top-products";
  const month =
    firstActivityQuery(router.query.month) ||
    String(new Date().getMonth() + 1);
  const year =
    firstActivityQuery(router.query.year) ||
    String(new Date().getFullYear());

  const activePanel = useMemo(
    () => resolveActivityPanel(panelSlug),
    [panelSlug],
  );
  const activeBulkMode = useMemo(
    () => resolveBulkUpdateMode(bulkModeSlug),
    [bulkModeSlug],
  );
  const activeSpecialType = useMemo(
    () => resolveSpecialProductType(specialTypeSlug),
    [specialTypeSlug],
  );

  const [storeInfo, setStoreInfo] = useState({});
  const [groups, setGroups] = useState([]);
  const [groupsCount, setGroupsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [bulkFileName, setBulkFileName] = useState("");
  const [bulkFileBase64, setBulkFileBase64] = useState("");
  const [specialFileName, setSpecialFileName] = useState("");
  const [specialFileBase64, setSpecialFileBase64] = useState("");
  const [groupImageName, setGroupImageName] = useState("");
  const [groupImageBase64, setGroupImageBase64] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDiscountType, setGroupDiscountType] = useState(
    PRODUCT_GROUP_DISCOUNT_TYPES[0].code,
  );
  const [groupDiscount, setGroupDiscount] = useState("");
  const [showOnHome, setShowOnHome] = useState(true);

  const pricingUrl = useMemo(() => getActivityPricingUrl(storeInfo), [storeInfo]);
  const isPremium = useMemo(() => isPremiumStore(storeInfo), [storeInfo]);
  const isMobileVerified = useMemo(
    () => hasVerifiedMobile(storeInfo),
    [storeInfo],
  );
  const selectedInvoiceLabel = useMemo(
    () => formatInvoicePeriod(month, year),
    [month, year],
  );

  const replaceActivityQuery = useCallback(
    async (patch) => {
      const nextQuery = {
        panel: activePanel.slug,
        "bulk-mode": activeBulkMode.slug,
        "special-type": activeSpecialType.slug,
        month,
        year,
        ...patch,
      };

      Object.keys(nextQuery).forEach((key) => {
        if (
          nextQuery[key] === "" ||
          nextQuery[key] === undefined ||
          nextQuery[key] === null
        ) {
          delete nextQuery[key];
        }
      });

      await router.replace(
        {
          pathname: router.pathname,
          query: nextQuery,
        },
        undefined,
        { shallow: true },
      );
    },
    [
      activeBulkMode.slug,
      activePanel.slug,
      activeSpecialType.slug,
      month,
      router,
      year,
    ],
  );

  const loadWorkspace = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage("");

      const [storeData, groupsData] = await Promise.all([
        fetchStoreInfo().catch(() => ({})),
        fetchProductGroups().catch(() => ({})),
      ]);

      const groupCollection = normalizeActivityGroups(groupsData);
      setStoreInfo(storeData || {});
      setGroups(groupCollection.results.slice(0, 4));
      setGroupsCount(groupCollection.count);
    } catch (error) {
      setStoreInfo({});
      setGroups([]);
      setGroupsCount(0);
      setMessage(
        error instanceof Error
          ? error.message
          : "Activity workspace could not be loaded",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadWorkspace();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadWorkspace]);

  useEffect(() => {
    const session = getDashboardSession();

    logScreenView("activity_screen", session.storeUrl || "Anonymous", "store");
  }, []);

  const onFileSelect = useCallback(async (event, target) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      setActionError("");
      const base64 = await readFileAsBase64(file);

      if (target === "bulk") {
        setBulkFileName(file.name);
        setBulkFileBase64(base64);
      }

      if (target === "special") {
        setSpecialFileName(file.name);
        setSpecialFileBase64(base64);
      }

      if (target === "group") {
        setGroupImageName(file.name);
        setGroupImageBase64(base64);
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "File could not be processed",
      );
    }
  }, []);

  const setGroupImageAsset = useCallback(({ fileName, base64 }) => {
    setActionError("");
    setGroupImageName(fileName);
    setGroupImageBase64(base64);
  }, []);

  async function selectPanel(nextPanel) {
    await replaceActivityQuery({ panel: nextPanel });
  }

  async function setBulkMode(nextMode) {
    await replaceActivityQuery({ "bulk-mode": nextMode });
  }

  async function setSpecialType(nextType) {
    await replaceActivityQuery({ "special-type": nextType });
  }

  async function setInvoiceMonth(nextMonth) {
    if (!MONTH_OPTIONS.includes(String(nextMonth))) {
      return;
    }

    await replaceActivityQuery({ month: String(nextMonth) });
  }

  async function setInvoiceYear(nextYear) {
    await replaceActivityQuery({ year: String(nextYear) });
  }

  async function submitBulkUpdate() {
    if (!bulkFileBase64) {
      setActionError("Please add a bulk sheet before upload.");
      return;
    }

    try {
      setIsActionLoading(true);
      setActionError("");
      setActionMessage("");
      await bulkUpdateProducts({
        variants: activeBulkMode.variants,
        fileBase64: bulkFileBase64,
        fileName: bulkFileName || "bulk-update.xlsm",
      });
      setActionMessage(
        "Sheet uploaded successfully. We will notify you once products are updated.",
      );
      setBulkFileName("");
      setBulkFileBase64("");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Bulk update failed",
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function submitMonthlyInvoice() {
    try {
      setIsActionLoading(true);
      setActionError("");
      setActionMessage("");
      await requestMonthlyInvoice({
        month: String(month),
        year: String(year),
      });
      setActionMessage("Invoice send to your registered email.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Invoice request failed",
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function submitSpecialUpload() {
    if (!isPremium) {
      setActionError("Only premium stores can upload special product sheets.");
      return;
    }

    if (!specialFileBase64) {
      setActionError("Please add a special products sheet before upload.");
      return;
    }

    try {
      setIsActionLoading(true);
      setActionError("");
      setActionMessage("");
      await uploadSpecialProducts({
        type: activeSpecialType.code,
        fileBase64: specialFileBase64,
        fileName: specialFileName || "special-products.xlsm",
      });
      setActionMessage(
        "Sheet uploaded successfully. We will notify you once products are added.",
      );
      setSpecialFileName("");
      setSpecialFileBase64("");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Special products upload failed",
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function submitSpecialRemove() {
    try {
      setIsActionLoading(true);
      setActionError("");
      setActionMessage("");
      await removeSpecialProducts({
        type: activeSpecialType.code,
      });
      setActionMessage("Request Submitted.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Special products remove failed",
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  async function submitProductGroupCreate() {
    if (!isPremium) {
      setActionError("Please upgrade your plan to create more product groups.");
      return;
    }

    if (!isMobileVerified) {
      setActionError("Verify mobile before creating a product group.");
      return;
    }

    if (!groupName.trim()) {
      setActionError("Please enter a group name.");
      return;
    }

    if (!groupImageBase64) {
      setActionError("Please select a group banner image.");
      return;
    }

    try {
      setIsActionLoading(true);
      setActionError("");
      setActionMessage("");
      await createProductGroup({
        name: groupName.trim(),
        discountType: groupDiscountType,
        discount: Number(groupDiscount || 0),
        showOnHome,
        imageBase64: groupImageBase64,
        fileName: groupImageName || "group-cover.jpg",
      });
      setActionMessage("Product Group Created");
      setGroupName("");
      setGroupDiscountType(PRODUCT_GROUP_DISCOUNT_TYPES[0].code);
      setGroupDiscount("");
      setShowOnHome(true);
      setGroupImageName("");
      setGroupImageBase64("");
      await loadWorkspace();
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Product group create failed",
      );
    } finally {
      setIsActionLoading(false);
    }
  }

  return {
    activePanel,
    activeBulkMode,
    activeSpecialType,
    bulkFileName,
    groupDiscount,
    groupDiscountType,
    groupImageName,
    groupName,
    groups,
    groupsCount,
    isActionLoading,
    isLoading,
    isMobileVerified,
    isPremium,
    message,
    month,
    pricingUrl,
    selectedInvoiceLabel,
    showOnHome,
    specialFileName,
    storeInfo,
    year,
    actionMessage,
    actionError,
    onFileSelect,
    selectPanel,
    setBulkMode,
    setGroupDiscount,
    setGroupDiscountType,
    setGroupName,
    setInvoiceMonth,
    setInvoiceYear,
    setShowOnHome,
    setGroupImageAsset,
    setSpecialType,
    submitBulkUpdate,
    submitMonthlyInvoice,
    submitProductGroupCreate,
    submitSpecialRemove,
    submitSpecialUpload,
  };
}
