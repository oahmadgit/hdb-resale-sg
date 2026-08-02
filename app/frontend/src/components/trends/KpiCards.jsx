import Card from '../ui/Card';
import { formatCurrency, formatPercent } from '../../utils/formatters';

function changeClass(value) {
  if (value === null || value === undefined) return 'text-slate-400';
  return value >= 0 ? 'text-green-700' : 'text-red-700';
}

function SkeletonCard() {
  return (
    <Card>
      <div data-testid="kpi-skeleton" className="h-16 animate-pulse rounded-lg bg-slate-100" />
    </Card>
  );
}

function KpiCards({ kpis, isLoading = false }) {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const { currentMedian, momChange, yoyChange, totalTransactions } = kpis;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Average price
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {formatCurrency(currentMedian)}
        </p>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Month-on-month
        </p>
        <p
          data-testid="kpi-mom-change"
          className={`mt-1 text-2xl font-extrabold ${changeClass(momChange)}`}
        >
          {formatPercent(momChange)}
        </p>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Year-on-year
        </p>
        <p
          data-testid="kpi-yoy-change"
          className={`mt-1 text-2xl font-extrabold ${changeClass(yoyChange)}`}
        >
          {formatPercent(yoyChange)}
        </p>
      </Card>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Overall Transactions
        </p>
        <p className="mt-1 text-2xl font-extrabold text-slate-900">
          {(totalTransactions ?? 0).toLocaleString()}
        </p>
      </Card>
    </div>
  );
}

export default KpiCards;
