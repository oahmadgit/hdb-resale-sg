import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import MortgageBreakdown from '../../src/components/affordability/MortgageBreakdown';

const result = {
  medianPrice: 520000,
  downpaymentRequired: 104000,
  loanAmount: 416000,
  monthlyMortgage: 1887.27,
  mortgageToIncomeRatio: 0.27,
};

describe('MortgageBreakdown', () => {
  it('renders the median price, downpayment, loan amount, and monthly mortgage', () => {
    render(<MortgageBreakdown {...result} />);

    expect(screen.getByText('$520,000')).toBeInTheDocument();
    expect(screen.getByText('$104,000')).toBeInTheDocument();
    expect(screen.getByText('$416,000')).toBeInTheDocument();
    expect(screen.getByText('$1,887')).toBeInTheDocument();
  });

  it('renders the mortgage-to-income ratio as a percentage', () => {
    render(<MortgageBreakdown {...result} />);
    expect(screen.getByText('27.0%')).toBeInTheDocument();
  });
});
