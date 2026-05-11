import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ message, type = "info", duration = 3600 }) => {
      const text = String(message || "").trim();

      if (!text) {
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setToasts((current) => [
        ...current,
        {
          id,
          message: text,
          type,
        },
      ]);

      window.setTimeout(() => {
        dismissToast(id);
      }, duration);
    },
    [dismissToast],
  );

  const contextValue = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

function ToastCard({ toast, onDismiss }) {
  const toneClass =
    toast.type === "error"
      ? "border-red-500/40 bg-[#2a1212] text-red-100"
      : toast.type === "success"
        ? "border-emerald-500/40 bg-[#102319] text-emerald-100"
        : "border-brand-gold/35 bg-[#201a0d] text-brand-white";

  return (
    <div
      className={`pointer-events-auto rounded-sm border px-4 py-3 shadow-2xl backdrop-blur ${toneClass}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-6">{toast.message}</p>
        </div>
        <button
          className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-white/10 text-white/70 transition-colors hover:border-white/20 hover:text-white"
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
        >
          x
        </button>
      </div>
    </div>
  );
}
