import Head from "next/head";

const SITE_NAME = "Shopdibz Brand Hub";
const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://brandhub.shopdibz.com",
);
const DEFAULT_TITLE = "Shopdibz Brand Hub | Exclusive For High-Quality Indian Brands & Boutiques";
const DEFAULT_DESCRIPTION =
  "Built for high-quality Indian brands and boutiques, Shopdibz Brand Hub helps you launch your storefront, tell your story, and grow with tools for products, campaigns, payouts, and daily operations.";
const DEFAULT_IMAGE = `${SITE_URL}/assets/logo/icon-512.png`;
const DEFAULT_IMAGE_WIDTH = "512";
const DEFAULT_IMAGE_HEIGHT = "512";
const FAVICON_ICO = "/favicon.ico";
const APPLE_TOUCH_ICON = "/assets/logo/icon-192.png";
const ICON_192 = "/assets/logo/icon-192.png";
const ICON_512 = "/assets/logo/icon-512.png";

const PUBLIC_PATHS = new Set(["/", "/hub"]);

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeSiteUrl(value) {
  return String(value || "https://brandhub.shopdibz.com").trim().replace(/\/+$/, "");
}

/**
 * @param {string} pathname
 * @returns {boolean}
 */
function isPublicPath(pathname) {
  return PUBLIC_PATHS.has(pathname);
}

/**
 * @param {string} pathname
 * @param {string} asPath
 * @returns {string}
 */
function buildCanonicalUrl(pathname, asPath) {
  const path = pathname === "/" ? "" : asPath.split("#")[0].split("?")[0];
  return `${SITE_URL}${path}`;
}

/**
 * @param {{ pathname: string, asPath: string }} props
 */
export default function SeoHead({ pathname, asPath }) {
  const isPublic = isPublicPath(pathname);
  const canonicalUrl = buildCanonicalUrl(pathname, asPath);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    sameAs: [
      "https://www.instagram.com/shopdibz_brands/",
      "https://www.linkedin.com/company/shopdibz/",
      "https://www.facebook.com/shopdibzBrandHub",
      "https://twitter.com/shopdibz",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-8506951656",
        contactType: "customer support",
        email: "contact@shopdibz.com",
        availableLanguage: ["English"],
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Head>
      <title>{DEFAULT_TITLE}</title>
      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="format-detection" content="telephone=no" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={DEFAULT_TITLE} />
      <meta property="og:description" content={DEFAULT_DESCRIPTION} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:image:secure_url" content={DEFAULT_IMAGE} />
      <meta property="og:image:width" content={DEFAULT_IMAGE_WIDTH} />
      <meta property="og:image:height" content={DEFAULT_IMAGE_HEIGHT} />
      <meta property="og:image:alt" content="Shopdibz Brand Hub" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={DEFAULT_TITLE} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
      <meta name="twitter:image:alt" content="Shopdibz Brand Hub" />
      <link rel="canonical" href={canonicalUrl} key="canonical" />
      <link rel="icon" href={FAVICON_ICO} sizes="any" key="favicon-ico" />
      <link rel="shortcut icon" href={FAVICON_ICO} key="shortcut-icon" />
      <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON} key="apple-touch-icon" />
      <link rel="icon" type="image/png" sizes="192x192" href={ICON_192} key="icon-192" />
      <link rel="icon" type="image/png" sizes="512x512" href={ICON_512} key="icon-512" />
      {!isPublic ? <meta name="robots" content="noindex,nofollow" /> : null}
      {isPublic ? (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
        </>
      ) : null}
    </Head>
  );
}
