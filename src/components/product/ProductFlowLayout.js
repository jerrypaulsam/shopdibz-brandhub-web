import Link from "next/link";
import DashboardShell from "@/src/components/dashboard/DashboardShell";
import ToastMessage from "@/src/components/app/ToastMessage";

function resolveSteps(query) {
  const isBulkFlow = query["listing-mode"] === "bulk";
  const hasVariantFlow = query["variant-mode"] === "with-variant";

  if (isBulkFlow) {
    return [
      ["category", "Choose Category"],
      ["bulk", "Bulk Upload"],
    ];
  }

  if (hasVariantFlow) {
    return [
      ["category", "Choose Category"],
      ["info", "Product Info"],
      ["variation", "Variation"],
    ];
  }

  return [
    ["category", "Choose Category"],
    ["info", "Product Info"],
    ["images", "Images"],
  ];
}

/**
 * @param {{ title: string, subtitle: string, currentStep: string, query?: Record<string, string>, children: import("react").ReactNode, message?: string, success?: string }} props
 */
export default function ProductFlowLayout({
  title,
  subtitle,
  currentStep,
  query = {},
  children,
  message,
  success,
}) {
  const steps = resolveSteps(query);
  const currentIndex = steps.findIndex(([step]) => step === currentStep);
  const hasSelection = Boolean(query.category && query["sub-category"]);
  const isBulkFlow = query["listing-mode"] === "bulk";

  return (
    <DashboardShell>
      <div className="mx-auto max-w-[1320px] px-4 py-8 md:px-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="space-y-6">
            <div className="rounded-sm border border-white/10 bg-[#121212] p-6">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                  Product Listing
                </p>
                <h1 className="text-3xl font-black text-brand-white">{title}</h1>
                <p className="max-w-3xl text-sm leading-6 text-white/55">
                  {subtitle}
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {steps.map(([step, label]) => {
                  const href =
                    step === "variation" && !query["variation-type"]
                      ? { pathname: "/products/new/info", query }
                      : { pathname: `/products/new/${step}`, query };
                  const stepIndex = steps.findIndex(([value]) => value === step);
                  const canNavigate =
                    step === currentStep ||
                    stepIndex < currentIndex ||
                    (step === "info" && hasSelection) ||
                    (step === "bulk" && hasSelection && isBulkFlow);

                  if (!canNavigate) {
                    return (
                      <div
                        className="rounded-sm border border-white/10 px-3 py-3 text-left text-white/35"
                        key={step}
                      >
                        <span className="block text-[11px] font-bold uppercase tracking-[0.18em]">
                          Step
                        </span>
                        <span className="mt-1 block text-sm font-semibold">{label}</span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      className={`rounded-sm border px-3 py-3 text-left transition-colors ${
                        currentStep === step
                          ? "border-brand-gold bg-brand-gold/10 text-brand-white"
                          : "border-white/10 text-white/55 hover:border-white/20 hover:text-brand-white"
                      }`}
                      href={href}
                      key={step}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-[0.18em]">
                        Step
                      </span>
                      <span className="mt-1 block text-sm font-semibold">{label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-5 space-y-2">
                <ToastMessage message={message} type="error" />
                <ToastMessage message={success} type="success" />
              </div>
            </div>
            {children}
          </section>

          <aside className="space-y-6">
            <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-brand-gold">
                Why This Flow
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-6 text-white/55">
                <p>
                  Categories, variant mode, and variation type stay visible in the
                  URL so teams can deep-link the exact listing branch they need.
                </p>
                <p>
                  Single-product and bulk-product listing share the same category
                  state, but the submit path stays separate to keep the backend
                  payload predictable.
                </p>
                <p>
                  The form is broken into focused sections so brands can scan,
                  review, and correct details without working through one long slab.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
