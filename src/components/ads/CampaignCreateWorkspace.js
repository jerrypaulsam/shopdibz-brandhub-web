/**
 * @param {{ mode: string, title: string, productName: string, productSlug: string, budgetType: string, budget: string, dailyBudget: string, startDate: string, endDate: string, biddingType: string, isSubmitting: boolean, message: string, error: string, setBudgetType: (value: string) => void, setBudget: (value: string) => void, setDailyBudget: (value: string) => void, setStartDate: (value: string) => void, setEndDate: (value: string) => void, setBiddingType: (value: string) => void, submit: () => Promise<void> }} props
 */
export default function CampaignCreateWorkspace(props) {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 xl:px-10">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gold">
            Create Campaign
          </p>
          <h1 className="mt-3 text-2xl font-extrabold text-brand-white">
            {props.title}
          </h1>
        </div>

        <aside className="rounded-sm border border-white/10 bg-[#121212] p-5">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand-white">
            Campaign reminders
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-white/60">
            <li>Store mode promotes all approved active products.</li>
            <li>Product mode targets a single product slug.</li>
            <li>Total budget is best for fixed-duration pushes.</li>
            <li>Daily budget is better for always-on campaigns.</li>
          </ul>
        </aside>
      </section>

      {props.message ? (
        <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {props.message}
        </div>
      ) : null}

      {props.error ? (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {props.error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <form
          className="rounded-sm border border-white/10 bg-[#121212] p-5"
          onSubmit={(event) => {
            event.preventDefault();
            props.submit();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Campaign Mode">
              <select
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                value={props.mode}
                disabled
              >
                <option value="store">Store</option>
                <option value="product">Product</option>
              </select>
            </Field>

            <Field label="Bidding Strategy">
              <select
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                value={props.biddingType}
                onChange={(event) => props.setBiddingType(event.target.value)}
              >
                <option value="CPC">CPC</option>
                <option value="CPM">CPM</option>
              </select>
            </Field>

            <Field label="Budget Type">
              <select
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                value={props.budgetType}
                onChange={(event) => props.setBudgetType(event.target.value)}
              >
                <option value="Total">Total</option>
                <option value="Daily">Daily</option>
              </select>
            </Field>

            {props.budgetType === "Total" ? (
              <Field label="Total Budget (Rs.)">
                <input
                  className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                  inputMode="decimal"
                  type="number"
                  value={props.budget}
                  onChange={(event) => props.setBudget(event.target.value)}
                />
              </Field>
            ) : (
              <Field label="Daily Budget (Rs.)">
                <input
                  className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                  inputMode="decimal"
                  type="number"
                  value={props.dailyBudget}
                  onChange={(event) => props.setDailyBudget(event.target.value)}
                />
              </Field>
            )}

            <Field label="Start Date">
              <input
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                type="date"
                value={props.startDate}
                onChange={(event) => props.setStartDate(event.target.value)}
              />
            </Field>

            <Field label="End Date">
              <input
                className="min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-3 text-sm text-brand-white outline-none"
                type="date"
                value={props.endDate}
                onChange={(event) => props.setEndDate(event.target.value)}
              />
            </Field>
          </div>

          <button
            className="mt-6 min-h-11 w-full rounded-sm bg-brand-gold px-4 text-sm font-bold text-brand-black disabled:opacity-40"
            disabled={props.isSubmitting}
            type="submit"
          >
            {props.isSubmitting ? "Creating..." : "Create Campaign"}
          </button>
        </form>

        <aside className="space-y-4 rounded-sm border border-white/10 bg-[#121212] p-5">
          <Info label="Mode" value={props.mode === "product" ? "Product Promotion" : "Store Promotion"} />
          {props.mode === "product" ? (
            <>
              <Info label="Product Name" value={props.productName || "Selected from product screen"} />
              <Info label="Product Slug" value={props.productSlug || "---"} />
            </>
          ) : (
            <Info label="Coverage" value="All approved and active store products" />
          )}
          <Info label="Budget Type" value={props.budgetType} />
          <Info label="Bidding" value={props.biddingType} />
        </aside>
      </section>
    </div>
  );
}

/**
 * @param {{ label: string, children: import("react").ReactNode }} props
 */
function Field({ label, children }) {
  return (
    <label className="space-y-2 text-sm text-white/60">
      <span className="block font-semibold text-brand-white">{label}</span>
      {children}
    </label>
  );
}

/**
 * @param {{ label: string, value: string }} props
 */
function Info({ label, value }) {
  return (
    <div className="rounded-sm border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-brand-white">{value}</p>
    </div>
  );
}
