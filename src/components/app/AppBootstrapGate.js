import BrandHubLogo from "@/src/components/app/BrandHubLogo";
import LandingPage from "@/src/components/home/LandingPage";
import { useAppBootstrap } from "@/src/hooks/app/useAppBootstrap";

export default function AppBootstrapGate() {
  const { isChecking, error } = useAppBootstrap();

  if (isChecking) {
    return (
      <main className="theme-app flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full">
            <BrandHubLogo alt="Shopdibz Brand Hub" width={80} height={80} priority />
          </div>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em]">
            Loading Brand Hub
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="theme-app flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="text-lg font-bold">We could not start the app.</p>
          <p className="theme-text-muted mt-3 text-sm">{error}</p>
        </div>
      </main>
    );
  }

  return <LandingPage />;
}
