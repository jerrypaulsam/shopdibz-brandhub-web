/**
 * @param {{ data: Array<{ label: string, value: number }>, colorClass?: string, valuePrefix?: string, axisLabel: string }} props
 */
export default function HorizontalBarChart({
  data,
  colorClass = "bg-emerald-300",
  valuePrefix = "",
  axisLabel,
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-white/40">
        No chart data yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
        {axisLabel}
      </p>
      {data.map((item) => {
        const width = `${Math.max((item.value / maxValue) * 100, 4)}%`;

        return (
          <div className="grid gap-2 sm:grid-cols-[120px_1fr_88px]" key={item.label}>
            <p className="whitespace-pre-line text-xs leading-4 text-white/45">
              {item.label}
            </p>
            <div className="flex h-8 items-center">
              <div className="h-4 w-full rounded-full" style={{ background: "var(--chart-track)" }}>
                <div className={`h-4 rounded-full ${colorClass}`} style={{ width }} />
              </div>
            </div>
            <p className="text-right text-sm font-bold text-brand-white">
              {valuePrefix}
              {item.value.toLocaleString("en-IN")}
            </p>
          </div>
        );
      })}
    </div>
  );
}
