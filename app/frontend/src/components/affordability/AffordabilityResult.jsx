import VerdictBadge from './VerdictBadge';
import MortgageBreakdown from './MortgageBreakdown';
import GrantEligibility from './GrantEligibility';
import ComparableTransactions from './ComparableTransactions';

function AffordabilityResult({ result }) {
  const {
    verdict,
    medianPrice,
    downpaymentRequired,
    loanAmount,
    monthlyMortgage,
    mortgageToIncomeRatio,
    grantEligibility,
    comparables,
  } = result;

  return (
    <div className="flex flex-col gap-4">
      <VerdictBadge verdict={verdict} />
      <MortgageBreakdown
        medianPrice={medianPrice}
        downpaymentRequired={downpaymentRequired}
        loanAmount={loanAmount}
        monthlyMortgage={monthlyMortgage}
        mortgageToIncomeRatio={mortgageToIncomeRatio}
      />
      <GrantEligibility
        eligible={grantEligibility.eligible}
        grantAmount={grantEligibility.grantAmount}
        effectiveLoanAmount={grantEligibility.effectiveLoanAmount}
      />
      <ComparableTransactions comparables={comparables} />
    </div>
  );
}

export default AffordabilityResult;
