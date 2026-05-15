import AuthButton from "@/src/components/auth/AuthButton";
import { useConfirm } from "@/src/components/app/ConfirmProvider";
import AuthMessage from "@/src/components/auth/AuthMessage";

/**
 * @param {{ message: string, status: string, tutorialsUrl: string, isLoggingOut: boolean, onLogout: () => Promise<void> }} props
 */
export default function AwaitingVerificationPanel({
  message,
  status,
  tutorialsUrl,
  isLoggingOut,
  onLogout,
}) {
  const { confirm } = useConfirm();

  async function handleLogout() {
    const accepted = await confirm({
      title: "Logout",
      message: "Are you sure you want to log out of Brand Hub?",
      confirmLabel: "Logout",
      cancelLabel: "Stay Logged In",
    });

    if (!accepted) {
      return;
    }

    await onLogout();
  }

  return (
    <section className="mx-auto flex w-full max-w-[640px] flex-col items-center rounded-[16px] border border-white/10 bg-[#121212] px-6 py-10 text-center shadow-2xl sm:px-10">
      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-brand-gold/20 bg-brand-black">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/15 border-t-brand-gold" />
      </div>

      <h2 className="mt-8 text-2xl font-extrabold text-brand-white">
        Awaiting Verification
      </h2>
      <p className="mt-5 text-base italic text-white/70">
        Thank you for your patience.
      </p>
      <p className="mt-2 text-sm text-white/60">We are working on it.</p>
      <p className="mt-4 text-sm font-bold tracking-[0.14em] text-brand-white">
        We will notify you once your store is ready.
      </p>

      <div className="mt-8 h-12 w-12 rounded-sm border border-white/10 bg-[url('/assets/logo/seller-logo.png')] bg-contain bg-center bg-no-repeat opacity-20" />

      <div className="mt-8 w-full max-w-[420px]">
        <AuthMessage>{resolveStatusMessage(status, message)}</AuthMessage>
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          className="inline-flex h-[55px] items-center justify-center rounded-sm border border-brand-gold/40 px-6 text-sm font-extrabold uppercase tracking-[0.18em] text-brand-gold transition-colors hover:border-brand-white hover:text-brand-white"
          href={tutorialsUrl}
          target="_blank"
          rel="noreferrer"
        >
          Watch Tutorials
        </a>
        <div className="w-full sm:w-[220px]">
          <AuthButton disabled={isLoggingOut} type="button" onClick={handleLogout}>
            {isLoggingOut ? "Logging Out..." : "Logout"}
          </AuthButton>
        </div>
      </div>
    </section>
  );
}

/**
 * @param {string} status
 * @param {string} message
 * @returns {string}
 */
function resolveStatusMessage(status, message) {
  if (message) {
    return message;
  }

  if (status === "needs-bank-details") {
    return "Bank details are required before verification can continue.";
  }

  if (status === "awaiting") {
    return "Your verification is in progress. This page checks again automatically.";
  }

  return "";
}
