import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
 * @param {{ order: any, isLoading: boolean, message: string, actionMessage: string, actionError: string, busyAction: string, isPhoneVisible: boolean, onTogglePhone: (value: boolean) => void, onSubmitPack: (payload: { packageWidth: number, packageLength: number, packageHeight: number, packageWeight: number }) => Promise<void>, onSubmitTracking: (payload: { company: string, trackingNo: string, trackingUrl: string }) => Promise<void>, onSubmitDelivered: () => Promise<void>, onSubmitCancel: (payload: { reasonId: number, detail: string }) => Promise<void>, onSubmitMessage: (message: string) => Promise<void>, onOpenInvoice: () => Promise<void> }} props
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

  const status = getOrderStatusCode(order);
  const variantLabel = getOrderVariantLabel(order);
  const totalValue = useMemo(
    () => getOrderQuantity(order) * getOrderUnitPrice(order),
    [order],
  );

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
                #{order?.order?.id || order?.oIId}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
              Seller order control
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
              Review shipment readiness, buyer context, cancellation risk, and
              customer communication from one place without bouncing through
              hidden Flutter dialogs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-sm border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] ${getOrderStatusTone(status)}`}
            >
              {getOrderStatusLabel(status)}
            </span>
            <button
              className="min-h-10 rounded-sm border border-white/10 px-4 text-sm font-semibold text-white/70 transition-colors hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40"
              type="button"
              disabled={busyAction === "invoice"}
              onClick={onOpenInvoice}
            >
              {busyAction === "invoice" ? "Opening..." : "Print Invoice"}
            </button>
          </div>
        </div>

        {actionMessage ? (
          <div className="mt-4 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {actionMessage}
          </div>
        ) : null}

        {actionError || message ? (
          <div className="mt-4 rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {actionError || message}
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.25fr)_420px]">
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
                <h2 className="mt-2 text-xl font-extrabold text-brand-white">
                  {getOrderProductTitle(order)}
                </h2>
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

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoRow label="Product Code" value={order?.product?.productCode} />
              <InfoRow label="Variation Code" value={order?.variation?.varCode} />
              <InfoRow
                label="SKU Code"
                value={order?.variation?.skuCode || order?.product?.skuCode}
              />
              <InfoRow label="Coupon Used" value={order?.order?.coupon} />
            </div>

            {order?.customizationText ? (
              <div className="mt-5 rounded-sm border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-bold text-brand-white">
                  Customization Message
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {order.customizationText}
                </p>
              </div>
            ) : null}
          </article>

          <article className="rounded-sm border border-white/10 bg-[#121212] p-5">
            <h2 className="text-lg font-extrabold text-brand-white">
              Shipping and buyer
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
                    onClick={() => onTogglePhone(!isPhoneVisible)}
                  >
                    {isPhoneVisible ? "Hide mobile" : "Reveal mobile"}
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
                  Fulfilment context
                </p>
                <div className="mt-4 space-y-3 text-sm text-white/70">
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

        <aside className="space-y-6">
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

          {canCancelOrder(order) ? (
            <ActionCard
              description="Cancellation is only allowed while the order is still in the pending stage."
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

          {canMessageCustomer(order) ? (
            <ActionCard
              description="Keep communication order-specific. Flutter warns that misuse can lead to store closure, so the web flow preserves that restriction."
              title="Ask customer"
            >
              <label className="space-y-2 text-sm text-white/60">
                <span className="block font-semibold text-brand-white">Message</span>
                <textarea
                  className="min-h-28 w-full rounded-sm border border-white/10 bg-black/20 px-3 py-3 text-sm text-brand-white outline-none"
                  maxLength={250}
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                />
              </label>
              <PrimaryButton
                disabled={busyAction === "message"}
                label={busyAction === "message" ? "Sending..." : "Send Message"}
                onClick={() => onSubmitMessage(messageText)}
              />
            </ActionCard>
          ) : null}
        </aside>
      </section>
    </div>
  );
}

/**
 * @param {{ title: string, description: string, children: import("react").ReactNode }} props
 */
function ActionCard({ title, description, children }) {
  return (
    <article className="rounded-sm border border-white/10 bg-[#121212] p-5">
      <h2 className="text-base font-extrabold text-brand-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
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
    <div className="flex items-start justify-between gap-4">
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
