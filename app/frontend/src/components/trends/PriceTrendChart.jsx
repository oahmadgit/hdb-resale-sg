import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import Card from '../ui/Card';
import { formatCurrency, formatMonth } from '../../utils/formatters';

const LINE_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#0891b2'];

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

function PriceTrendChart({ series }) {
  if (series.length === 0) {
    return (
      <Card>
        <p className="text-sm text-slate-500">No data to display.</p>
      </Card>
    );
  }

  const chartData = mergeSeriesByMonth(series);

  return (
    <Card>
      <h3 className="mb-2 font-semibold text-slate-900">Average Price over time</h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} width={80} />
          <Tooltip labelFormatter={formatMonth} formatter={(value) => formatCurrency(value)} />
          <Legend />
          {series.map(({ town }, index) => (
            <Line
              key={town}
              type="monotone"
              dataKey={town}
              stroke={LINE_COLORS[index % LINE_COLORS.length]}
              connectNulls
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default PriceTrendChart;
