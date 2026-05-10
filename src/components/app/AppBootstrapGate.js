import LandingPage from "@/src/components/home/LandingPage";
import { useAppBootstrap } from "@/src/hooks/app/useAppBootstrap";

export default function AppBootstrapGate() {
  const { isChecking, error } = useAppBootstrap();

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-[url('/assets/logo/seller-logo.png')] bg-contain bg-center bg-no-repeat" />
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-brand-black">
            Loading Seller Hub
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-black px-6 text-brand-white">
        <div className="max-w-md text-center">
          <p className="text-lg font-bold">We could not start the app.</p>
          <p className="mt-3 text-sm text-white/60">{error}</p>
        </div>
      </main>
    );
  }

  return <LandingPage />;
}
