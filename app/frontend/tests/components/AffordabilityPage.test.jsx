import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AffordabilityPage from '../../src/pages/AffordabilityPage';
import { fetchAffordability } from '../../src/api/affordability.api';

vi.mock('../../src/api/affordability.api', () => ({
  fetchAffordability: vi.fn(),
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AffordabilityPage />
    </QueryClientProvider>
  );
}

describe('AffordabilityPage', () => {
  beforeEach(() => {
    fetchAffordability.mockReset();
  });

  it('renders the form and no result initially', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /affordability calculator/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/town/i)).toBeInTheDocument();
    expect(screen.queryByText('Mortgage breakdown')).not.toBeInTheDocument();
  });

  it('renders the result after a successful calculation', async () => {
    fetchAffordability.mockResolvedValue({
      verdict: 'affordable',
      medianPrice: 520000,
      downpaymentRequired: 104000,
      loanAmount: 416000,
      monthlyMortgage: 1887,
      mortgageToIncomeRatio: 0.27,
      grantEligibility: { eligible: true, grantAmount: 25000, effectiveLoanAmount: 391000 },
      comparables: [],
    });

    renderPage();

    await userEvent.selectOptions(screen.getByLabelText(/town/i), ['TAMPINES']);
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(await screen.findByText('Mortgage breakdown')).toBeInTheDocument();
    expect(screen.getByText(/^affordable$/i)).toBeInTheDocument();
  });

  it('shows an error message when the calculation fails', async () => {
    fetchAffordability.mockRejectedValue(new Error('Request failed'));

    renderPage();

    await userEvent.selectOptions(screen.getByLabelText(/town/i), ['TAMPINES']);
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
