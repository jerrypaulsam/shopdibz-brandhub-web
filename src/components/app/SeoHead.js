import Head from "next/head";

const SITE_NAME = "Shopdibz Brand Hub";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brand.shopdibz.com";
const DEFAULT_TITLE = "Shopdibz Brand Hub | Sell Your Brand Online";
const DEFAULT_DESCRIPTION =
  "Launch, manage, and grow your Indian brand with Shopdibz Brand Hub. Seller onboarding, catalog tools, campaigns, payouts, and operations in one place.";
const DEFAULT_IMAGE = "https://brand.shopdibz.com/assets/logo/seller-logo.png";

const PUBLIC_PATHS = new Set(["/", "/hub"]);

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
  const path = pathname === "/" ? "" : asPath.split("?")[0];
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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={DEFAULT_TITLE} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="icon" href="/assets/logo/seller-logo.png" />
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
