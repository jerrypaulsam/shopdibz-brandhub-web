/**
 * @param {{ data: Array<{ label: string, value: number }>, stroke?: string, axisLabel: string }} props
 */
export default function LineChart({ data, stroke = "#D4AF37", axisLabel }) {
  const width = 720;
  const height = 280;
  const padding = 36;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? width / 2
        : padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (item.value / maxValue) * (height - padding * 2);

    return {
      ...item,
      x,
      y,
    };
  });
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-white/40">
        No chart data yet.
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
        {axisLabel}
      </p>
      <div className="overflow-x-auto">
        <svg
          className="min-w-[560px]"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={axisLabel}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = height - padding - tick * (height - padding * 2);
            return (
              <g key={tick}>
                <line
                  x1={padding}
                  x2={width - padding}
                  y1={y}
                  y2={y}
                  stroke="var(--chart-grid)"
                />
                <text x={8} y={y + 4} fill="var(--chart-axis)" fontSize="11">
                  {Math.round(maxValue * tick)}
                </text>
              </g>
            );
          })}
          <path d={path} fill="none" stroke={stroke} strokeWidth="3" />
          {points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="5" fill={stroke} />
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                fill="var(--chart-axis-strong)"
                fontSize="11"
                fontWeight="700"
              >
                {point.value}
              </text>
              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                fill="var(--chart-axis)"
                fontSize="10"
              >
                {point.label.replace("\nto\n", " - ")}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
