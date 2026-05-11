import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchBannerImages, fetchEditableStoreInfo } from "@/src/api/store";
import {
  cancelSellerSubscription,
  deactivateSellerAccount,
  deleteStoreHeaderImage,
  getProfileSession,
  updateStoreHeaderImage,
} from "@/src/api/profile";
import { clearAuthSession } from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";
import { useToast } from "@/src/components/app/ToastProvider";

const sectionItems = [
  ["store-settings", "Store Settings"],
  ["store-sliders", "Store Sliders"],
  ["header-image", "Header Image"],
  ["account-settings", "Account Settings"],
  ["subscription", "Subscription"],
  ["support", "Support"],
];

export function useAccountHub(section) {
  const router = useRouter();
  const { showToast } = useToast();
  const [storeInfo, setStoreInfo] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [headerPreview, setHeaderPreview] = useState("");
  const [headerBase64, setHeaderBase64] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const [info, banners] = await Promise.all([
          fetchEditableStoreInfo(),
          fetchBannerImages().catch(() => ({ results: [] })),
        ]);

        if (!isCurrent) {
          return;
        }

        setStoreInfo(info);
        setBannerImages(banners?.results || []);
        logScreenView("account_screen", info?.url || "Anonymous", "store");
      } catch (error) {
        if (isCurrent) {
          setMessage(error instanceof Error ? error.message : "Account area could not be loaded");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCurrent = false;
    };
  }, []);

  const sectionNav = useMemo(
    () =>
      sectionItems.map(([value, label]) => ({
        value,
        label,
        href: `/profile/${value}`,
        active: value === section,
      })),
    [section],
  );

  const session = getProfileSession();
  const isOwner =
    storeInfo?.user?.owner ??
    session?.user?.owner ??
    false;

  async function submitHeaderImage() {
    if (!headerBase64) {
      setMessage("Select a header image first.");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateStoreHeaderImage(headerBase64);
      const nextInfo = await fetchEditableStoreInfo();
      setStoreInfo(nextInfo);
      setHeaderPreview(nextInfo?.headerImg ? "" : headerPreview);
      setHeaderBase64("");
      setMessage("Header image updated successfully");
      showToast({
        message: "Header image updated successfully",
        type: "success",
      });
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Header image update failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeHeaderImage() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await deleteStoreHeaderImage();
      const nextInfo = await fetchEditableStoreInfo();
      setStoreInfo(nextInfo);
      setHeaderPreview("");
      setHeaderBase64("");
      setMessage("Header image removed");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Header image deletion failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function cancelSubscription() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await cancelSellerSubscription();
      setMessage("Active subscription cancelled");
      const nextInfo = await fetchEditableStoreInfo();
      setStoreInfo(nextInfo);
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Subscription cancellation failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deactivateAccount() {
    setIsSubmitting(true);
    setMessage("");

    try {
      await deactivateSellerAccount();
      clearAuthSession();
      await router.replace("/hub");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Account deactivation failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    storeInfo,
    bannerImages,
    sectionNav,
    isOwner,
    headerPreview,
    setHeaderPreview,
    headerBase64,
    setHeaderBase64,
    message,
    isLoading,
    isSubmitting,
    submitHeaderImage,
    removeHeaderImage,
    cancelSubscription,
    deactivateAccount,
  };
}
