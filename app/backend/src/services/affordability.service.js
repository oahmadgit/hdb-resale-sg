const { median } = require('../utils/math');
const { computePSM } = require('./aggregation.service');

const GRANT_BRACKETS = [
  { maxIncome: 1500, grantAmount: 80000 },
  { maxIncome: 2000, grantAmount: 75000 },
  { maxIncome: 2500, grantAmount: 70000 },
  { maxIncome: 3000, grantAmount: 65000 },
  { maxIncome: 3500, grantAmount: 60000 },
  { maxIncome: 4000, grantAmount: 55000 },
  { maxIncome: 4500, grantAmount: 50000 },
  { maxIncome: 5000, grantAmount: 45000 },
  { maxIncome: 5500, grantAmount: 40000 },
  { maxIncome: 6000, grantAmount: 35000 },
  { maxIncome: 6500, grantAmount: 30000 },
  { maxIncome: 7000, grantAmount: 25000 },
  { maxIncome: 7500, grantAmount: 20000 },
  { maxIncome: 8000, grantAmount: 15000 },
  { maxIncome: 8500, grantAmount: 10000 },
  { maxIncome: 9000, grantAmount: 5000 },
];

const BORDERLINE_RATIO = 0.3;
const UNAFFORDABLE_RATIO = 0.45;
const DOWNPAYMENT_RATIO = 0.2;
const MAX_COMPARABLES = 20;

function calculateMonthlyMortgage({ principal, annualRate, tenureYears }) {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
}

function getGrantEligibility(monthlyIncome) {
  const bracket = GRANT_BRACKETS.find((b) => monthlyIncome <= b.maxIncome);
  return bracket
    ? { eligible: true, grantAmount: bracket.grantAmount }
    : { eligible: false, grantAmount: 0 };
}

function getVerdict(mortgageToIncomeRatio) {
  if (mortgageToIncomeRatio <= BORDERLINE_RATIO) return 'affordable';
  if (mortgageToIncomeRatio <= UNAFFORDABLE_RATIO) return 'borderline';
  return 'unaffordable';
}

function createAffordabilityService({ resaleService }) {
  async function calculate({ income, savings, towns, flatType, tenure = 25, rate = 2.6 }) {
    const records = await resaleService.fetchAllRecords({
      town: towns,
      flat_type: flatType,
    });

    const prices = records.map((r) => r.resale_price);
    const medianPrice = median(prices) ?? 0;

    const minDownpayment = medianPrice * DOWNPAYMENT_RATIO;
    const downpaymentRequired = Math.min(Math.max(minDownpayment, savings), medianPrice);
    const loanAmount = medianPrice - downpaymentRequired;
    const monthlyMortgage = calculateMonthlyMortgage({
      principal: loanAmount,
      annualRate: rate,
      tenureYears: tenure,
    });
    const mortgageToIncomeRatio = income > 0 ? monthlyMortgage / income : Infinity;

    const grantEligibility = getGrantEligibility(income);
    const effectiveLoanAmount = grantEligibility.eligible
      ? Math.max(loanAmount - grantEligibility.grantAmount, 0)
      : loanAmount;

    const comparables = computePSM(records)
      .sort((a, b) => (a.month < b.month ? 1 : -1))
      .slice(0, MAX_COMPARABLES);

    return {
      verdict: getVerdict(mortgageToIncomeRatio),
      medianPrice,
      downpaymentRequired,
      loanAmount,
      monthlyMortgage,
      mortgageToIncomeRatio,
      grantEligibility: {
        ...grantEligibility,
        effectiveLoanAmount,
      },
      comparables,
    };
  }

  return { calculate };
}

module.exports = {
  createAffordabilityService,
  calculateMonthlyMortgage,
  getGrantEligibility,
  getVerdict,
  GRANT_BRACKETS,
};
