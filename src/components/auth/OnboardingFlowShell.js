import BrandHubLogo from "@/src/components/app/BrandHubLogo";

/**
 * @param {{
 * children: import("react").ReactNode,
 * currentStep: number,
 * stepLabel: string,
 * title: string,
 * subtitle: string,
 * eyebrow?: string,
 * topAction?: import("react").ReactNode,
 * asideTitle: string,
 * asideDescription?: string,
 * asideItems?: string[],
 * asideFooter?: import("react").ReactNode,
 * }} props
 */
export default function OnboardingFlowShell({
  children,
  currentStep,
  stepLabel,
  title,
  subtitle,
  eyebrow = "Brand Hub Setup",
  topAction = null,
  asideTitle,
  asideDescription = "",
  asideItems = [],
  asideFooter = null,
}) {
  const steps = [
    "Mobile",
    "Account",
    "Email",
    "Store",
  ];

  return (
    <main className="theme-app relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-8%] h-72 w-72 rounded-full bg-brand-red/12 blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-80 w-80 rounded-full bg-brand-gold/12 blur-3xl" />
        <div className="absolute bottom-[-18%] left-[22%] h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandHubLogo
              alt="Shopdibz seller logo"
              width={42}
              height={42}
              priority
            />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                Shopdibz Brand Hub
              </p>
              <p className="theme-text-muted text-sm">Seller onboarding flow</p>
            </div>
          </div>
          {topAction}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_360px]">
          <section className="theme-surface rounded-[28px] border p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
            <div className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold">
              {eyebrow}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="theme-surface-soft rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-white">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="theme-text-muted text-sm font-semibold">
                  {stepLabel}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-brand-white sm:text-4xl">
                {title}
              </h1>
              <p className="theme-text-muted mt-4 max-w-3xl text-base leading-7 sm:text-lg">
                {subtitle}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              {steps.map((item, index) => {
                const stepNumber = index + 1;
                const state =
                  stepNumber < currentStep
                    ? "complete"
                    : stepNumber === currentStep
                      ? "current"
                      : "upcoming";

                return (
                  <div
                    className={`rounded-[20px] border px-4 py-4 ${
                      state === "current"
                        ? "border-brand-gold/35 bg-brand-gold/10"
                        : state === "complete"
                          ? "border-emerald-500/28 bg-emerald-500/10"
                          : "theme-surface-soft"
                    }`}
                    key={item}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
                      {state === "complete"
                        ? "Done"
                        : state === "current"
                          ? "Current"
                          : "Next"}
                    </p>
                    <p className="mt-2 text-sm font-extrabold text-brand-white">
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">{children}</div>
          </section>

          <aside className="space-y-6">
            <section className="theme-surface rounded-[24px] border p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
                Setup Guide
              </p>
              <h2 className="mt-3 text-xl font-extrabold text-brand-white">
                {asideTitle}
              </h2>
              {asideDescription ? (
                <p className="theme-text-muted mt-3 text-sm leading-6">
                  {asideDescription}
                </p>
              ) : null}

              {asideItems.length ? (
                <div className="mt-5 space-y-3">
                  {asideItems.map((item) => (
                    <div
                      className="theme-surface-soft flex gap-3 rounded-[18px] border px-4 py-4"
                      key={item}
                    >
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-xs font-bold text-brand-gold">
                        +
                      </span>
                      <p className="theme-text-muted text-sm leading-6">{item}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            {asideFooter ? (
              <section className="theme-surface-soft rounded-[24px] border p-6">
                {asideFooter}
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
