import BrandHubLogo from "@/src/components/app/BrandHubLogo";

/**
 * @param {{ children: import("react").ReactNode, title?: string, centeredBrand?: boolean }} props
 */
export default function AuthShell({
  children,
  title = "Shopdibz Seller Hub",
  centeredBrand = false,
}) {
  return (
    <main className="theme-app min-h-screen">
      <div
        className={
          centeredBrand
            ? "mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-5 py-12"
            : "mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5"
        }
      >
        <div
          className={
            centeredBrand
              ? "mb-10 flex flex-col items-center"
              : "mb-8 flex items-center gap-3"
          }
        >
          <BrandHubLogo
            alt="Shopdibz seller logo"
            width={centeredBrand ? 60 : 40}
            height={centeredBrand ? 60 : 40}
            priority
          />
          <h1
            className={
              centeredBrand
                ? "mt-4 text-center text-2xl font-bold tracking-[0.06em] text-brand-white"
                : "text-2xl font-bold tracking-wide text-brand-white"
            }
          >
            {title}
          </h1>
        </div>

        {children}
      </div>
    </main>
  );
}
