import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import Card from '../ui/Card';
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
  if (series.length === 0) {
    return (
      <Card>
        <p className="text-sm text-slate-500">No data to display.</p>
      </Card>
    );
  }

  const chartData = aggregateVolumeByMonth(series);

  return (
    <Card>
      <h3 className="mb-2 font-semibold text-slate-900">Transaction volume</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={40} />
          <Tooltip labelFormatter={formatMonth} />
          <Bar dataKey="count" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default VolumeChart;
