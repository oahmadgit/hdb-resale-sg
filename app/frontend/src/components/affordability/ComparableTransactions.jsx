import Card from '../ui/Card';
import { formatCurrency, formatMonth } from '../../utils/formatters';

function ComparableTransactions({ comparables }) {
  return (
    <Card>
      <h3 className="mb-1 text-lg font-bold text-slate-900">Comparable transactions</h3>
      {comparables.length === 0 ? (
        <p className="text-sm text-slate-500">No comparable transactions found.</p>
      ) : (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3 font-semibold">Month</th>
                <th className="py-2 pr-3 font-semibold">Town</th>
                <th className="py-2 pr-3 font-semibold">Flat type</th>
                <th className="py-2 pr-3 font-semibold">Storey</th>
                <th className="py-2 pr-3 font-semibold">Area (sqm)</th>
                <th className="py-2 pr-3 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((c, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-2 pr-3 text-slate-500">{formatMonth(c.month)}</td>
                  <td className="py-2 pr-3 font-medium text-slate-800">{c.town}</td>
                  <td className="py-2 pr-3 text-slate-600">{c.flat_type}</td>
                  <td className="py-2 pr-3 text-slate-600">{c.storey_range}</td>
                  <td className="py-2 pr-3 text-slate-600">{c.floor_area_sqm}</td>
                  <td className="py-2 pr-3 font-semibold text-slate-900">
                    {formatCurrency(c.resale_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default ComparableTransactions;
