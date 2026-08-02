import Card from '../ui/Card';
import { formatCurrency, formatPercent } from '../../utils/formatters';

function Row({ label, value, emphasis = false }) {
  return (
    <div className="flex items-baseline justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm ${emphasis ? 'text-base font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
        {value}
      </span>
    </div>
  );
}

function MortgageBreakdown({
  medianPrice,
  downpaymentRequired,
  loanAmount,
  monthlyMortgage,
  mortgageToIncomeRatio,
}) {
  return (
    <Card>
      <h3 className="mb-1 text-lg font-bold text-slate-900">Mortgage breakdown</h3>
      <Row label="Average comparable price" value={formatCurrency(medianPrice)} />
      <Row label="Downpayment required" value={formatCurrency(downpaymentRequired)} />
      <Row label="Loan amount" value={formatCurrency(loanAmount)} />
      <Row label="Monthly mortgage" value={formatCurrency(monthlyMortgage)} emphasis />
      <Row label="Mortgage-to-income ratio" value={formatPercent(mortgageToIncomeRatio)} />
    </Card>
  );
}

export default MortgageBreakdown;
