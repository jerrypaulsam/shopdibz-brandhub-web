import "../styles/globals.css";
import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import MaintenanceScreen from "@/src/components/app/MaintenanceScreen";
import ConfirmProvider from "@/src/components/app/ConfirmProvider";
import SeoHead from "@/src/components/app/SeoHead";
import ThemeProvider from "@/src/components/app/ThemeProvider";
import ThemeToggle from "@/src/components/app/ThemeToggle";
import ToastProvider from "@/src/components/app/ToastProvider";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const analyticsId =
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    "";
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  useEffect(() => {
    if (!analyticsId || !router.events) {
      return undefined;
    }

    function handleRouteChange(url) {
      if (typeof window.gtag === "function") {
        window.gtag("config", analyticsId, {
          page_path: url,
        });
      }
    }

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [analyticsId, router.events]);

  if (maintenanceMode && router.pathname !== "/maintenance") {
    return (
      <>
        <SeoHead pathname="/maintenance" asPath="/maintenance" />
        <MaintenanceScreen />
      </>
    );
  }

  return (
    <ToastProvider>
      <ConfirmProvider>
        <ThemeProvider>
          <SeoHead pathname={router.pathname} asPath={router.asPath} />
          {analyticsId ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
                strategy="afterInteractive"
              />
              <Script id="shopdibz-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('js', new Date());
                  gtag('config', '${analyticsId}', {
                    page_path: window.location.pathname,
                  });
                `}
              </Script>
            </>
          ) : null}
          <Component {...pageProps} />
          <ThemeToggle />
        </ThemeProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
