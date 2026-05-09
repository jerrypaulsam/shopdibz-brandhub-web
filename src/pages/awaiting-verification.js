import AuthShell from "@/src/components/auth/AuthShell";
import AwaitingVerificationPanel from "@/src/components/store/AwaitingVerificationPanel";
import { useAwaitingVerification } from "@/src/hooks/store/useAwaitingVerification";

export default function AwaitingVerificationPage() {
  const { message, status, isLoggingOut, logout, tutorialsUrl } =
    useAwaitingVerification();

  return (
    <AuthShell title="Awaiting Verification" centeredBrand>
      <AwaitingVerificationPanel
        message={message}
        status={status}
        tutorialsUrl={tutorialsUrl}
        isLoggingOut={isLoggingOut}
        onLogout={logout}
      />
    </AuthShell>
  );
}
