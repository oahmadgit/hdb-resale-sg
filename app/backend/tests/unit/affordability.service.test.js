const {
  calculateMonthlyMortgage,
  getGrantEligibility,
  getVerdict,
} = require('../../src/services/affordability.service');

describe('calculateMonthlyMortgage', () => {
  it('computes the monthly payment using the standard annuity formula', () => {
    const payment = calculateMonthlyMortgage({
      principal: 416000,
      annualRate: 2.6,
      tenureYears: 25,
    });
    expect(payment).toBeCloseTo(1887.27, 1);
  });

  it('matches a known ground-truth value from a mortgage calculator', () => {
    // $300,000 principal, 4% annual rate, 30-year term -> ~$1432.25/mo
    const payment = calculateMonthlyMortgage({
      principal: 300000,
      annualRate: 4,
      tenureYears: 30,
    });
    expect(payment).toBeCloseTo(1432.25, 1);
  });

  it('divides principal evenly across months when rate is 0', () => {
    const payment = calculateMonthlyMortgage({ principal: 120000, annualRate: 0, tenureYears: 10 });
    expect(payment).toBe(1000);
  });
});

describe('getGrantEligibility', () => {
  it.each([
    [1500, 80000],
    [1501, 75000],
    [2500, 70000],
    [3000, 65000],
    [3500, 60000],
    [4000, 55000],
    [4500, 50000],
    [5000, 45000],
    [5500, 40000],
    [6000, 35000],
    [6500, 30000],
    [7000, 25000],
    [7500, 20000],
    [8000, 15000],
    [8500, 10000],
    [9000, 5000],
  ])('income %i -> grant %i', (income, expectedGrant) => {
    const result = getGrantEligibility(income);
    expect(result.eligible).toBe(true);
    expect(result.grantAmount).toBe(expectedGrant);
  });

  it('is not eligible above 9000', () => {
    const result = getGrantEligibility(9001);
    expect(result.eligible).toBe(false);
    expect(result.grantAmount).toBe(0);
  });

  it('is eligible at the boundary of 9000', () => {
    expect(getGrantEligibility(9000).eligible).toBe(true);
  });
});

describe('getVerdict', () => {
  it('is affordable at or below 30% mortgage-to-income ratio', () => {
    expect(getVerdict(0.3)).toBe('affordable');
    expect(getVerdict(0.1)).toBe('affordable');
  });

  it('is borderline between 30% and 45%', () => {
    expect(getVerdict(0.337)).toBe('borderline');
    expect(getVerdict(0.45)).toBe('borderline');
  });

  it('is unaffordable above 45%', () => {
    expect(getVerdict(0.451)).toBe('unaffordable');
    expect(getVerdict(1)).toBe('unaffordable');
  });
});
