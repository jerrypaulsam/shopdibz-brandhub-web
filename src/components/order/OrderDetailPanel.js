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
 * @param {{ order: any, isLoading: boolean, message: string, actionMessage: string, actionError: string, busyAction: string, isPhoneVisible: boolean, onTogglePhone: (value: boolean) => void, onSubmitPack: (payload: { packageWidth: number, packageLength: number, packageHeight: number, packageWeight: number }) => Promise<void>, onSubmitTracking: (payload: { company: string, trackingNo: string, trackingUrl: string }) => Promise<void>, onSubmitDelivered: () => Promise<void>, onSubmitCancel: (payload: { reasonId: number, detail: string }) => Promise<void>, onSubmitMessage: (message: string) => Promise<void>, onOpenInvoice: () => Promise<void>, onOpenCreditNote: () => Promise<void>, onOpenShippingLabel: () => Promise<void> }} props
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

  const status = getOrderStatusCode(order);
  const variantLabel = getOrderVariantLabel(order);
  const productSlug = order?.product?.slug || order?.prdt?.slug || "";
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

  if (isLoading) {
    return (
      <div className="px-4 py-8 md:px-8 xl:px-10">
        <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-12 text-center text-sm text-white/45">
          Loading order detail...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 py-8 md:px-8 xl:px-10">
        <div className="rounded-sm border border-white/10 bg-[#121212] px-5 py-16 text-center">
          <p className="text-base font-bold text-brand-white">
            Order unavailable
          </p>
          <p className="mt-2 text-sm text-white/45">{message || "Order detail could not be loaded."}</p>
          <Link
            className="mt-5 inline-flex min-h-10 items-center rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold"
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

      <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
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
              <div className="mt-4 inline-flex items-center gap-2 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-100">
                <span className="uppercase tracking-[0.12em] text-red-300">Ship Before</span>
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
                className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
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
              className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              disabled={busyAction === "invoice"}
              onClick={onOpenInvoice}
            >
              {busyAction === "invoice" ? "Opening..." : "Print Invoice"}
            </button>
            {status === "DD" && order?.creditNoteUrl ? (
              <button
                className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
                disabled={busyAction === "credit-note"}
                onClick={onOpenCreditNote}
              >
                {busyAction === "credit-note"
                  ? "Opening..."
                  : "Download Credit Note"}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_320px] 2xl:grid-cols-[minmax(0,1.55fr)_340px]">
        <div className="space-y-6">
          <article className="rounded-sm border border-white/10 bg-[#121212] p-5">
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
                  <p className="mt-3 text-sm font-semibold text-brand-gold">
                    {variantLabel}
                  </p>
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
            <section className="rounded-sm border border-amber-400/30 bg-amber-500/10 p-5 shadow-[0_0_0_1px_rgba(251,191,36,0.08)]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-sm border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-200">
                  Important
                </span>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-100">
                  Customer Customization Note
                </p>
              </div>
              <p className="mt-3 max-w-4xl text-base font-semibold leading-7 text-brand-white">
                {order.customizationText}
              </p>
              <p className="mt-3 text-sm leading-6 text-amber-100/80">
                Review this note before packing or dispatch to avoid misses on customized orders and reduce return risk.
              </p>
            </section>
          ) : null}

          <article className="rounded-sm border border-white/10 bg-[#121212] p-5">
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
                    className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold"
                    type="button"
                    onClick={onTogglePhone}
                  >
                    {isPhoneVisible ? "Hide mobile" : "Click to view"}
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
                    className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold"
                    type="button"
                    onClick={onTogglePhone}
                  >
                    {isPhoneVisible ? "Hide mobile" : "Click to view"}
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
                <InfoRow label="Tracking URL" value={order?.trackUrl} isLink />
                <InfoRow
                  label="Delivered On"
                  value={formatOrderDate(order?.product?.delDate)}
                />
              </div>
            </div>

            {order?.product?.cancellationReason ? (
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
                  className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
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
                  className="min-h-28 w-full rounded-sm border border-white/10 bg-black/20 px-3 py-3 text-sm text-brand-white outline-none"
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
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-xl rounded-sm border border-white/10 bg-[#121212] p-5 shadow-2xl">
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 text-white/65 transition-colors hover:border-white/20 hover:text-brand-white"
                type="button"
                onClick={() => setIsMessageComposerOpen(false)}
              >
                x
              </button>
            </div>

            <label className="mt-5 block space-y-2 text-sm text-white/60">
              <span className="block font-semibold text-brand-white">Message</span>
              <textarea
                className="min-h-36 w-full rounded-sm border border-white/10 bg-black/20 px-3 py-3 text-sm text-brand-white outline-none"
                maxLength={250}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
              />
            </label>

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                className="min-h-11 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-brand-white"
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
    <article className="rounded-sm border border-white/10 bg-[#121212] p-5">
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
    <div className="flex items-start justify-between gap-4 rounded-sm border border-white/10 bg-black/10 px-3 py-3">
      <span className="text-white/40">{label}</span>
      {isLink ? (
        <a
          className="text-right text-brand-gold underline decoration-white/15 underline-offset-4"
          href={String(value)}
          rel="noreferrer"
          target="_blank"
        >
          {value}
        </a>
      ) : (
        <span className="text-right font-semibold text-brand-white">{value}</span>
      )}
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
        className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
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
        className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
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
      className={`min-h-11 w-full rounded-sm px-4 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
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
      className="flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border border-white/10 px-4 text-sm font-bold text-white/75 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      <span>{label}</span>
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
