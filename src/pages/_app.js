import "../styles/globals.css";
import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { trackPageView } from "@/src/api/analytics";
import MaintenanceScreen from "@/src/components/app/MaintenanceScreen";
import ConfirmProvider from "@/src/components/app/ConfirmProvider";
import FirebaseNotificationsBootstrap from "@/src/components/app/FirebaseNotificationsBootstrap";
import SeoHead from "@/src/components/app/SeoHead";
import SellerRouteGuard from "@/src/components/app/SellerRouteGuard";
import ThemeProvider from "@/src/components/app/ThemeProvider";
import ThemeToggle from "@/src/components/app/ThemeToggle";
import ToastProvider from "@/src/components/app/ToastProvider";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const analyticsId =
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    "";
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  const hasAnalyticsTracking = Boolean(
    analyticsId || metaPixelId || clarityProjectId,
  );

  useEffect(() => {
    if (!hasAnalyticsTracking || !router.events) {
      return undefined;
    }

    function handleRouteChange(url) {
      trackPageView(analyticsId, url || window.location.pathname);
    }

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [analyticsId, hasAnalyticsTracking, router.events]);

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
          {metaPixelId ? (
            <Script id="shopdibz-meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
          ) : null}
          {clarityProjectId ? (
            <Script id="shopdibz-clarity" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityProjectId}");
              `}
            </Script>
          ) : null}
          <FirebaseNotificationsBootstrap />
          <SellerRouteGuard>
            <Component {...pageProps} />
          </SellerRouteGuard>
          <ThemeToggle />
        </ThemeProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
