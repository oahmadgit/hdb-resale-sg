import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PropertyExplorerPage from '../../src/pages/PropertyExplorerPage';
import { fetchAffordability } from '../../src/api/affordability.api';
import { fetchTrends } from '../../src/api/trends.api';
import { TOWNS } from '../../src/constants/towns';

vi.mock('../../src/api/affordability.api', () => ({
  fetchAffordability: vi.fn(),
}));
vi.mock('../../src/api/trends.api', () => ({
  fetchTrends: vi.fn(),
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <PropertyExplorerPage />
    </QueryClientProvider>
  );
}

describe('PropertyExplorerPage', () => {
  beforeEach(() => {
    fetchAffordability.mockReset();
    fetchTrends.mockReset();
    fetchTrends.mockResolvedValue({ kpis: {}, series: [] });
  });

  it('renders the filter form and charts on one page', () => {
    renderPage();
    expect(screen.getByLabelText(/flat type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });

  it('pre-selects the first town on load and fetches trends for it', async () => {
    renderPage();

    expect(await screen.findByText('Showing trends for:')).toBeInTheDocument();
    const trendsSection = screen.getByText('Showing trends for:').closest('div');
    expect(trendsSection).toHaveTextContent(TOWNS[0]);
    expect(fetchTrends).toHaveBeenCalledWith(
      expect.objectContaining({ towns: [TOWNS[0]] })
    );
  });

  it('selecting a town in the header dropdown also drives the trends section', async () => {
    fetchTrends.mockResolvedValue({
      kpis: { currentMedian: 500000, momChange: 0.01, yoyChange: 0.05, totalTransactions: 100 },
      series: [{ town: 'TAMPINES', data: [{ month: '2024-01', median: 500000, count: 100 }] }],
    });

    renderPage();

    await userEvent.click(screen.getByRole('button', { name: new RegExp(TOWNS[0], 'i') }));
    await userEvent.click(screen.getByRole('checkbox', { name: /tampines/i }));

    const trendsSection = screen.getByText('Showing trends for:').closest('div');
    expect(await within(trendsSection).findByText('TAMPINES')).toBeInTheDocument();
    expect(fetchTrends).toHaveBeenCalledWith(
      expect.objectContaining({ towns: expect.arrayContaining(['TAMPINES']) })
    );
  });

  it('calculating affordability renders the result within the same page', async () => {
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

    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(await screen.findByText('Mortgage breakdown')).toBeInTheDocument();
  });
});
