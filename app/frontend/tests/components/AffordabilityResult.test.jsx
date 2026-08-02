import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import AffordabilityResult from '../../src/components/affordability/AffordabilityResult';

const result = {
  verdict: 'affordable',
  medianPrice: 520000,
  downpaymentRequired: 104000,
  loanAmount: 416000,
  monthlyMortgage: 1887,
  mortgageToIncomeRatio: 0.27,
  grantEligibility: {
    eligible: true,
    grantAmount: 25000,
    effectiveLoanAmount: 391000,
  },
  comparables: [
    {
      month: '2024-03',
      town: 'TAMPINES',
      flat_type: '4 ROOM',
      storey_range: '07 TO 09',
      floor_area_sqm: 93,
      resale_price: 515000,
      psm: 5538,
    },
  ],
};

describe('AffordabilityResult', () => {
  it('renders the verdict badge, mortgage breakdown, grant eligibility, and comparables', () => {
    render(<AffordabilityResult result={result} />);

    expect(screen.getByText(/^affordable$/i)).toBeInTheDocument();
    expect(screen.getByText('Mortgage breakdown')).toBeInTheDocument();
    expect(screen.getByText('HDB grant eligibility (estimate)')).toBeInTheDocument();
    expect(screen.getByText('Comparable transactions')).toBeInTheDocument();
    expect(screen.getByText('TAMPINES')).toBeInTheDocument();
  });
});
