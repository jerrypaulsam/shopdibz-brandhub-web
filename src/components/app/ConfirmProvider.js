import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ConfirmContext = createContext(null);

const DEFAULT_OPTIONS = {
  title: "Please Confirm",
  message: "Are you sure you want to continue?",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  tone: "danger",
};

/**
 * @param {{ children: import("react").ReactNode }} props
 */
export default function ConfirmProvider({ children }) {
  const resolverRef = useRef(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    title: DEFAULT_OPTIONS.title,
    message: DEFAULT_OPTIONS.message,
    confirmLabel: DEFAULT_OPTIONS.confirmLabel,
    cancelLabel: DEFAULT_OPTIONS.cancelLabel,
    tone: DEFAULT_OPTIONS.tone,
  });

  const closeDialog = useCallback((accepted) => {
    if (resolverRef.current) {
      resolverRef.current(Boolean(accepted));
      resolverRef.current = null;
    }

    setDialogState((current) => ({
      ...current,
      open: false,
    }));
  }, []);

  const confirm = useCallback((options = {}) => {
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }

    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setDialogState({
        open: true,
        title: String(options.title || DEFAULT_OPTIONS.title),
        message: String(options.message || DEFAULT_OPTIONS.message),
        confirmLabel: String(options.confirmLabel || DEFAULT_OPTIONS.confirmLabel),
        cancelLabel: String(options.cancelLabel || DEFAULT_OPTIONS.cancelLabel),
        tone: options.tone === "default" ? "default" : DEFAULT_OPTIONS.tone,
      });
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      confirm,
    }),
    [confirm],
  );

  const confirmButtonClass =
    dialogState.tone === "default"
      ? "border-brand-gold/40 bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-black"
      : "border-red-400/35 bg-red-500/10 text-red-100 hover:border-red-300 hover:bg-red-500/20";

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      {dialogState.open ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-md rounded-sm border border-white/10 bg-[#121212] p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
              Confirmation
            </p>
            <h2 className="mt-2 text-2xl font-black text-brand-white">
              {dialogState.title}
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              {dialogState.message}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-sm border border-white/15 px-5 py-2.5 text-sm font-bold text-brand-white hover:border-white/30"
                type="button"
                onClick={() => closeDialog(false)}
              >
                {dialogState.cancelLabel}
              </button>
              <button
                className={`rounded-sm border px-5 py-2.5 text-sm font-black transition-colors ${confirmButtonClass}`}
                type="button"
                onClick={() => closeDialog(true)}
              >
                {dialogState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }

  return context;
}
