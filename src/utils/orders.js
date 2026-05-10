export const ORDER_TABS = [
  {
    slug: "pending",
    label: "Pending",
    status: "AC",
    description: "New orders that still need package confirmation.",
  },
  {
    slug: "packed",
    label: "Packed",
    status: "PD",
    description: "Orders packed and waiting for tracking or pickup.",
  },
  {
    slug: "shipped",
    label: "Shipped",
    status: "SD",
    description: "Orders already in transit to the buyer.",
  },
  {
    slug: "delivered",
    label: "Delivered",
    status: "DD",
    description: "Completed deliveries and successful handoff.",
  },
  {
    slug: "not-received",
    label: "Not Received",
    status: "ND",
    description: "Buyer reported non-receipt or delivery mismatch.",
  },
  {
    slug: "cancelled",
    label: "Cancelled",
    status: "CA",
    description: "Seller or system-cancelled order items.",
  },
  {
    slug: "refund",
    label: "Refund",
    status: "RE",
    description: "Refund requests and completed refund cases.",
  },
  {
    slug: "all",
    label: "All",
    status: "ALL",
    description: "Every order item across the store.",
  },
];

export const ORDER_CANCEL_REASONS = [
  { id: 2, value: "Not Deliverable" },
  { id: 3, value: "Address Error" },
  { id: 4, value: "Out of Stock" },
  { id: 6, value: "Other" },
];

/**
 * @param {unknown} value
 * @returns {string}
 */
export function firstQueryValue(value) {
  if (Array.isArray(value)) {
    return String(value[0] || "");
  }

  return typeof value === "string" ? value : "";
}

/**
 * @param {string} slug
 * @returns {{ slug: string, label: string, status: string, description: string }}
 */
export function resolveOrderTab(slug) {
  return (
    ORDER_TABS.find((tab) => tab.slug === slug) ||
    ORDER_TABS[0]
  );
}

/**
 * @param {any} value
 * @returns {{ results: any[], next: boolean | string, previous: boolean | string, count: number }}
 */
export function normalizeOrderCollection(value) {
  const results =
    value?.results ||
    value?.data?.results ||
    value?.orders ||
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
 * @param {any} order
 * @returns {string}
 */
export function getOrderStatusCode(order) {
  return String(
    order?.product?.status ||
      order?.prdt?.status ||
      order?.status ||
      "",
  );
}

/**
 * @param {string} status
 * @returns {string}
 */
export function getOrderStatusLabel(status) {
  const normalizedStatus = String(status || "");

  if (normalizedStatus === "AC") {
    return "Pending";
  }

  if (normalizedStatus === "PD") {
    return "Packed";
  }

  if (normalizedStatus === "SD") {
    return "Shipped";
  }

  if (normalizedStatus === "DD") {
    return "Delivered";
  }

  if (normalizedStatus === "ND") {
    return "Not Received";
  }

  if (normalizedStatus === "CA") {
    return "Cancelled";
  }

  if (normalizedStatus === "RE") {
    return "Refund";
  }

  return "Order";
}

/**
 * @param {string} status
 * @returns {string}
 */
export function getOrderStatusTone(status) {
  const normalizedStatus = String(status || "");

  if (normalizedStatus === "DD") {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  }

  if (normalizedStatus === "SD") {
    return "bg-sky-500/15 text-sky-300 border-sky-500/30";
  }

  if (normalizedStatus === "PD") {
    return "bg-amber-500/15 text-amber-200 border-amber-500/30";
  }

  if (normalizedStatus === "CA" || normalizedStatus === "ND") {
    return "bg-red-500/15 text-red-300 border-red-500/30";
  }

  if (normalizedStatus === "RE") {
    return "bg-violet-500/15 text-violet-200 border-violet-500/30";
  }

  return "bg-brand-gold/15 text-brand-gold border-brand-gold/30";
}

/**
 * @param {any} order
 * @returns {string}
 */
export function getOrderPrimaryImage(order) {
  return String(order?.image || order?.product?.image || order?.prdt?.image || "");
}

/**
 * @param {any} order
 * @returns {string}
 */
export function getOrderProductTitle(order) {
  return String(
    order?.product?.title ||
      order?.prdt?.title ||
      order?.title ||
      "Product Unavailable",
  );
}

/**
 * @param {any} order
 * @returns {string}
 */
export function getOrderCustomerName(order) {
  return String(
    order?.address?.name ||
      order?.order?.user?.name ||
      order?.order?.user?.fullName ||
      order?.order?.user?.email ||
      "Customer",
  );
}

/**
 * @param {any} order
 * @returns {string}
 */
export function getOrderCustomerMobile(order) {
  return String(order?.address?.mobile || "");
}

/**
 * @param {any} order
 * @returns {number}
 */
export function getOrderQuantity(order) {
  return Number(order?.product?.quantity || order?.prdt?.quantity || order?.quantity || 0);
}

/**
 * @param {any} order
 * @returns {number}
 */
export function getOrderUnitPrice(order) {
  return Number(order?.product?.price || order?.prdt?.price || order?.price || 0);
}

/**
 * @param {any} order
 * @returns {string}
 */
export function getOrderVariantLabel(order) {
  const variant = order?.variation?.variant;
  const variantType =
    order?.variation?.varType?.[0]?.name ||
    order?.variation?.type?.[0]?.name ||
    "";

  if (!variant || !variantType) {
    return "";
  }

  return `${String(variant).toUpperCase()}: ${String(variantType).toUpperCase()}`;
}

/**
 * @param {string | number | Date | null | undefined} value
 * @returns {string}
 */
export function formatOrderDateTime(value) {
  if (!value) {
    return "---";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * @param {string | number | Date | null | undefined} value
 * @returns {string}
 */
export function formatOrderDate(value) {
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
 * @param {number | string | null | undefined} value
 * @returns {string}
 */
export function formatMoney(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

/**
 * @param {string} value
 * @returns {string}
 */
export function maskPhone(value) {
  const source = String(value || "");

  if (source.length < 4) {
    return source;
  }

  return `${"*".repeat(Math.max(0, source.length - 4))}${source.slice(-4)}`;
}

/**
 * @param {any} detail
 * @returns {boolean}
 */
export function canCancelOrder(detail) {
  return getOrderStatusCode(detail) === "AC";
}

/**
 * @param {any} detail
 * @returns {boolean}
 */
export function canPackOrder(detail) {
  return getOrderStatusCode(detail) === "AC";
}

/**
 * @param {any} detail
 * @returns {boolean}
 */
export function canUpdateTracking(detail) {
  return getOrderStatusCode(detail) === "PD" && !detail?.assistedShip;
}

/**
 * @param {any} detail
 * @returns {boolean}
 */
export function canMarkDelivered(detail) {
  return getOrderStatusCode(detail) === "SD" && !detail?.assistedShip;
}

/**
 * @param {any} detail
 * @returns {boolean}
 */
export function canMessageCustomer(detail) {
  const status = getOrderStatusCode(detail);
  return status !== "DD" && status !== "SD" && status !== "CA";
}
