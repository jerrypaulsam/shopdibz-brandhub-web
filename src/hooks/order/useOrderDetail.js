import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  cancelOrder,
  fetchOrderDetail,
  fetchOrderInvoice,
  markOrderPacked,
  sendOrderMessage,
  updateOrderStatus,
  updateOrderTracking,
} from "@/src/api/orders";
import { getDashboardSession } from "@/src/api/dashboard";
import { logScreenView } from "@/src/api/analytics";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import {
  firstQueryValue,
  normalizeOrderDetail,
  resolveOrderDocumentUrl,
} from "@/src/utils/orders";

export function useOrderDetail() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const orderId = Number(firstQueryValue(router.query["order-id"]) || 0);

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);
  const documentOrderId = Number(order?.order?.id || 0);

  const loadOrder = useCallback(async () => {
    if (!router.isReady) {
      return;
    }

    if (!orderId) {
      setIsLoading(false);
      setMessage("Order ID is missing from the route.");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchOrderDetail(orderId);
      setOrder(normalizeOrderDetail(data));
    } catch (error) {
      setOrder(null);
      setMessage(
        error instanceof Error
          ? error.message
          : "Order detail could not be loaded",
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderId, router.isReady]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadOrder();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadOrder]);

  useEffect(() => {
    const session = getDashboardSession();

    logScreenView(
      "order_detail",
      session.storeUrl || "Anonymous",
      "store",
    );
  }, []);

  async function runAction(actionKey, callback) {
    try {
      setBusyAction(actionKey);
      setActionError("");
      setActionMessage("");
      const result = await callback();
      await loadOrder();
      return result;
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Order action failed",
      );
      return null;
    } finally {
      setBusyAction("");
    }
  }

  async function submitPack(payload) {
    if (
      Number(payload.packageWidth || 0) < 2 ||
      Number(payload.packageLength || 0) < 2 ||
      Number(payload.packageHeight || 0) < 2
    ) {
      setActionError("Package width, length, and height must be at least 2 cm.");
      return;
    }

    if (Number(payload.packageWeight || 0) < 50) {
      setActionError("Package weight must be at least 50 gms.");
      return;
    }

    const result = await runAction("pack", () =>
      markOrderPacked({
        orderId,
        ...payload,
      }),
    );

    if (result) {
      setActionMessage(
        order?.assistedShip
          ? "Order status updated to packed. Pickup scheduled automatically."
          : "Order status updated to packed.",
      );
    }
  }

  async function submitTracking(payload) {
    if (!String(payload.company || "").trim()) {
      setActionError("Shipping company name is required.");
      return;
    }

    if (String(payload.company || "").trim().length > 25) {
      setActionError("Shipping company name must be 25 characters or fewer.");
      return;
    }

    if (!String(payload.trackingNo || "").trim()) {
      setActionError("Tracking ID is required.");
      return;
    }

    if (String(payload.trackingNo || "").trim().length > 30) {
      setActionError("Tracking ID must be 30 characters or fewer.");
      return;
    }

    const trackingUrl = String(payload.trackingUrl || "").trim();
    if (trackingUrl) {
      try {
        new URL(trackingUrl);
      } catch {
        setActionError("Tracking URL must be a valid URL.");
        return;
      }
    }

    const result = await runAction("tracking", () =>
      updateOrderTracking({
        orderId,
        ...payload,
      }),
    );

    if (result) {
      setActionMessage("Tracking number updated.");
    }
  }

  async function submitDelivered() {
    const result = await runAction("delivered", () =>
      updateOrderStatus({
        orderId,
        status: "DD",
      }),
    );

    if (result) {
      setActionMessage("Order marked as delivered.");
    }
  }

  async function submitCancel(payload) {
    if (!Number(payload.reasonId || 0)) {
      setActionError("Cancellation reason is required.");
      return;
    }

    if (!String(payload.detail || "").trim()) {
      setActionError("Reason for cancellation is required.");
      return;
    }

    if (String(payload.detail || "").trim().length > 200) {
      setActionError("Cancellation detail must be 200 characters or fewer.");
      return;
    }

    const accepted = await confirm({
      title: "Cancel Order",
      message: `Order ${order?.order?.id || orderId} will be cancelled. This should only be used while the order is still pending.`,
      confirmLabel: "Cancel Order",
    });

    if (!accepted) {
      return;
    }

    const result = await runAction("cancel", () =>
      cancelOrder({
        orderId,
        ...payload,
      }),
    );

    if (result) {
      setActionMessage(`Order ${order?.order?.id || orderId} cancelled.`);
    }
  }

  async function openInvoice() {
    try {
      setBusyAction("invoice");
      setActionError("");
      setActionMessage("");

      if (order?.product?.status !== "DD") {
        setActionError("Invoice can only be downloaded once the order is delivered.");
        return;
      }

      if (!documentOrderId) {
        setActionError("Invoice unavailable");
        return;
      }

      const data = await fetchOrderInvoice(documentOrderId);

      const invoicePayload = resolveOrderDocumentUrl(
        String(data?.data || data?.url || ""),
      );

      if (invoicePayload && typeof window !== "undefined") {
        window.open(invoicePayload, "_blank", "noopener,noreferrer");
      } else {
        setActionError("Invoice unavailable");
        return;
      }

      setActionMessage("Invoice opened in a new tab.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invoice unavailable";
      setActionError(
        String(errorMessage).includes("404") ? "Invoice unavailable" : errorMessage,
      );
    } finally {
      setBusyAction("");
    }
  }

  async function openShippingLabel() {
    try {
      setBusyAction("label");
      setActionError("");
      setActionMessage("");

      if (!order?.assistedShip) {
        setActionError("Shipping label is not available for self-shipping.");
        return;
      }

      const labelUrl = resolveOrderDocumentUrl(
        String(order?.labelUrl || ""),
      );

      if (labelUrl && typeof window !== "undefined") {
        window.open(labelUrl, "_blank", "noopener,noreferrer");
        setActionMessage("Shipping label opened in a new tab.");
        return;
      }

      setActionError("Kindly try again in a few minutes.");
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Shipping label unavailable",
      );
    } finally {
      setBusyAction("");
    }
  }

  async function openCreditNote() {
    try {
      setBusyAction("credit-note");
      setActionError("");
      setActionMessage("");

      const creditNoteUrl = resolveOrderDocumentUrl(
        String(order?.creditNoteUrl || order?.CnUrl || ""),
      );

      if (creditNoteUrl && typeof window !== "undefined") {
        window.open(creditNoteUrl, "_blank", "noopener,noreferrer");
        setActionMessage("Credit note opened in a new tab.");
      } else {
        setActionError("Credit note unavailable");
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Credit note unavailable",
      );
    } finally {
      setBusyAction("");
    }
  }

  async function submitMessage(messageText) {
    const text = String(messageText || "").trim();

    if (!text) {
      setActionError("Message is required.");
      return false;
    }

    if (text.length > 250) {
      setActionError("Message must be 250 characters or fewer.");
      return false;
    }

    const result = await runAction("message", () =>
      sendOrderMessage({
        orderId,
        userCode: String(order?.userCode || ""),
        message: text,
      }),
    );

    if (result) {
      setActionMessage(
        "Message sent. Continue the conversation from direct chats in the app.",
      );
      return true;
    }

    return false;
  }

  async function revealPhone() {
    const accepted = await confirm({
      title: "Reveal Customer Number",
      message:
        "Personal-number contact is only allowed for order-related communication. Use in-app chat whenever possible. Policy violations can lead to store closure.",
      confirmLabel: "Reveal Number",
      tone: "default",
    });

    if (!accepted) {
      return;
    }

    setIsPhoneVisible((current) => !current);
  }

  return {
    orderId,
    order,
    isLoading,
    message,
    actionMessage,
    actionError,
    busyAction,
    isPhoneVisible,
    revealPhone,
    submitPack,
    submitTracking,
    submitDelivered,
    submitCancel,
    submitMessage,
    openInvoice,
    openCreditNote,
    openShippingLabel,
    refresh: loadOrder,
  };
}
