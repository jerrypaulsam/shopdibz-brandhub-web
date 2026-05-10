export const COUPON_TABS = [
  {
    slug: "active",
    label: "Active",
    description: "Valid coupons that can still be redeemed.",
  },
  {
    slug: "expired",
    label: "Expired",
    description: "Coupons whose validity window has already ended.",
  },
  {
    slug: "exhausted",
    label: "Exhausted",
    description: "Coupons that have used up their allowed redemption count.",
  },
  {
    slug: "all",
    label: "All",
    description: "Every coupon fetched from the original Flutter list endpoint.",
  },
];

export const COUPON_SORTS = [
  {
    slug: "ending-soon",
    label: "Ending Soon",
  },
  {
    slug: "latest",
    label: "Latest",
  },
  {
    slug: "most-used",
    label: "Most Used",
  },
  {
    slug: "code-a-z",
    label: "Code A-Z",
  },
];

export const COUPON_TYPE_OPTIONS = [
  {
    slug: "cash",
    label: "Cash",
    code: "C",
  },
  {
    slug: "percentage",
    label: "Percentage",
    code: "P",
  },
];

/**
 * @param {unknown} value
 * @returns {string}
 */
export function firstCouponQuery(value) {
  if (Array.isArray(value)) {
    return String(value[0] || "");
  }

  return typeof value === "string" ? value : "";
}

/**
 * @param {string} slug
 * @returns {{ slug: string, label: string, description: string }}
 */
export function resolveCouponTab(slug) {
  return COUPON_TABS.find((tab) => tab.slug === slug) || COUPON_TABS[0];
}

/**
 * @param {string} slug
 * @returns {{ slug: string, label: string }}
 */
export function resolveCouponSort(slug) {
  return COUPON_SORTS.find((sort) => sort.slug === slug) || COUPON_SORTS[0];
}

/**
 * @param {string} slug
 * @returns {{ slug: string, label: string, code: string }}
 */
export function resolveCouponType(slug) {
  return (
    COUPON_TYPE_OPTIONS.find((type) => type.slug === slug) || COUPON_TYPE_OPTIONS[0]
  );
}

/**
 * @param {any} value
 * @returns {any[]}
 */
export function normalizeCoupons(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.results)) {
    return value.results;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

/**
 * @param {string | number | Date | null | undefined} value
 * @returns {Date | null}
 */
export function parseCouponDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * @param {any} coupon
 * @returns {"active" | "expired" | "exhausted"}
 */
export function getCouponStatus(coupon) {
  const used = Number(coupon?.used || 0);
  const maxValue = Number(coupon?.maxVal || coupon?.maxValue || 0);
  const validTo = parseCouponDate(coupon?.vTo || coupon?.validTo);
  const now = new Date();

  if (maxValue > 0 && used >= maxValue) {
    return "exhausted";
  }

  if (validTo && validTo.getTime() < now.getTime()) {
    return "expired";
  }

  return "active";
}

/**
 * @param {any} coupon
 * @returns {string}
 */
export function getCouponTypeLabel(coupon) {
  return String(coupon?.type || "") === "C" ? "Cash" : "Percentage";
}

/**
 * @param {string | number | Date | null | undefined} value
 * @returns {string}
 */
export function formatCouponDate(value) {
  const date = parseCouponDate(value);

  if (!date) {
    return "---";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * @param {number | string | null | undefined} value
 * @returns {string}
 */
export function formatCouponMoney(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

/**
 * @param {any[]} coupons
 * @param {string} tabSlug
 * @param {string} search
 * @param {string} sortSlug
 * @returns {any[]}
 */
export function filterAndSortCoupons(coupons, tabSlug, search, sortSlug) {
  const query = String(search || "").trim().toLowerCase();

  let collection = [...coupons];

  if (tabSlug !== "all") {
    collection = collection.filter((coupon) => getCouponStatus(coupon) === tabSlug);
  }

  if (query) {
    collection = collection.filter((coupon) =>
      String(coupon?.code || "").toLowerCase().includes(query),
    );
  }

  collection.sort((left, right) => {
    if (sortSlug === "latest") {
      return (
        (parseCouponDate(right?.vFrom || right?.validFrom)?.getTime() || 0) -
        (parseCouponDate(left?.vFrom || left?.validFrom)?.getTime() || 0)
      );
    }

    if (sortSlug === "most-used") {
      return Number(right?.used || 0) - Number(left?.used || 0);
    }

    if (sortSlug === "code-a-z") {
      return String(left?.code || "").localeCompare(String(right?.code || ""));
    }

    return (
      (parseCouponDate(left?.vTo || left?.validTo)?.getTime() || 0) -
      (parseCouponDate(right?.vTo || right?.validTo)?.getTime() || 0)
    );
  });

  return collection;
}

/**
 * @param {any[]} coupons
 * @returns {{ active: number, expired: number, exhausted: number, all: number }}
 */
export function summarizeCouponTabs(coupons) {
  return coupons.reduce(
    (summary, coupon) => {
      summary.all += 1;
      summary[getCouponStatus(coupon)] += 1;
      return summary;
    },
    {
      active: 0,
      expired: 0,
      exhausted: 0,
      all: 0,
    },
  );
}

/**
 * @param {any[]} coupons
 * @returns {{ total: number, redemptions: number, available: number }}
 */
export function summarizeCouponMetrics(coupons) {
  return coupons.reduce(
    (summary, coupon) => {
      const maxValue = Number(coupon?.maxVal || coupon?.maxValue || 0);
      const used = Number(coupon?.used || 0);

      summary.total += 1;
      summary.redemptions += used;
      summary.available += Math.max(maxValue - used, 0);
      return summary;
    },
    {
      total: 0,
      redemptions: 0,
      available: 0,
    },
  );
}
