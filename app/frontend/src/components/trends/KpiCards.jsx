import Card from '../ui/Card';
import { formatCurrency, formatPercent } from '../../utils/formatters';

function changeClass(value) {
  if (value === null || value === undefined) return 'text-slate-500';
  return value >= 0 ? 'text-green-700' : 'text-red-700';
}

function SkeletonCard() {
  return (
    <Card>
      <div data-testid="kpi-skeleton" className="h-16 animate-pulse rounded bg-slate-100" />
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
        <p className="text-sm text-slate-500">Current median</p>
        <p className="text-xl font-semibold text-slate-900">{formatCurrency(currentMedian)}</p>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Month-on-month change</p>
        <p data-testid="kpi-mom-change" className={`text-xl font-semibold ${changeClass(momChange)}`}>
          {formatPercent(momChange)}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Year-on-year change</p>
        <p data-testid="kpi-yoy-change" className={`text-xl font-semibold ${changeClass(yoyChange)}`}>
          {formatPercent(yoyChange)}
        </p>
      </Card>
      <Card>
        <p className="text-sm text-slate-500">Transactions</p>
        <p className="text-xl font-semibold text-slate-900">
          {totalTransactions.toLocaleString()}
        </p>
      </Card>
    </div>
  );
}

export default KpiCards;
