import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import GrantEligibility from '../../src/components/affordability/GrantEligibility';

describe('GrantEligibility', () => {
  it('shows the grant amount and effective loan amount when eligible', () => {
    render(
      <GrantEligibility eligible grantAmount={25000} effectiveLoanAmount={391000} />
    );

    expect(screen.getByText(/eligible/i)).toBeInTheDocument();
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('$391,000')).toBeInTheDocument();
  });

  it('shows a not-eligible message and does not show a grant amount when ineligible', () => {
    render(<GrantEligibility eligible={false} grantAmount={0} effectiveLoanAmount={416000} />);

    expect(screen.getByText(/not eligible/i)).toBeInTheDocument();
    expect(screen.queryByText('$0')).not.toBeInTheDocument();
  });
});
