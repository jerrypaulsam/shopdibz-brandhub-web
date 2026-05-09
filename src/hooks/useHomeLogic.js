import { useCallback, useEffect, useRef } from "react";
import { logScreenView } from "@/src/api/analytics";

/**
 * @typedef {Object} HomeLogic
 * @property {import("react").MutableRefObject<HTMLElement | null>} scrollController
 * @property {(targetId: string) => void} scrollToSection
 */

/**
 * @param {{ logScreenView?: (screenName: string, userId: string, userType: string) => void }} [settingsController]
 * @returns {HomeLogic}
 */
export function useHomeLogic(settingsController) {
  /** @type {import("react").MutableRefObject<HTMLElement | null>} */
  const scrollController = useRef(null);

  useEffect(() => {
    if (typeof settingsController?.logScreenView === "function") {
      settingsController.logScreenView("home_screen", "Anonymous", "store");
      return;
    }

    logScreenView("home_screen", "Anonymous", "store");
  }, [settingsController]);

  const scrollToSection = useCallback((targetId) => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return {
    scrollController,
    scrollToSection,
  };
}
