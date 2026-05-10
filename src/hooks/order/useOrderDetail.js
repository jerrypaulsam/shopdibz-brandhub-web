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
import { firstQueryValue } from "@/src/utils/orders";

export function useOrderDetail() {
  const router = useRouter();
  const orderId = Number(firstQueryValue(router.query["order-id"]) || 0);

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");
      const data = await fetchOrderDetail(orderId);
      setOrder(data);
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
  }, [orderId]);

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
      const data = await fetchOrderInvoice(orderId);
      const invoiceUrl = String(data?.data || data?.url || "");

      if (invoiceUrl && typeof window !== "undefined") {
        window.open(invoiceUrl, "_blank", "noopener,noreferrer");
      } else {
        setActionError("Invoice unavailable");
        return;
      }

      setActionMessage("Invoice opened in a new tab.");
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Invoice unavailable",
      );
    } finally {
      setBusyAction("");
    }
  }

  async function submitMessage(messageText) {
    const result = await runAction("message", () =>
      sendOrderMessage({
        orderId,
        userCode: String(order?.userCode || ""),
        message: messageText,
      }),
    );

    if (result) {
      setActionMessage(
        "Message sent. Continue the conversation from direct chats in the app.",
      );
    }
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
    setIsPhoneVisible,
    submitPack,
    submitTracking,
    submitDelivered,
    submitCancel,
    submitMessage,
    openInvoice,
    refresh: loadOrder,
  };
}
