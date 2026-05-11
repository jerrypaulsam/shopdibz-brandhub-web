import {
  getInvoiceMonthOptions,
  getInvoiceYearOptions,
} from "@/src/utils/activity";

const MONTH_OPTIONS = getInvoiceMonthOptions();
const YEAR_OPTIONS = getInvoiceYearOptions();

/**
 * @param {{ isActionLoading: boolean, month: string, selectedInvoiceLabel: string, year: string, onMonthChange: (value: string) => void, onYearChange: (value: string) => void, onSubmit: () => void }} props
 */
export default function MonthlyInvoicePanel({
  isActionLoading,
  month,
  selectedInvoiceLabel,
  year,
  onMonthChange,
  onYearChange,
  onSubmit,
}) {
  return (
    <section className="rounded-sm border border-white/10 bg-[#121212] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
        Monthly Invoice
      </p>
      <h3 className="mt-3 text-xl font-extrabold text-brand-white">
        Request invoice email for a selected month
      </h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-brand-white">Month</span>
          <select
            className="mt-2 min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-4 text-sm text-brand-white outline-none transition-colors focus:border-brand-gold/50"
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
          >
            {MONTH_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-brand-white">Year</span>
          <select
            className="mt-2 min-h-11 w-full rounded-sm border border-white/10 bg-black/20 px-4 text-sm text-brand-white outline-none transition-colors focus:border-brand-gold/50"
            value={year}
            onChange={(event) => onYearChange(event.target.value)}
          >
            {YEAR_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-sm border border-white/10 bg-black/20 px-4 py-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/35">
          Selected period
        </p>
        <p className="mt-2 text-base font-semibold text-brand-white">
          {selectedInvoiceLabel}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          className="min-h-11 rounded-sm bg-brand-red px-5 text-sm font-semibold text-brand-white transition-colors hover:bg-[#ff6969] disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isActionLoading}
          onClick={onSubmit}
        >
          {isActionLoading ? "Requesting..." : "Send invoice to email"}
        </button>
      </div>
    </section>
  );
}
