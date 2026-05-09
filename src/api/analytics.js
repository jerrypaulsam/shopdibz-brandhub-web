/**
 * @param {string} screenName
 * @param {string} value
 * @param {string} key
 */
export function logScreenView(screenName, value, key) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "screen_view", {
      firebase_screen: screenName,
      [key]: value,
    });
    return;
  }

  window.dispatchEvent(
    new CustomEvent("shopdibz:screen-view", {
      detail: {
        screenName,
        [key]: value,
      },
    }),
  );
}
