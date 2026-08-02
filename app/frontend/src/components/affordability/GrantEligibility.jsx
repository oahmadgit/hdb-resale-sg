import Card from '../ui/Card';
import { formatCurrency } from '../../utils/formatters';

function GrantEligibility({ eligible, grantAmount, effectiveLoanAmount }) {
  return (
    <Card>
      <h3 className="mb-2 font-semibold text-slate-900">HDB grant eligibility (estimate)</h3>
      {eligible ? (
        <>
          <p className="text-sm text-slate-600">
            You are estimated to be <span className="font-medium text-green-700">eligible</span>{' '}
            for the Enhanced CPF Housing Grant.
          </p>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-sm">
            <span className="text-slate-600">Grant amount</span>
            <span className="font-medium text-slate-900">{formatCurrency(grantAmount)}</span>
          </div>
          <div className="flex justify-between pt-1 text-sm">
            <span className="text-slate-600">Effective loan amount</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(effectiveLoanAmount)}
            </span>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-600">
          Based on your income, you are estimated to be{' '}
          <span className="font-medium text-red-700">not eligible</span> for the Enhanced CPF
          Housing Grant.
        </p>
      )}
      <p className="mt-2 text-xs text-slate-400">
        Estimate only — does not account for citizenship or first-timer eligibility criteria.
      </p>
    </Card>
  );
}

export default GrantEligibility;
