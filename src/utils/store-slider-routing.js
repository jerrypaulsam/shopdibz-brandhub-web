export function getStoreSliderMeta(storeInfo, bannerImages = []) {
  const desktopCount = bannerImages.filter(
    (item) => !(item?.for_mobile ?? item?.forMobile),
  ).length;
  const mobileCount = bannerImages.filter(
    (item) => Boolean(item?.for_mobile ?? item?.forMobile),
  ).length;
  const hasAnySlider = desktopCount > 0 || mobileCount > 0;
  const isPremium = Boolean(storeInfo?.prem);

  return {
    desktopCount,
    mobileCount,
    hasAnySlider,
    isPremium,
    navLabel: isPremium
      ? hasAnySlider
        ? "Manage Sliders"
        : "New Sliders"
      : "Store Sliders",
    sidebarHref: isPremium
      ? hasAnySlider
        ? "/store-slider-management"
        : "/store-slider-image-form"
      : "/profile/store-sliders",
    primaryActionLabel: hasAnySlider
      ? "Manage Live Sliders"
      : "Publish Slider Images",
    primaryActionHref: hasAnySlider
      ? "/store-slider-management"
      : "/store-slider-image-form",
  };
}
