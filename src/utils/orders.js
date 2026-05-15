import { API_BASE_URL } from "@/src/api/config";

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
    results: Array.isArray(results) ? results.map(normalizeOrderListItem) : [],
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
    order?.prdt?.status ||
    order?.product?.status ||
      order?.statusCode ||
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
  return String(
    order?.image ||
      order?.product?.image ||
      order?.prdt?.image ||
      "",
  );
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
      "",
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
export function getOrderReference(order) {
  return String(
    order?.orderId ||
      order?.ordId ||
      order?.order?.orderId ||
      order?.order?.OrderId ||
      order?.order?.id ||
      "",
  );
}

/**
 * @param {any} order
 * @returns {number}
 */
export function getOrderItemId(order) {
  return Number(order?.oIId || order?.oI_id || order?.id || 0);
}

/**
 * @param {any} raw
 * @returns {any}
 */
export function normalizeOrderDetail(raw) {
  const order = raw || {};
  const sourceOrder = order?.order || {};
  const product = order?.product || order?.prdt || {};
  const variation = order?.variation || order?.var || null;
  const address = order?.address || order?.add || {};
  const businessAddress = order?.bAddress || order?.bAdd || {};

  return {
    ...order,
    oIId: order?.oIId ?? order?.oI_id ?? null,
    image: order?.image || "",
    user: order?.user || "",
    order: {
      ...sourceOrder,
      id: sourceOrder?.id ?? sourceOrder?.Id ?? null,
      orderId: sourceOrder?.orderId ?? sourceOrder?.OrderId ?? "",
      date: sourceOrder?.date || "",
      cancel: sourceOrder?.cancel ?? false,
      coupon: sourceOrder?.coupon || "",
    },
    variation: variation
      ? {
          ...variation,
          varCode: variation?.varCode || "",
          skuCode: variation?.skuCode ?? variation?.sku ?? "",
          variant: variation?.variant || "",
          varType: variation?.varType || [],
        }
      : null,
    product: {
      ...product,
      title: product?.title || "",
      quantity: Number(product?.quantity || 0),
      price: Number(product?.price || 0),
      status: product?.status || "",
      delDate: product?.delDate || null,
      refund: product?.refund || "",
      productCode: product?.productCode ?? product?.pCode ?? "",
      skuCode: product?.skuCode ?? product?.sku ?? "",
      cancellationReason:
        product?.cancellationReason ?? product?.canReason ?? "",
      resellPrice: product?.resellPrice ?? null,
    },
    address: {
      ...address,
      id: address?.id ?? null,
      name: address?.name || "",
      landmark: address?.landmark ?? address?.lmark ?? "",
      flatNo: address?.flatNo ?? address?.flNo ?? "",
      address: address?.address ?? address?.add ?? "",
      city: address?.city || "",
      state: address?.state || "",
      pinCode: address?.pinCode ?? address?.zipcode ?? address?.zCode ?? "",
      mobile: address?.mobile ?? address?.mob ?? "",
    },
    bAddress: {
      ...businessAddress,
      id: businessAddress?.id ?? null,
      name: businessAddress?.name || "",
      landmark: businessAddress?.landmark ?? businessAddress?.lmark ?? "",
      flatNo: businessAddress?.flatNo ?? businessAddress?.flNo ?? "",
      address: businessAddress?.address ?? businessAddress?.add ?? "",
      city: businessAddress?.city || "",
      state: businessAddress?.state || "",
      pinCode:
        businessAddress?.pinCode ??
        businessAddress?.zipcode ??
        businessAddress?.zCode ??
        "",
      mobile: businessAddress?.mobile ?? businessAddress?.mob ?? "",
    },
    shipBefore: order?.shipBefore ?? order?.shB ?? "",
    trackNo: order?.trackNo ?? order?.track ?? "",
    trackUrl: order?.trackUrl || "",
    shipCompany: order?.shipCompany ?? order?.comp ?? "",
    assistedShip: Boolean(order?.assistedShip),
    rto: Boolean(order?.rto),
    labelUrl: resolveOrderDocumentUrl(order?.labelUrl || ""),
    creditNoteUrl: resolveOrderDocumentUrl(
      order?.CnUrl ?? order?.cnUrl ?? order?.creditNoteUrl ?? "",
    ),
    customizationText:
      order?.customizationText ?? order?.cText ?? "",
    userCode: order?.userCode ?? order?.uCode ?? "",
    pickUpSchedule: order?.pickUpSchedule ?? order?.pSch ?? "",
  };
}

/**
 * @param {string} value
 * @returns {string}
 */
export function resolveOrderDocumentUrl(value) {
  const source = String(value || "").trim();

  if (!source) {
    return "";
  }

  try {
    return new URL(source).toString();
  } catch {
    try {
      return new URL(source, API_BASE_URL).toString();
    } catch {
      return source;
    }
  }
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

/**
 * @param {any} raw
 * @returns {any}
 */
function normalizeOrderListItem(raw) {
  const order = raw || {};

  return {
    ...order,
    oIId: order?.oIId ?? order?.oI_id ?? order?.id ?? null,
    orderId:
      order?.orderId ??
      order?.ordId ??
      order?.order?.orderId ??
      order?.order?.OrderId ??
      "",
    image: order?.image ?? order?.img ?? "",
    prdt: order?.prdt ?? order?.product ?? {},
    product: order?.product ?? order?.prdt ?? {},
    statusCode:
      order?.statusCode ??
      order?.prdt?.status ??
      order?.product?.status ??
      order?.status ??
      "",
  };
}
