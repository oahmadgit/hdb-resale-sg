import { useMemo, useState } from 'react';
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
import YearRangeSelect, { MAX_YEAR_SPAN } from './YearRangeSelect';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatCompactCurrency, formatMonth } from '../../utils/formatters';

// Validated CVD-safe categorical palette; dark variants stay legible on a dark surface.
const LINE_COLORS = ['#2a78d6', '#eb6834', '#1baf7a'];
const LINE_COLORS_DARK = ['#5b9beb', '#f3946b', '#4ecfa0'];

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

export function getAvailableYears(chartData) {
  const years = new Set(chartData.map((point) => Number(point.month.split('-')[0])));
  return Array.from(years).sort((a, b) => a - b);
}

export function filterByYearRange(chartData, fromYear, toYear) {
  return chartData.filter((point) => {
    const year = Number(point.month.split('-')[0]);
    return year >= fromYear && year <= toYear;
  });
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  // Area and Line share a dataKey per town; keep only the Line entry so each town appears once.
  const seen = new Set();
  const lineEntries = payload.filter((entry) => {
    if (entry.stroke === 'none' || seen.has(entry.dataKey)) return false;
    seen.add(entry.dataKey);
    return true;
  });

  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 shadow-card-hover dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {formatMonth(label)}
      </p>
      <div className="flex flex-col gap-1">
        {lineEntries.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
            <span
              className="h-0.5 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {formatCurrency(entry.value)}
            </span>
            <span className="text-slate-500 dark:text-slate-400">{entry.dataKey}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceTrendChart({ series }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lineColors = isDark ? LINE_COLORS_DARK : LINE_COLORS;
  const gridColor = isDark ? '#334155' : '#e1e0d9';
  const axisColor = isDark ? '#475569' : '#c3c2b7';
  const tickColor = isDark ? '#94a3b8' : '#898781';

  const fullChartData = useMemo(() => mergeSeriesByMonth(series), [series]);
  const years = useMemo(() => getAvailableYears(fullChartData), [fullChartData]);

  const [yearRange, setYearRange] = useState(null);
  const [hiddenTowns, setHiddenTowns] = useState(() => new Set());

  const fromYear = yearRange?.fromYear ?? Math.max(years[years.length - 1] - (MAX_YEAR_SPAN - 1), years[0] ?? 0);
  const toYear = yearRange?.toYear ?? years[years.length - 1] ?? 0;

  const visibleSeries = series.filter(({ town }) => !hiddenTowns.has(town));

  if (series.length === 0) {
    return (
      <Card className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">No data to display.</p>
      </Card>
    );
  }

  const chartData = filterByYearRange(fullChartData, fromYear, toYear);

  function handleLegendClick({ value: town }) {
    setHiddenTowns((prev) => {
      const next = new Set(prev);
      if (next.has(town)) {
        next.delete(town);
      } else {
        next.add(town);
      }
      return next;
    });
  }

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">Average price trend</h3>
        <YearRangeSelect
          years={years}
          fromYear={fromYear}
          toYear={toYear}
          onChange={setYearRange}
        />
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            {series.map(({ town }, index) => {
              const color = lineColors[index % lineColors.length];
              return (
                <linearGradient key={town} id={gradientId(town)} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid stroke={gridColor} strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            tick={{ fontSize: 12, fill: tickColor }}
            stroke={axisColor}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCompactCurrency}
            tick={{ fontSize: 12, fill: tickColor }}
            stroke={axisColor}
            tickLine={false}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: axisColor, strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ fontSize: 12, cursor: 'pointer', color: tickColor }}
            iconType="plainline"
            onClick={handleLegendClick}
            payload={series.map(({ town }, index) => ({
              value: town,
              type: 'plainline',
              color: lineColors[index % lineColors.length],
              payload: { strokeDasharray: 0 },
            }))}
            formatter={(value) => (
              <span style={{ opacity: hiddenTowns.has(value) ? 0.4 : 1 }}>{value}</span>
            )}
          />
          {visibleSeries.map(({ town }) => {
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
            const color = lineColors[index % lineColors.length];
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
                hide={hiddenTowns.has(town)}
                activeDot={{ r: 4, stroke: isDark ? '#0f172a' : '#fcfcfb', strokeWidth: 2 }}
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default PriceTrendChart;
