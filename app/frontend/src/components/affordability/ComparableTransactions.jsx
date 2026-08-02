import Card from '../ui/Card';
import { formatCurrency, formatMonth } from '../../utils/formatters';

function ComparableTransactions({ comparables }) {
  return (
    <Card>
      <h3 className="mb-2 font-semibold text-slate-900">Comparable transactions</h3>
      {comparables.length === 0 ? (
        <p className="text-sm text-slate-500">No comparable transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-1 pr-2 font-medium">Month</th>
                <th className="py-1 pr-2 font-medium">Town</th>
                <th className="py-1 pr-2 font-medium">Flat type</th>
                <th className="py-1 pr-2 font-medium">Storey</th>
                <th className="py-1 pr-2 font-medium">Area (sqm)</th>
                <th className="py-1 pr-2 font-medium">Price</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((c, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0">
                  <td className="py-1 pr-2">{formatMonth(c.month)}</td>
                  <td className="py-1 pr-2">{c.town}</td>
                  <td className="py-1 pr-2">{c.flat_type}</td>
                  <td className="py-1 pr-2">{c.storey_range}</td>
                  <td className="py-1 pr-2">{c.floor_area_sqm}</td>
                  <td className="py-1 pr-2">{formatCurrency(c.resale_price)}</td>
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
