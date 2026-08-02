import { useMemo, useState } from 'react';

import Card from '../ui/Card';
import YearRangeSelect, { MAX_YEAR_SPAN } from './YearRangeSelect';
import { getAvailableYears, filterByYearRange } from './PriceTrendChart';
import { formatMonth } from '../../utils/formatters';

export function aggregateVolumeByMonth(series) {
  const byMonth = new Map();

  for (const { data } of series) {
    for (const point of data) {
      byMonth.set(point.month, (byMonth.get(point.month) ?? 0) + point.count);
    }
  }

  return Array.from(byMonth.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => (a.month < b.month ? -1 : 1));
}

function VolumeChart({ series }) {
  const [hovered, setHovered] = useState(null);

  const fullChartData = useMemo(() => aggregateVolumeByMonth(series), [series]);
  const years = useMemo(() => getAvailableYears(fullChartData), [fullChartData]);

  const [yearRange, setYearRange] = useState(null);

  if (series.length === 0) {
    return (
      <Card className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-500">No data to display.</p>
      </Card>
    );
  }

  const fromYear = yearRange?.fromYear ?? Math.max(years[years.length - 1] - (MAX_YEAR_SPAN - 1), years[0] ?? 0);
  const toYear = yearRange?.toYear ?? years[years.length - 1] ?? 0;

  const chartData = filterByYearRange(fullChartData, fromYear, toYear);

  if (chartData.length === 0) {
    return (
      <Card className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-500">No data in the selected year range.</p>
      </Card>
    );
  }

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);
  const total = chartData.reduce((sum, d) => sum + d.count, 0);
  const active = hovered ?? chartData[chartData.length - 1];

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-900">Transaction volume</h3>
        <YearRangeSelect years={years} fromYear={fromYear} toYear={toYear} onChange={setYearRange} />
      </div>
      <div className="mb-2 flex items-baseline justify-between">
        <span />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {total.toLocaleString()} total
        </span>
      </div>

      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-slate-900">
          {active.count.toLocaleString()}
        </span>
        <span className="text-sm text-slate-500">{formatMonth(active.month)}</span>
      </div>

      <div
        role="img"
        aria-label={`Monthly transaction volume from ${formatMonth(chartData[0].month)} to ${formatMonth(chartData[chartData.length - 1].month)}`}
        className="flex flex-1 items-end gap-0.5"
        onMouseLeave={() => setHovered(null)}
      >
        {chartData.map((point) => {
          const isActive = active.month === point.month;
          const heightPct = Math.max((point.count / maxCount) * 100, 4);
          return (
            <div
              key={point.month}
              className="group relative flex h-full flex-1 cursor-default items-end"
              onMouseEnter={() => setHovered(point)}
              onFocus={() => setHovered(point)}
              tabIndex={0}
            >
              <div
                className={`w-full rounded-t transition-colors ${
                  isActive ? 'bg-brand-600' : 'bg-slate-200 group-hover:bg-brand-300'
                }`}
                style={{ height: `${heightPct}%`, minHeight: '2px' }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-slate-400">
        <span>{formatMonth(chartData[0].month)}</span>
        <span>{formatMonth(chartData[chartData.length - 1].month)}</span>
      </div>
    </Card>
  );
}

export default VolumeChart;
