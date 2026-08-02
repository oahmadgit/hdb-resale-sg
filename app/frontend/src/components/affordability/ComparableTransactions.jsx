import Card from '../ui/Card';
import { formatCurrency, formatMonth } from '../../utils/formatters';

function ComparableTransactions({ comparables }) {
  return (
    <Card className="flex max-h-[36rem] flex-col overflow-hidden p-0">
      <h3 className="px-5 pb-1 pt-5 text-lg font-bold text-slate-900 dark:text-slate-50">
        Comparable transactions
      </h3>
      {comparables.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-slate-500 dark:text-slate-400">
          No comparable transactions found.
        </p>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto px-5 pb-5">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900">
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:text-slate-500">
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
                <tr
                  key={index}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
                >
                  <td className="py-2 pr-3 text-slate-500 dark:text-slate-400">
                    {formatMonth(c.month)}
                  </td>
                  <td className="py-2 pr-3 font-medium text-slate-800 dark:text-slate-200">
                    {c.town}
                  </td>
                  <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">{c.flat_type}</td>
                  <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">{c.storey_range}</td>
                  <td className="py-2 pr-3 text-slate-600 dark:text-slate-400">
                    {c.floor_area_sqm}
                  </td>
                  <td className="py-2 pr-3 font-semibold text-slate-900 dark:text-slate-50">
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
