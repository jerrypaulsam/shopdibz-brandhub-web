import { useEffect, useMemo, useState } from "react";
import { fetchBannerImages, fetchEditableStoreInfo, fetchProductGroups, updateStoreBanner } from "@/src/api/store";
import { logScreenView } from "@/src/api/analytics";

export function useStoreSliderManagement() {
  const [storeInfo, setStoreInfo] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const [mobileSliderSelection, setMobileSliderSelection] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [productGroupName, setProductGroupName] = useState("");
  const [productGroupSlug, setProductGroupSlug] = useState("");
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const [info, banners, groups] = await Promise.all([
          fetchEditableStoreInfo(),
          fetchBannerImages().catch(() => ({ results: [] })),
          fetchProductGroups().catch(() => []),
        ]);

        if (!isCurrent) {
          return;
        }

        setStoreInfo(info);
        setBannerImages(banners?.results || []);
        setProductGroups(Array.isArray(groups) ? groups : groups?.results || []);
        logScreenView("store_slider_management", info?.url || "Anonymous", "store");
      } catch (error) {
        if (isCurrent) {
          setMessage(error instanceof Error ? error.message : "Slider management could not be loaded");
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

  const filteredBanners = useMemo(
    () =>
      bannerImages.filter(
        (item) =>
          Boolean(item?.for_mobile ?? item?.forMobile) === mobileSliderSelection,
      ),
    [bannerImages, mobileSliderSelection],
  );

  const currentAspectRatio = mobileSliderSelection ? "4:5" : "16:6";
  const preferredSize = mobileSliderSelection
    ? "1080 x 1350 px (4:5)"
    : "1920 x 720 px (16:6)";
  const canUseExternalLinks = storeInfo?.plan === "P";

  function selectBanner(banner) {
    setSelectedBanner(banner);
    setProductGroupName("");
    setProductGroupSlug("");
    setLink("");
    setPreview("");
    setImageBase64("");
    setMessage("");
  }

  async function submitUpdate() {
    if (!selectedBanner) {
      setMessage("Select a slider first.");
      return false;
    }

    if (!imageBase64) {
      setMessage("Select a replacement image first.");
      return false;
    }

    if (link && !isValidUrl(link)) {
      setMessage("Please enter a valid URL.");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await updateStoreBanner({
        bannerId: selectedBanner.id,
        imageBase64,
        productGroupSlug,
        link: canUseExternalLinks ? link : "",
      });
      setMessage("Update Successful.");

      const nextBanners = await fetchBannerImages().catch(() => ({ results: [] }));
      setBannerImages(nextBanners?.results || []);
      setSelectedBanner(null);
      setProductGroupName("");
      setProductGroupSlug("");
      setLink("");
      setPreview("");
      setImageBase64("");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Slider update failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    storeInfo,
    productGroups,
    filteredBanners,
    mobileSliderSelection,
    setMobileSliderSelection,
    selectedBanner,
    selectBanner,
    productGroupName,
    setProductGroupName,
    productGroupSlug,
    setProductGroupSlug,
    link,
    setLink,
    preview,
    setPreview,
    setImageBase64,
    currentAspectRatio,
    preferredSize,
    canUseExternalLinks,
    message,
    isLoading,
    isSubmitting,
    submitUpdate,
  };
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
