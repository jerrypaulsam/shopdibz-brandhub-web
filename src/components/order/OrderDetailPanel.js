import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ToastMessage from "@/src/components/app/ToastMessage";
import {
  ORDER_CANCEL_REASONS,
  canCancelOrder,
  canMarkDelivered,
  canMessageCustomer,
  canPackOrder,
  canUpdateTracking,
  formatMoney,
  formatOrderDate,
  formatOrderDateTime,
  getOrderCustomerMobile,
  getOrderPrimaryImage,
  getOrderProductTitle,
  getOrderQuantity,
  getOrderStatusCode,
  getOrderStatusLabel,
  getOrderStatusTone,
  getOrderUnitPrice,
  getOrderVariantLabel,
  maskPhone,
} from "@/src/utils/orders";

/**
 * @param {{ order: any, isLoading: boolean, message: string, actionMessage: string, actionError: string, busyAction: string, isPhoneVisible: boolean, onTogglePhone: (value: boolean) => void, onSubmitPack: (payload: { packageWidth: number, packageLength: number, packageHeight: number, packageWeight: number }) => Promise<void>, onSubmitTracking: (payload: { company: string, trackingNo: string, trackingUrl: string }) => Promise<void>, onSubmitRefundReturnTracking: (payload: { company: string, trackingNo: string }) => Promise<boolean>, onSubmitExchangeDecision: (decision: "APPROVED" | "DECLINED") => Promise<boolean>, onSubmitDelivered: () => Promise<void>, onSubmitCancel: (payload: { reasonId: number, detail: string }) => Promise<void>, onSubmitMessage: (message: string) => Promise<void>, onOpenInvoice: () => Promise<void>, onOpenCreditNote: () => Promise<void>, onOpenShippingLabel: () => Promise<void> }} props
 */
export default function OrderDetailPanel({
  order,
  isLoading,
  message,
  actionMessage,
  actionError,
  busyAction,
  isPhoneVisible,
  onTogglePhone,
  onSubmitPack,
  onSubmitTracking,
  onSubmitRefundReturnTracking,
  onSubmitExchangeDecision,
  onSubmitDelivered,
  onSubmitCancel,
  onSubmitMessage,
  onOpenInvoice,
  onOpenCreditNote,
  onOpenShippingLabel,
}) {
  const [packForm, setPackForm] = useState({
    packageWidth: "2",
    packageLength: "2",
    packageHeight: "2",
    packageWeight: "50",
  });
  const [trackingForm, setTrackingForm] = useState({
    company: "",
    trackingNo: "",
    trackingUrl: "",
  });
  const [cancelForm, setCancelForm] = useState({
    reasonId: String(ORDER_CANCEL_REASONS[0]?.id || 2),
    detail: "",
  });
  const [messageText, setMessageText] = useState("");
  const [isMessageComposerOpen, setIsMessageComposerOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isReturnTrackingDialogOpen, setIsReturnTrackingDialogOpen] = useState(false);
  const [returnTrackingForm, setReturnTrackingForm] = useState({
    company: "",
    trackingNo: "",
  });

  const status = getOrderStatusCode(order);
  const variantLabel = getOrderVariantLabel(order);
  const productSlug = order?.product?.slug || order?.prdt?.slug || "";
  const trackingUrl = String(order?.trackUrl || "").trim();
  const canTrackShipment = Boolean(trackingUrl);
  const hasRefundSection = Boolean(order?.product?.refundId);
  const exchangeStatus = String(order?.product?.exchangeStatus || "").trim();
  const exchangeVariantCode = String(order?.product?.exchangeVariantCode || "").trim();
  const isExchangeRelated = Boolean(exchangeStatus && exchangeStatus !== "NONE");
  const isExchangeFlow = exchangeStatus === "PENDING" || exchangeStatus === "APPROVED";
  const showExchangeOutcomeNote = exchangeStatus === "DECLINED" || exchangeStatus === "TIMED_OUT";
  const isExchangeRequest = isExchangeFlow;
  const canRespondToExchange = exchangeStatus === "PENDING";
  const isNormalRefundAccepted = String(order?.product?.refundStatus || "").trim() === "Accepted";
  const canAddReturnTrackingForExchange = exchangeStatus === "APPROVED" && isNormalRefundAccepted;
  const returnTrackingNumber = String(order?.product?.returnAwb || "").trim();
  const returnTrackingCompany = String(order?.product?.returnShipComp || "").trim();
  const hasReturnTrackingDetails = Boolean(returnTrackingNumber || returnTrackingCompany);
  const canUpdateReturnTracking = hasRefundSection
    && (isNormalRefundAccepted || canAddReturnTrackingForExchange)
    && !order?.assistedShip
    && !hasReturnTrackingDetails
    && !order?.product?.refundCompleted;
  const totalValue = useMemo(
    () => getOrderQuantity(order) * getOrderUnitPrice(order),
    [order],
  );

  async function handleSubmitMessage() {
    const sent = await onSubmitMessage(messageText);

    if (sent) {
      setMessageText("");
      setIsMessageComposerOpen(false);
    }
  }

  async function handleSubmitReturnTracking() {
    const saved = await onSubmitRefundReturnTracking(returnTrackingForm);

    if (saved) {
      setReturnTrackingForm({
        company: "",
        trackingNo: "",
      });
      setIsReturnTrackingDialogOpen(false);
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-8 md:px-8 xl:px-10">
        <div className="theme-surface rounded-sm border px-5 py-12 text-center text-sm text-white/45">
          Loading order detail...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 py-8 md:px-8 xl:px-10">
        <div className="theme-surface rounded-sm border px-5 py-16 text-center">
          <p className="text-base font-bold text-brand-white">
            Order unavailable
          </p>
          <p className="mt-2 text-sm text-white/45">{message || "Order detail could not be loaded."}</p>
          <Link
            className="theme-action-neutral mt-5 inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-semibold transition-colors"
            href="/orders-list"
          >
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <ToastMessage message={actionMessage} type="success" />
      <ToastMessage message={actionError || message} type="error" />

      <section className="theme-surface rounded-sm border p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="text-sm font-semibold text-white/45 transition-colors hover:text-brand-white"
                href="/orders-list"
              >
                Orders
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-sm font-semibold text-brand-gold">
                #{order?.order?.orderId || order?.oIId}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
              Seller order control
            </h1>

            {status !== "SD" && status !== "DD" && status !== "CA" && order?.shipBefore ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-100 [html[data-theme='light']_&]:border-red-500/35 [html[data-theme='light']_&]:bg-red-500/12 [html[data-theme='light']_&]:text-red-800">
                <span className="uppercase tracking-[0.12em] text-red-300 [html[data-theme='light']_&]:text-red-700">Ship Before</span>
                <span>{formatOrderDate(order.shipBefore)}</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${getOrderStatusTone(status)}`}
            >
              {getOrderStatusLabel(status)}
            </span>
            {(status === "PD" || status === "SD") ? (
              <button
                className="theme-action-neutral min-h-10 rounded-sm border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
                disabled={busyAction === "label"}
                onClick={onOpenShippingLabel}
              >
                {busyAction === "label"
                  ? "Opening..."
                  : "Print Shipping Label"}
              </button>
            ) : null}
            <button
              className="theme-action-neutral min-h-10 rounded-sm border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              disabled={busyAction === "invoice"}
              onClick={onOpenInvoice}
            >
              {busyAction === "invoice" ? "Opening..." : "Print Invoice"}
            </button>
            {status === "DD" && order?.creditNoteUrl ? (
              <button
                className="theme-action-neutral min-h-10 rounded-sm border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
                disabled={busyAction === "credit-note"}
                onClick={onOpenCreditNote}
              >
                {busyAction === "credit-note"
                  ? "Opening..."
                  : "Download Credit Note"}
              </button>
            ) : null}
            {canTrackShipment ? (
              <button
                className="theme-action-neutral min-h-10 rounded-sm border px-4 text-sm font-semibold transition-colors"
                type="button"
                onClick={() => window.open(trackingUrl, "_blank", "noopener,noreferrer")}
              >
                Track Shipment
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_320px] 2xl:grid-cols-[minmax(0,1.55fr)_340px]">
        <div className="space-y-6">
          {hasRefundSection ? (
            <article className="rounded-sm border border-red-500/30 bg-red-500/10 p-5 shadow-[0_0_0_1px_rgba(239,68,68,0.08)] [html[data-theme='light']_&]:border-red-500/35 [html[data-theme='light']_&]:bg-red-500/12">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-sm border border-red-300/35 bg-red-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-red-100 [html[data-theme='light']_&]:text-red-800">
                      Priority
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-100/80 [html[data-theme='light']_&]:text-red-700">
                      {isExchangeRequest ? "Exchange request details" : "Refund and return details"}
                    </p>
                  </div>
                  <h2 className="mt-3 text-xl font-extrabold text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                    {isExchangeRequest
                      ? "Exchange request details for brand visibility"
                      : "Refund details for brand visibility"}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-red-100/80 [html[data-theme='light']_&]:text-red-900/80">
                    {isExchangeRequest
                      ? "Accepting starts the exchange flow. Rejecting keeps the case in the normal refund flow."
                      : "Refund decisions are handled by the Shopdibz team or system checks after verification."}
                  </p>
                </div>
                {order?.product?.refundStatus ? (
                  <span className="inline-flex items-center self-start rounded-sm border border-red-300/35 bg-red-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-red-100 [html[data-theme='light']_&]:text-red-800">
                    {order.product.refundStatus}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Metric
                  label={isExchangeRelated ? "Return Request Status" : "Refund Status"}
                  value={order?.product?.refundStatus || "---"}
                />
                <Metric label="Request Type" value={order?.product?.refundType || "---"} />
                <Metric
                  label={isExchangeRelated ? "Reverse Shipping" : "Return Shipping"}
                  value={order?.assistedShip ? "Assisted shipping" : "Self shipping"}
                />
              </div>

              {showExchangeOutcomeNote ? (
                <div className="mt-5 rounded-sm border border-red-300/20 bg-black/15 p-4 [html[data-theme='light']_&]:bg-white/40">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-100/75 [html[data-theme='light']_&]:text-red-700">
                    Exchange update
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <InfoRow label="Exchange Status" value={exchangeStatus} />
                    <InfoRow label="Requested Variant" value={exchangeVariantCode} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                    {exchangeStatus === "TIMED_OUT"
                      ? "The exchange request was not actioned in time and has moved back to the normal refund and return flow."
                      : "The exchange request was declined and has moved back to the normal refund and return flow."}
                  </p>
                </div>
              ) : null}

              {isExchangeRequest ? (
                <div className="mt-5 rounded-sm border border-red-300/20 bg-black/15 p-4 [html[data-theme='light']_&]:bg-white/40">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-100/75 [html[data-theme='light']_&]:text-red-700">
                      Exchange request
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <InfoRow label="Exchange Status" value={exchangeStatus} />
                        <InfoRow label="Requested Variant" value={exchangeVariantCode} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                        {canRespondToExchange
                          ? "This is an exchange request. Accept to begin the exchange flow, or reject to let it continue as a normal refund."
                          : "The current exchange state is shown above."}
                      </p>
                    {exchangeStatus === "PENDING" ? (
                      <p className="mt-2 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                        If no action is taken within 24 hours, the exchange request will be declined automatically and processed as a normal refund.
                      </p>
                    ) : null}
                  </div>

                  {canRespondToExchange ? (
                    <div className="mt-5 flex flex-col gap-3 border-t border-red-300/20 pt-4 sm:flex-row">
                      <button
                        className="theme-action-accent inline-flex min-h-11 items-center justify-center rounded-sm border px-5 py-2.5 text-center text-sm font-bold leading-5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        type="button"
                        disabled={busyAction === "exchange-response"}
                        onClick={() => onSubmitExchangeDecision("APPROVED")}
                      >
                        {busyAction === "exchange-response" ? "Saving..." : "Accept"}
                      </button>
                      <button
                        className="theme-action-neutral inline-flex min-h-11 items-center justify-center rounded-sm border px-5 py-2.5 text-center text-sm font-bold leading-5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                        type="button"
                        disabled={busyAction === "exchange-response"}
                        onClick={() => onSubmitExchangeDecision("DECLINED")}
                      >
                        {busyAction === "exchange-response" ? "Saving..." : "Reject"}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {order?.product?.cancellationReason ? (
                <div className="mt-5 rounded-sm border border-red-300/20 bg-black/15 p-4 [html[data-theme='light']_&]:bg-white/40">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-100/75 [html[data-theme='light']_&]:text-red-700">
                    Reason shared
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                    {order.product.cancellationReason}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 rounded-sm border border-red-300/20 bg-black/15 p-4 [html[data-theme='light']_&]:bg-white/40">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-100/75 [html[data-theme='light']_&]:text-red-700">
                      {isExchangeRelated ? "Reverse pickup tracking" : "Return tracking"}
                    </p>
                    {canAddReturnTrackingForExchange ? (
                      <p className="mt-2 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                        Current exchange status: <span className="font-bold">{exchangeStatus}</span>. For this self-shipping exchange order, add the reverse pickup tracking details here so the return can move from the customer to the warehouse.
                      </p>
                    ) : isExchangeRelated ? (
                      <p className="mt-2 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                        Current exchange status: <span className="font-bold">{exchangeStatus}</span>. Reverse pickup tracking becomes available once the exchange is approved and the return request status is accepted.
                      </p>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                        Current refund status: <span className="font-bold">{order?.product?.refundStatus || "NA"}</span>. Return tracking can only be added after the refund is accepted.
                      </p>
                    )}
                    {hasReturnTrackingDetails ? (
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <InfoRow
                          label={isExchangeRelated ? "Reverse Pickup Company" : "Return Shipping Company"}
                          value={returnTrackingCompany}
                        />
                        <InfoRow
                          label={isExchangeRelated ? "Reverse Pickup Tracking ID" : "Return Tracking ID"}
                          value={returnTrackingNumber}
                        />
                      </div>
                    ) : order?.assistedShip ? (
                      <p className="mt-2 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                        {isExchangeRelated
                          ? "Reverse pickup is handled automatically for assisted-shipping exchange orders. Tracking details will appear here when available."
                          : "Reverse shipping is handled automatically for assisted shipping orders. Tracking details will appear here when available."}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                        {isExchangeRelated
                          ? "Reverse pickup tracking details have not been added yet for this self-shipping exchange return."
                          : "Return tracking details have not been added yet for this self-shipping refund."}
                      </p>
                    )}
                  </div>

                  {canUpdateReturnTracking ? (
                    <button
                      className="theme-action-accent inline-flex min-h-10 shrink-0 items-center rounded-sm border px-4 text-sm font-bold transition-colors"
                      type="button"
                      onClick={() => setIsReturnTrackingDialogOpen(true)}
                    >
                      Add Return Tracking
                    </button>
                  ) : null}
                </div>
              </div>

              {order?.product?.refundAttachment ? (
                <div className="mt-5">
                  <a
                    className="theme-action-neutral inline-flex min-h-10 items-center rounded-sm border px-4 text-sm font-semibold transition-colors"
                    href={order.product.refundAttachment}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open Refund Attachment
                  </a>
                </div>
              ) : null}
            </article>
          ) : null}

          <article className="theme-surface rounded-sm border p-5">
            <div className="flex flex-col gap-5 lg:flex-row">
              {getOrderPrimaryImage(order) ? (
                <Image
                  alt={getOrderProductTitle(order)}
                  className="h-40 w-40 rounded-sm border border-white/10 object-cover"
                  height={160}
                  src={getOrderPrimaryImage(order)}
                  unoptimized
                  width={160}
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-sm border border-dashed border-white/10 bg-black/20 text-xs text-white/35">
                  No image
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/35">
                  Product
                </p>
                {productSlug ? (
                  <Link
                    className="mt-2 block text-xl font-extrabold text-brand-white transition-colors hover:text-brand-gold"
                    href={`/products/${productSlug}`}
                  >
                    {getOrderProductTitle(order)}
                  </Link>
                ) : (
                  <h2 className="mt-2 text-xl font-extrabold text-brand-white">
                    {getOrderProductTitle(order)}
                  </h2>
                )}
                {variantLabel ? (
                  <div className="mt-4 rounded-sm border border-brand-gold/30 bg-brand-gold/10 px-4 py-3 shadow-[0_0_0_1px_rgba(212,175,55,0.08)] [html[data-theme='light']_&]:border-brand-gold/40 [html[data-theme='light']_&]:bg-brand-gold/15">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-sm border border-brand-gold/35 bg-brand-gold/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold [html[data-theme='light']_&]:bg-brand-gold/20">
                        Variant
                      </span>
                      <p className="text-base font-extrabold text-brand-white [html[data-theme='light']_&]:text-[#4f2c22]">
                        {variantLabel}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-brand-gold/85 [html[data-theme='light']_&]:text-[#7a4b3f]">
                      Match this exact variant before packing to avoid sending the wrong item.
                    </p>
                  </div>
                ) : null}
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Metric label="Unit Price" value={formatMoney(getOrderUnitPrice(order))} />
                  <Metric label="Quantity" value={`${getOrderQuantity(order)}`} />
                  <Metric label="Order Value" value={formatMoney(totalValue)} />
                  <Metric label="Placed" value={formatOrderDateTime(order?.order?.date)} />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <CodeCard label="Product Code" value={order?.product?.productCode} />
              <CodeCard label="Variation Code" value={order?.variation?.varCode} />
              <InfoRow
                label="SKU Code"
                value={order?.variation?.skuCode || order?.product?.skuCode}
              />
              <InfoRow label="Coupon Used" value={order?.order?.coupon} />
            </div>
          </article>

          {order?.customizationText ? (
            <section className="rounded-sm border border-amber-400/30 bg-amber-500/10 p-5 shadow-[0_0_0_1px_rgba(251,191,36,0.08)] [html[data-theme='light']_&]:bg-amber-400/10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-sm border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200">
                  Important
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-100 [html[data-theme='light']_&]:text-amber-700">
                  Customer Customization Note
                </p>
              </div>
              <p className="mt-3 max-w-4xl text-base font-semibold leading-7 text-brand-white">
                {order.customizationText}
              </p>
              <p className="mt-3 text-sm leading-6 text-amber-100/80 [html[data-theme='light']_&]:text-amber-800">
                Review this note before packing or dispatch to avoid misses on customized orders and reduce return risk.
              </p>
            </section>
          ) : null}

          <article className="theme-surface rounded-sm border p-5">
            <h2 className="text-lg font-extrabold text-brand-white">
              Address and fulfilment
            </h2>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="rounded-sm border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                  Shipping address
                </p>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <InfoRow label="Name" value={order?.address?.name} />
                  <InfoRow
                    label="Mobile"
                    value={
                      isPhoneVisible
                        ? getOrderCustomerMobile(order)
                        : maskPhone(getOrderCustomerMobile(order))
                    }
                  />
                  <button
                    className="theme-action-accent ml-auto inline-flex min-h-8 items-center justify-center rounded-sm border px-3 py-1 text-[11px] font-bold tracking-[0.12em] transition-colors"
                    type="button"
                    onClick={onTogglePhone}
                  >
                    {isPhoneVisible ? "Hide mobile" : "View Mobile"}
                  </button>
                  <InfoRow
                    label="Address"
                    value={`${order?.address?.flatNo || ""} ${order?.address?.address || ""} ${order?.address?.landmark || ""}`.trim()}
                  />
                  <InfoRow label="Pin Code" value={order?.address?.pinCode || order?.address?.pin} />
                  <InfoRow label="State" value={order?.address?.state} />
                </div>
              </div>

              <div className="rounded-sm border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                  Billing address
                </p>
                <div className="mt-4 space-y-3 text-sm text-white/70">
                  <InfoRow label="Name" value={order?.bAddress?.name} />
                  <InfoRow
                    label="Mobile"
                    value={
                      isPhoneVisible
                        ? order?.bAddress?.mobile
                        : maskPhone(order?.bAddress?.mobile)
                    }
                  />
                  <button
                    className="theme-action-accent ml-auto inline-flex min-h-8 items-center justify-center rounded-sm border px-3 py-1 text-[11px] font-bold tracking-[0.12em] transition-colors"
                    type="button"
                    onClick={onTogglePhone}
                  >
                    {isPhoneVisible ? "Hide mobile" : "View Mobile"}
                  </button>
                  <InfoRow
                    label="Address"
                    value={`${order?.bAddress?.flatNo || ""} ${order?.bAddress?.address || ""} ${order?.bAddress?.landmark || ""}`.trim()}
                  />
                  <InfoRow label="Pin Code" value={order?.bAddress?.pinCode} />
                  <InfoRow label="State" value={order?.bAddress?.state} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-sm border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/35">
                Fulfilment context
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3 text-sm text-white/70">
                <InfoRow
                  label="Shipping Mode"
                  value={order?.assistedShip ? "Assisted Shipping" : "Self Shipping"}
                />
                <InfoRow label="Ship Before" value={formatOrderDate(order?.shipBefore)} />
                <InfoRow label="Pickup Schedule" value={order?.pickUpSchedule} />
                <InfoRow label="Tracking Company" value={order?.shipCompany} />
                <InfoRow label="Tracking Number" value={order?.trackNo} />
                <TrackingActionRow label="Tracking" href={trackingUrl} />
                <InfoRow
                  label="Delivered On"
                  value={formatOrderDate(order?.product?.delDate)}
                />
              </div>
            </div>

            {order?.product?.cancellationReason && !hasRefundSection ? (
              <div className="mt-5 rounded-sm border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-brand-white">
                  {["AC", "RQ", "RJ", "CO"].includes(String(order?.product?.refund || ""))
                    ? "Reason For Refund"
                    : "Reason For Cancellation"}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {order.product.cancellationReason}
                </p>
              </div>
            ) : null}
          </article>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <ActionCard
            description="The available controls below follow the current fulfilment status of this order."
            title="Order actions"
          >
            <div className="grid gap-3">
              {(status === "PD" || status === "SD") ? (
                <SecondaryButton
                  disabled={busyAction === "label"}
                  label={
                    busyAction === "label"
                      ? "Opening..."
                      : "Print Shipping Label"
                  }
                  onClick={onOpenShippingLabel}
                />
              ) : null}
              <SecondaryButton
                disabled={busyAction === "invoice"}
                label={busyAction === "invoice" ? "Opening..." : "Print Invoice"}
                onClick={onOpenInvoice}
              />
              {status === "DD" && order?.creditNoteUrl ? (
                <SecondaryButton
                  disabled={busyAction === "credit-note"}
                  label={
                    busyAction === "credit-note"
                      ? "Opening..."
                      : "Download Credit Note"
                  }
                  onClick={onOpenCreditNote}
                />
              ) : null}
              {canMessageCustomer(order) ? (
                <SecondaryButton
                  disabled={busyAction === "message"}
                  icon="chat"
                  label={busyAction === "message" ? "Sending..." : "Ask Customer"}
                  onClick={() => setIsMessageComposerOpen(true)}
                />
              ) : null}
              {canTrackShipment ? (
                <SecondaryButton
                  label="Track Shipment"
                  onClick={() => window.open(trackingUrl, "_blank", "noopener,noreferrer")}
                />
              ) : null}
            </div>
          </ActionCard>

          {canPackOrder(order) ? (
            <ActionCard
              description="Confirm package dimensions before pickup or self-ship handoff."
              title="Mark as packed"
            >
              <NumberInput
                label="Package Width (cm)"
                value={packForm.packageWidth}
                onChange={(value) =>
                  setPackForm((current) => ({ ...current, packageWidth: value }))
                }
              />
              <NumberInput
                label="Package Length (cm)"
                value={packForm.packageLength}
                onChange={(value) =>
                  setPackForm((current) => ({ ...current, packageLength: value }))
                }
              />
              <NumberInput
                label="Package Height (cm)"
                value={packForm.packageHeight}
                onChange={(value) =>
                  setPackForm((current) => ({ ...current, packageHeight: value }))
                }
              />
              <NumberInput
                label="Package Weight (gms)"
                value={packForm.packageWeight}
                onChange={(value) =>
                  setPackForm((current) => ({ ...current, packageWeight: value }))
                }
              />
              <PrimaryButton
                disabled={busyAction === "pack"}
                label={busyAction === "pack" ? "Updating..." : "Confirm Packed"}
                onClick={() =>
                  onSubmitPack({
                    packageWidth: Number(packForm.packageWidth || 0),
                    packageLength: Number(packForm.packageLength || 0),
                    packageHeight: Number(packForm.packageHeight || 0),
                    packageWeight: Number(packForm.packageWeight || 0),
                  })
                }
              />
            </ActionCard>
          ) : null}

          {canUpdateTracking(order) ? (
            <ActionCard
              description="For self shipping, tracking updates keep the buyer informed and reduce disputes."
              title="Update tracking"
            >
              <TextInput
                label="Shipping Company"
                value={trackingForm.company}
                onChange={(value) =>
                  setTrackingForm((current) => ({ ...current, company: value }))
                }
              />
              <TextInput
                label="Tracking ID"
                value={trackingForm.trackingNo}
                onChange={(value) =>
                  setTrackingForm((current) => ({ ...current, trackingNo: value }))
                }
              />
              <TextInput
                label="Tracking URL"
                value={trackingForm.trackingUrl}
                onChange={(value) =>
                  setTrackingForm((current) => ({ ...current, trackingUrl: value }))
                }
              />
              <PrimaryButton
                disabled={busyAction === "tracking"}
                label={busyAction === "tracking" ? "Updating..." : "Save Tracking"}
                onClick={() => onSubmitTracking(trackingForm)}
              />
            </ActionCard>
          ) : null}

          {status === "PD" && order?.assistedShip ? (
            <ActionCard
              description="This order uses assisted shipping. Once it is packed, tracking and pickup progress are handled automatically."
              title="Tracking handled automatically"
            >
              <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/60">
                There is no manual tracking step for assisted shipping orders in packed state.
              </div>
            </ActionCard>
          ) : null}

          {canMarkDelivered(order) ? (
            <ActionCard
              description="Use this when the courier has confirmed completion and you need to close the loop manually."
              title="Mark delivered"
            >
              <PrimaryButton
                disabled={busyAction === "delivered"}
                label={busyAction === "delivered" ? "Updating..." : "Update to Delivered"}
                onClick={onSubmitDelivered}
              />
            </ActionCard>
          ) : null}

          {status === "SD" && order?.assistedShip ? (
            <ActionCard
              description="This shipment is managed through assisted logistics. Delivery status will update automatically when the courier confirms completion."
              title="Delivery handled automatically"
            >
              <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/60">
                Manual delivered updates are disabled for assisted shipping orders.
              </div>
            </ActionCard>
          ) : null}

          {canCancelOrder(order) ? (
            <ActionCard
              collapsible
              description="Cancellation is only allowed while the order is still in the pending stage."
              isOpen={isCancelOpen}
              onToggle={() => setIsCancelOpen((current) => !current)}
              title="Cancel order"
            >
              <label className="space-y-2 text-sm text-white/60">
                <span className="block font-semibold text-brand-white">Reason</span>
                <select
                  className="theme-field min-h-11 w-full rounded-sm border px-3 text-sm outline-none"
                  value={cancelForm.reasonId}
                  onChange={(event) =>
                    setCancelForm((current) => ({
                      ...current,
                      reasonId: event.target.value,
                    }))
                  }
                >
                  {ORDER_CANCEL_REASONS.map((reason) => (
                    <option key={reason.id} value={reason.id}>
                      {reason.value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm text-white/60">
                <span className="block font-semibold text-brand-white">Details</span>
                <textarea
                  className="theme-field min-h-28 w-full rounded-sm border px-3 py-3 text-sm outline-none"
                  maxLength={200}
                  value={cancelForm.detail}
                  onChange={(event) =>
                    setCancelForm((current) => ({
                      ...current,
                      detail: event.target.value,
                    }))
                  }
                />
              </label>
              <PrimaryButton
                disabled={busyAction === "cancel"}
                label={busyAction === "cancel" ? "Cancelling..." : "Cancel Order"}
                tone="danger"
                onClick={() =>
                  onSubmitCancel({
                    reasonId: Number(cancelForm.reasonId || 0),
                    detail: cancelForm.detail,
                  })
                }
              />
            </ActionCard>
          ) : null}

        </aside>
      </section>

      {canMessageCustomer(order) && isMessageComposerOpen ? (
        <div className="theme-overlay fixed inset-0 z-[90] flex items-center justify-center px-4">
          <div className="theme-surface w-full max-w-xl rounded-sm border p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Order Chat
                </p>
                <h2 className="mt-2 text-lg font-extrabold text-brand-white">
                  Ask Customer
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Only use this for order-related communication. Misuse can lead to
                  store closure.
                </p>
              </div>
              <button
                className="theme-action-neutral inline-flex h-10 w-10 items-center justify-center rounded-sm border transition-colors"
                type="button"
                onClick={() => setIsMessageComposerOpen(false)}
              >
                x
              </button>
            </div>

            <label className="mt-5 block space-y-2 text-sm text-white/60">
              <span className="block font-semibold text-brand-white">Message</span>
              <textarea
                className="theme-field min-h-36 w-full rounded-sm border px-3 py-3 text-sm outline-none"
                maxLength={250}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
              />
            </label>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                className="theme-action-neutral min-h-11 rounded-sm border px-4 text-sm font-semibold transition-colors"
                type="button"
                onClick={() => setIsMessageComposerOpen(false)}
              >
                Cancel
              </button>
              <PrimaryButton
                disabled={busyAction === "message"}
                label={busyAction === "message" ? "Sending..." : "Send Message"}
                onClick={handleSubmitMessage}
              />
            </div>
          </div>
        </div>
      ) : null}

      {isReturnTrackingDialogOpen ? (
        <div className="theme-overlay fixed inset-0 z-[90] flex items-center justify-center px-4">
          <div className="theme-surface w-full max-w-lg rounded-sm border p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                  Return Tracking
                </p>
                <h2 className="mt-2 text-lg font-extrabold text-brand-white">
                  Add self-shipping return details
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Use the courier details for this return shipment. Assisted reverse shipping updates automatically and does not need manual entry here.
                </p>
              </div>
              <button
                className="theme-action-neutral inline-flex h-10 w-10 items-center justify-center rounded-sm border transition-colors"
                type="button"
                onClick={() => setIsReturnTrackingDialogOpen(false)}
              >
                x
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <TextInput
                label="Return Shipping Company"
                value={returnTrackingForm.company}
                onChange={(value) =>
                  setReturnTrackingForm((current) => ({ ...current, company: value }))
                }
              />
              <TextInput
                label="Return Tracking ID"
                value={returnTrackingForm.trackingNo}
                onChange={(value) =>
                  setReturnTrackingForm((current) => ({ ...current, trackingNo: value }))
                }
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <PrimaryButton
                disabled={busyAction === "refund-tracking"}
                label={busyAction === "refund-tracking" ? "Saving..." : "Save Return Tracking"}
                onClick={handleSubmitReturnTracking}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * @param {{ title: string, description: string, children: import("react").ReactNode, collapsible?: boolean, isOpen?: boolean, onToggle?: () => void }} props
 */
function ActionCard({
  title,
  description,
  children,
  collapsible = false,
  isOpen = true,
  onToggle,
}) {
  return (
    <article className="theme-surface rounded-sm border p-5">
      {collapsible ? (
        <button
          className="flex w-full items-start justify-between gap-4 text-left"
          type="button"
          onClick={onToggle}
        >
          <div>
            <h2 className="text-base font-extrabold text-brand-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
          </div>
          <span
            className={`mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-white/10 text-white/65 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
      ) : (
        <>
          <h2 className="text-base font-extrabold text-brand-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
        </>
      )}
      {(!collapsible || isOpen) ? (
        <div className="mt-4 space-y-4">{children}</div>
      ) : null}
    </article>
  );
}

/**
 * @param {{ label: string, value: string, isLink?: boolean }} props
 */
function InfoRow({ label, value, isLink = false }) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-sm border border-white/10 bg-black/10 px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="theme-text-muted">{label}</span>
      {isLink ? (
        <a
          className="min-w-0 break-all text-left text-brand-gold underline decoration-white/15 underline-offset-4 sm:text-right"
          href={String(value)}
          rel="noreferrer"
          target="_blank"
        >
          {value}
        </a>
      ) : (
        <span className="min-w-0 break-words text-left font-semibold text-brand-white sm:text-right">
          {value}
        </span>
      )}
    </div>
  );
}

/**
 * @param {{ label: string, href: string }} props
 */
function TrackingActionRow({ label, href }) {
  if (!href) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-white/10 bg-black/10 px-3 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="theme-text-muted">{label}</span>
      <a
        className="theme-action-neutral inline-flex min-h-9 shrink-0 items-center justify-center rounded-sm border px-3 py-2 text-center text-sm font-semibold leading-5 transition-colors"
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        Track Order
      </a>
    </div>
  );
}

function CodeCard({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 break-all text-sm font-semibold text-brand-white">
        {value}
      </p>
    </div>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Metric({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-3 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}

/**
 * @param {{ label: string, value: string, onChange: (value: string) => void }} props
 */
function NumberInput({ label, value, onChange }) {
  return (
    <label className="space-y-2 text-sm text-white/60">
      <span className="block font-semibold text-brand-white">{label}</span>
      <input
        className="theme-field min-h-11 w-full rounded-sm border px-3 text-sm outline-none"
        inputMode="numeric"
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

/**
 * @param {{ label: string, value: string, onChange: (value: string) => void }} props
 */
function TextInput({ label, value, onChange }) {
  return (
    <label className="space-y-2 text-sm text-white/60">
      <span className="block font-semibold text-brand-white">{label}</span>
      <input
        className="theme-field min-h-11 w-full rounded-sm border px-3 text-sm outline-none"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

/**
 * @param {{ label: string, disabled?: boolean, tone?: "default" | "danger", onClick: () => void }} props
 */
function PrimaryButton({ label, disabled = false, tone = "default", onClick }) {
  return (
    <button
      className={`mt-2 min-h-11 w-full rounded-sm px-4 py-2 text-center text-sm font-bold leading-5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        tone === "danger"
          ? "bg-red-500 text-white hover:bg-red-400"
          : "bg-brand-gold text-brand-black hover:bg-[#f7c751]"
      }`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function SecondaryButton({ label, disabled = false, onClick, icon = "" }) {
  return (
    <button
      className="theme-action-neutral flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border px-4 py-2 text-sm font-bold leading-5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      <span className="min-w-0 flex-1 text-left break-words">{label}</span>
      {icon === "chat" ? (
        <svg
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M7 10h10" />
          <path d="M7 14h6" />
          <path d="M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9z" />
        </svg>
      ) : null}
    </button>
  );
}
