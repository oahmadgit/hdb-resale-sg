import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import Card from '../ui/Card';
import { formatCurrency, formatMonth } from '../../utils/formatters';

// Validated categorical slots (blue, orange, aqua) — see dataviz skill palette.
// This ordering clears CVD + normal-vision separation for up to 3 concurrent series.
const LINE_COLORS = ['#2a78d6', '#eb6834', '#1baf7a'];

function gradientId(town) {
  return `price-fill-${town.replace(/[^a-zA-Z0-9]+/g, '-')}`;
}

export function mergeSeriesByMonth(series) {
  const byMonth = new Map();

  for (const { town, data } of series) {
    for (const point of data) {
      if (!byMonth.has(point.month)) {
        byMonth.set(point.month, { month: point.month });
      }
      byMonth.get(point.month)[town] = point.median;
    }
  }

  return Array.from(byMonth.values()).sort((a, b) => (a.month < b.month ? -1 : 1));
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  // Area + Line share a dataKey per town; keep only the Line entry (identified by
  // its non-zero stroke) so each town appears once instead of twice.
  const seen = new Set();
  const lineEntries = payload.filter((entry) => {
    if (entry.stroke === 'none' || seen.has(entry.dataKey)) return false;
    seen.add(entry.dataKey);
    return true;
  });

  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-card-hover">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {formatMonth(label)}
      </p>
      <div className="flex flex-col gap-1">
        {lineEntries.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
            <span
              className="h-0.5 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-semibold text-slate-900">{formatCurrency(entry.value)}</span>
            <span className="text-slate-500">{entry.dataKey}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EndLabel({ x, y, index, data, town, color }) {
  if (index !== data.length - 1) return null;
  return (
    <text x={x + 8} y={y} dy={4} fontSize={12} fontWeight={600} fill={color}>
      {town}
    </text>
  );
}

function PriceTrendChart({ series }) {
  if (series.length === 0) {
    return (
      <Card className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-500">No data to display.</p>
      </Card>
    );
  }

  const chartData = mergeSeriesByMonth(series);
  const showLegend = series.length > 1;
  const longestTownLength = Math.max(...series.map(({ town }) => town.length));
  const rightMargin = showLegend ? 12 : longestTownLength * 7 + 16;

  return (
    <Card className="flex h-full flex-col">
      <h3 className="mb-2 font-semibold text-slate-900">Average price trend</h3>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 8, right: rightMargin, left: 0, bottom: 0 }}>
          <defs>
            {series.map(({ town }, index) => {
              const color = LINE_COLORS[index % LINE_COLORS.length];
              return (
                <linearGradient key={town} id={gradientId(town)} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid stroke="#e1e0d9" strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            tick={{ fontSize: 12, fill: '#898781' }}
            stroke="#c3c2b7"
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 12, fill: '#898781' }}
            stroke="#c3c2b7"
            tickLine={false}
            width={80}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#c3c2b7', strokeWidth: 1 }} />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} iconType="plainline" />}
          {series.map(({ town }) => {
            return (
              <Area
                key={`area-${town}`}
                type="monotone"
                dataKey={town}
                stroke="none"
                fill={`url(#${gradientId(town)})`}
                connectNulls
                legendType="none"
                isAnimationActive={false}
              />
            );
          })}
          {series.map(({ town }, index) => {
            const color = LINE_COLORS[index % LINE_COLORS.length];
            return (
              <Line
                key={town}
                type="monotone"
                dataKey={town}
                name={town}
                stroke={color}
                strokeWidth={2}
                connectNulls
                dot={false}
                activeDot={{ r: 4, stroke: '#fcfcfb', strokeWidth: 2 }}
                label={
                  showLegend
                    ? undefined
                    : (props) => <EndLabel {...props} data={chartData} town={town} color={color} />
                }
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default PriceTrendChart;
