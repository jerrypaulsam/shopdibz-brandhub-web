import { Head, Html, Main, NextScript } from "next/document";

const THEME_INIT_SCRIPT = `
  (function () {
    var storageKey = "shopdibz-ui-theme";
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var savedTheme = localStorage.getItem(storageKey);
    var selectedTheme =
      savedTheme === "light" || savedTheme === "dark" || savedTheme === "system"
        ? savedTheme
        : "dark";
    var resolvedTheme =
      selectedTheme === "system"
        ? (mediaQuery.matches ? "dark" : "light")
        : selectedTheme;

    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.themePreference = selectedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  })();
`;

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </Head>
      <body suppressHydrationWarning>
        {META_PIXEL_ID ? (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              height="1"
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              style={{ display: "none" }}
              width="1"
            />
          </noscript>
        ) : null}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
