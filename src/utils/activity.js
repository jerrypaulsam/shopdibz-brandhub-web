export const ACTIVITY_PANELS = [
  {
    slug: "bulk-update",
    label: "Bulk Update",
    description: "Update product attributes or variation details from an XLSM sheet.",
    eyebrow: "Catalog operations",
  },
  {
    slug: "product-group",
    label: "Product Group",
    description: "Create curated bundles and promo groups with cover banners and discounts.",
    eyebrow: "Merchandising",
  },
  {
    slug: "monthly-invoice",
    label: "Monthly Invoice",
    description: "Request a monthly invoice snapshot delivered to the registered seller email.",
    eyebrow: "Finance",
  },
  {
    slug: "special-products",
    label: "Special Products",
    description: "Bulk add or clear Top, Featured, and Daily Deals placements.",
    eyebrow: "Promotions",
  },
];

export const BULK_UPDATE_MODES = [
  {
    slug: "product-attributes",
    label: "Product Attributes",
    description: "Update parent product data like price, stock, or catalog details.",
    variants: false,
  },
  {
    slug: "variation-details",
    label: "Variation Details",
    description: "Update variation-level rows for size, color, SKU, and stock changes.",
    variants: true,
  },
];

export const SPECIAL_PRODUCT_TYPES = [
  {
    slug: "top-products",
    code: "0",
    label: "Top Products",
    description: "Pinned visibility for high-priority catalog items.",
  },
  {
    slug: "featured-products",
    code: "1",
    label: "Featured Products",
    description: "Homepage-style featuring for premium catalog exposure.",
  },
  {
    slug: "daily-deals",
    code: "2",
    label: "Daily Deals",
    description: "Time-sensitive merchandising for promotional pushes.",
  },
];

export const PRODUCT_GROUP_DISCOUNT_TYPES = [
  { code: "0", label: "No Discount" },
  { code: "2", label: "Amount" },
  { code: "1", label: "Percentage" },
];

/**
 * @param {unknown} value
 * @returns {string}
 */
export function firstActivityQuery(value) {
  if (Array.isArray(value)) {
    return String(value[0] || "");
  }

  return typeof value === "string" ? value : "";
}

/**
 * @param {string} slug
 * @returns {{ slug: string, label: string, description: string, eyebrow: string }}
 */
export function resolveActivityPanel(slug) {
  return ACTIVITY_PANELS.find((panel) => panel.slug === slug) || ACTIVITY_PANELS[0];
}

/**
 * @param {string} slug
 * @returns {{ slug: string, label: string, description: string, variants: boolean }}
 */
export function resolveBulkUpdateMode(slug) {
  return BULK_UPDATE_MODES.find((mode) => mode.slug === slug) || BULK_UPDATE_MODES[0];
}

/**
 * @param {string} slug
 * @returns {{ slug: string, code: string, label: string, description: string }}
 */
export function resolveSpecialProductType(slug) {
  return (
    SPECIAL_PRODUCT_TYPES.find((type) => type.slug === slug) ||
    SPECIAL_PRODUCT_TYPES[0]
  );
}

/**
 * @param {any} value
 * @returns {{ results: any[], count: number }}
 */
export function normalizeActivityGroups(value) {
  const results =
    value?.results ||
    value?.groups ||
    value?.productGroups ||
    value?.data?.results ||
    value?.data ||
    [];

  return {
    results: Array.isArray(results) ? results : [],
    count: Number(
      value?.count ||
        value?.data?.count ||
        (Array.isArray(results) ? results.length : 0),
    ),
  };
}

/**
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("File could not be read"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * @param {any} storeInfo
 * @returns {string}
 */
export function getActivityPricingUrl(storeInfo) {
  const userCode =
    storeInfo?.userCode ||
    storeInfo?.user?.code ||
    storeInfo?.user?.userCode ||
    "";

  if (!userCode) {
    return "";
  }

  return `https://loadapp.shopdibz.com/api/payments/pricing/?code=${userCode}`;
}

/**
 * @param {any} storeInfo
 * @returns {boolean}
 */
export function isPremiumStore(storeInfo) {
  return Boolean(storeInfo?.prem || storeInfo?.premium || storeInfo?.plan?.premium);
}

/**
 * @param {any} storeInfo
 * @returns {string}
 */
export function getStorePlanCode(storeInfo) {
  return String(
    storeInfo?.planCode ||
      storeInfo?.plan?.code ||
      storeInfo?.plan ||
      "",
  ).trim().toUpperCase();
}

/**
 * @param {string | number} month
 * @param {string | number} year
 * @returns {string}
 */
export function formatInvoicePeriod(month, year) {
  const monthNumber = Number(month || 0);
  const yearNumber = Number(year || 0);

  if (!monthNumber || !yearNumber) {
    return "Select month";
  }

  const date = new Date(yearNumber, monthNumber - 1, 1);

  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

/**
 * @returns {Array<{ value: string, label: string }>}
 */
export function getInvoiceMonthOptions() {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(2024, index, 1);
    return {
      value: String(index + 1),
      label: date.toLocaleDateString("en-IN", { month: "long" }),
    };
  });
}

/**
 * @returns {Array<{ value: string, label: string }>}
 */
export function getInvoiceYearOptions() {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: 10 }, (_, index) => {
    const year = currentYear - index;
    return {
      value: String(year),
      label: String(year),
    };
  });
}
