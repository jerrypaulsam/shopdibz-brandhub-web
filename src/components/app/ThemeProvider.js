import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "shopdibz-ui-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";
const THEMES = ["system", "dark", "light"];

const ThemeContext = createContext({
  theme: "system",
  effectiveTheme: "dark",
  setTheme: () => {},
});

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("system");
  const [effectiveTheme, setEffectiveTheme] = useState("dark");

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const storedTheme = normalizeTheme(window.localStorage.getItem(STORAGE_KEY));
    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    function applyTheme(nextTheme) {
      const resolvedTheme =
        nextTheme === "system" ? (mediaQuery.matches ? "dark" : "light") : nextTheme;

      document.documentElement.dataset.theme = resolvedTheme;
      document.documentElement.dataset.themePreference = nextTheme;
      document.documentElement.style.colorScheme = resolvedTheme;

      setThemeState(nextTheme);
      setEffectiveTheme(resolvedTheme);
    }

    function handleSystemThemeChange() {
      if (normalizeTheme(window.localStorage.getItem(STORAGE_KEY)) === "system") {
        applyTheme("system");
      }
    }

    applyTheme(storedTheme);
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      effectiveTheme,
      setTheme(nextTheme) {
        const normalizedTheme = normalizeTheme(nextTheme);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, normalizedTheme);
        }

        setThemeState(normalizedTheme);

        if (typeof document !== "undefined") {
          const mediaMatches =
            typeof window !== "undefined" &&
            typeof window.matchMedia === "function" &&
            window.matchMedia(MEDIA_QUERY).matches;
          const resolvedTheme =
            normalizedTheme === "system"
              ? mediaMatches
                ? "dark"
                : "light"
              : normalizedTheme;

          document.documentElement.dataset.theme = resolvedTheme;
          document.documentElement.dataset.themePreference = normalizedTheme;
          document.documentElement.style.colorScheme = resolvedTheme;
          setEffectiveTheme(resolvedTheme);
        }
      },
    }),
    [effectiveTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

function normalizeTheme(value) {
  return THEMES.includes(value) ? value : "system";
}
