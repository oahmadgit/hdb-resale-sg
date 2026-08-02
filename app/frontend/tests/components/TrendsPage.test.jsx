import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import TrendsPage from '../../src/pages/TrendsPage';
import { fetchTrends } from '../../src/api/trends.api';

vi.mock('../../src/api/trends.api', () => ({
  fetchTrends: vi.fn(),
}));

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TrendsPage />
    </QueryClientProvider>
  );
}

describe('TrendsPage', () => {
  beforeEach(() => {
    fetchTrends.mockReset();
  });

  it('renders the filter bar and a prompt before any town is selected', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: /market trend dashboard/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/town/i)).toBeInTheDocument();
    expect(screen.getByText(/select at least one town/i)).toBeInTheDocument();
    expect(fetchTrends).not.toHaveBeenCalled();
  });

  it('fetches and renders KPIs and charts once a town is selected', async () => {
    fetchTrends.mockResolvedValue({
      kpis: { currentMedian: 500000, momChange: 0.01, yoyChange: 0.05, totalTransactions: 100 },
      series: [{ town: 'TAMPINES', data: [{ month: '2024-01', median: 500000, count: 100 }] }],
    });

    renderPage();

    await userEvent.selectOptions(screen.getByLabelText(/town/i), ['TAMPINES']);

    expect(await screen.findByText('Current median')).toBeInTheDocument();
    expect(screen.getByText('Median price trend')).toBeInTheDocument();
    expect(screen.getByText(/transaction volume/i)).toBeInTheDocument();
  });
});
