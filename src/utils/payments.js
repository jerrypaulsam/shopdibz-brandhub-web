export const PAYMENT_TABS = [
  {
    slug: "pending",
    label: "Pending",
    description: "Payments waiting for release, review, or settlement.",
  },
  {
    slug: "settled",
    label: "Settled",
    description: "Payments already processed and transferred.",
  },
  {
    slug: "all",
    label: "All",
    description: "Every payout event tied to this store.",
  },
];

/**
 * @param {unknown} value
 * @returns {string}
 */
export function firstPaymentQuery(value) {
  if (Array.isArray(value)) {
    return String(value[0] || "");
  }

  return typeof value === "string" ? value : "";
}

/**
 * @param {string} slug
 * @returns {{ slug: string, label: string, description: string }}
 */
export function resolvePaymentTab(slug) {
  return PAYMENT_TABS.find((tab) => tab.slug === slug) || PAYMENT_TABS[0];
}

/**
 * @param {any} value
 * @returns {{ results: any[], next: boolean | string, previous: boolean | string, count: number }}
 */
export function normalizePaymentCollection(value) {
  const results =
    value?.results ||
    value?.paymentList ||
    value?.payments ||
    value?.data?.results ||
    value?.data ||
    [];

  return {
    results: Array.isArray(results) ? results : [],
    next: value?.next || value?.data?.next || false,
    previous: value?.previous || value?.data?.previous || false,
    count: Number(
      value?.count ||
        value?.data?.count ||
        (Array.isArray(results) ? results.length : 0),
    ),
  };
}

/**
 * @param {any} payment
 * @returns {string}
 */
export function getPaymentStatus(payment) {
  if (payment?.hold) {
    return "On Hold";
  }

  const initiatedAt = new Date(payment?.initDate || payment?.initiateDate || "");

  if (!Number.isNaN(initiatedAt.getTime())) {
    const age = Date.now() - initiatedAt.getTime();
    if (age < 24 * 60 * 60 * 1000) {
      return "In Process";
    }
  }

  if (payment?.tId || payment?.transactionId) {
    return "Settled";
  }

  return "Upcoming";
}

/**
 * @param {string} status
 * @returns {string}
 */
export function getPaymentStatusTone(status) {
  if (status === "Settled") {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  }

  if (status === "On Hold") {
    return "bg-red-500/15 text-red-300 border-red-500/30";
  }

  if (status === "In Process") {
    return "bg-sky-500/15 text-sky-300 border-sky-500/30";
  }

  return "bg-brand-gold/15 text-brand-gold border-brand-gold/30";
}

/**
 * @param {number | string | null | undefined} value
 * @returns {string}
 */
export function formatPaymentMoney(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

/**
 * @param {string | number | Date | null | undefined} value
 * @returns {string}
 */
export function formatPaymentDate(value) {
  if (!value) {
    return "---";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * @param {Array<any>} payments
 * @returns {{ pendingAmount: number, settledAmount: number, holdAmount: number, totalAmount: number }}
 */
export function summarizePayments(payments) {
  return payments.reduce(
    (summary, payment) => {
      const amount = Number(payment?.amt || payment?.amount || 0);
      const status = getPaymentStatus(payment);

      summary.totalAmount += amount;

      if (status === "Settled") {
        summary.settledAmount += amount;
      } else if (status === "On Hold") {
        summary.holdAmount += amount;
      } else {
        summary.pendingAmount += amount;
      }

      return summary;
    },
    {
      pendingAmount: 0,
      settledAmount: 0,
      holdAmount: 0,
      totalAmount: 0,
    },
  );
}

/**
 * @param {any} storeInfo
 * @returns {string}
 */
export function getPaymentsPricingUrl(storeInfo) {
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
