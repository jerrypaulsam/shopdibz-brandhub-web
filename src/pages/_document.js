import { Head, Html, Main, NextScript } from "next/document";

const THEME_INIT_SCRIPT = `
  (function () {
    var storageKey = "shopdibz-ui-theme";
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var savedTheme = localStorage.getItem(storageKey);
    var selectedTheme =
      savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
        ? savedTheme
        : "system";
    var resolvedTheme =
      selectedTheme === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : selectedTheme;

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themePreference = selectedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  })();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
