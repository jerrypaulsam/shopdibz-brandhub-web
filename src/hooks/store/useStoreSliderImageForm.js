import { useEffect, useMemo, useState } from "react";
import { addStoreBanners, fetchBannerImages, fetchEditableStoreInfo, fetchProductGroups } from "@/src/api/store";
import { logScreenView } from "@/src/api/analytics";

const initialSlot = () => ({
  preview: "",
  imageBase64: "",
  productGroupName: "",
  productGroupSlug: "",
  link: "",
});

export function useStoreSliderImageForm() {
  const [storeInfo, setStoreInfo] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const [mobileSliderSelection, setMobileSliderSelection] = useState(false);
  const [slots, setSlots] = useState([initialSlot(), initialSlot()]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      setIsLoading(true);
      setMessage("");

      try {
        const [info, images, groups] = await Promise.all([
          fetchEditableStoreInfo(),
          fetchBannerImages().catch(() => ({ results: [] })),
          fetchProductGroups().catch(() => []),
        ]);

        if (!isCurrent) {
          return;
        }

        setStoreInfo(info);
        setBannerImages(images?.results || []);
        setProductGroups(Array.isArray(groups) ? groups : groups?.results || []);

        logScreenView("store_slider_image_form", info?.url || "Anonymous", "store");
      } catch (error) {
        if (isCurrent) {
          setMessage(error instanceof Error ? error.message : "Slider form could not be loaded");
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

  const filteredBannerImages = useMemo(
    () =>
      bannerImages.filter(
        (item) =>
          Boolean(item?.for_mobile ?? item?.forMobile) === mobileSliderSelection,
      ),
    [bannerImages, mobileSliderSelection],
  );

  const preferredSize = mobileSliderSelection
    ? "1080 x 1350 px (4:5)"
    : "1920 x 720 px (16:6)";

  const currentAspectRatio = mobileSliderSelection ? "4:5" : "16:6";
  const canUseExternalLinks = storeInfo?.plan === "P";

  function updateSlot(index, patch) {
    setSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...patch } : slot,
      ),
    );
  }

  async function submitForm() {
    if (slots.some((slot) => !slot.imageBase64)) {
      setMessage("Exactly 2 images are required to update sliders.");
      return false;
    }

    if (slots.some((slot) => slot.link && !isValidUrl(slot.link))) {
      setMessage("Please enter valid external URLs.");
      return false;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await addStoreBanners({
        forMobile: mobileSliderSelection,
        images: slots.map((slot) => slot.imageBase64),
        productGroupSlugs: slots.map((slot) => slot.productGroupSlug || ""),
        links: slots.map((slot) => (canUseExternalLinks ? slot.link : "")),
      });
      setMessage("Banner Updated.");

      const nextBanners = await fetchBannerImages().catch(() => ({ results: [] }));
      setBannerImages(nextBanners?.results || []);
      setSlots([initialSlot(), initialSlot()]);
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Slider publish failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    storeInfo,
    productGroups,
    bannerImages: filteredBannerImages,
    mobileSliderSelection,
    setMobileSliderSelection,
    slots,
    updateSlot,
    preferredSize,
    currentAspectRatio,
    canUseExternalLinks,
    message,
    isLoading,
    isSubmitting,
    submitForm,
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
