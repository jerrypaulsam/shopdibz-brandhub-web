import LandingPage from "@/src/components/home/LandingPage";
import { useSellerGuestRedirect } from "@/src/hooks/auth/useSellerGuestRedirect";

export default function HubPage() {
  const isRedirecting = useSellerGuestRedirect();

  if (isRedirecting) {
    return null;
  }

  return <LandingPage />;
}
