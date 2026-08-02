import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import KpiCards from '../../src/components/trends/KpiCards';

const kpis = {
  currentMedian: 548000,
  momChange: -0.021,
  yoyChange: 0.087,
  totalTransactions: 2841,
};

describe('KpiCards', () => {
  it('renders four cards with correct labels', () => {
    render(<KpiCards kpis={kpis} />);

    expect(screen.getByText(/current median/i)).toBeInTheDocument();
    expect(screen.getByText(/month-on-month/i)).toBeInTheDocument();
    expect(screen.getByText(/year-on-year/i)).toBeInTheDocument();
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });

  it('shows a positive YoY change with a green badge', () => {
    render(<KpiCards kpis={kpis} />);
    const yoy = screen.getByTestId('kpi-yoy-change');
    expect(yoy).toHaveTextContent('8.7%');
    expect(yoy.className).toMatch(/green/);
  });

  it('shows a negative MoM change with a red badge', () => {
    render(<KpiCards kpis={kpis} />);
    const mom = screen.getByTestId('kpi-mom-change');
    expect(mom).toHaveTextContent('-2.1%');
    expect(mom.className).toMatch(/red/);
  });

  it('renders skeleton cards in the loading state', () => {
    render(<KpiCards isLoading />);
    expect(screen.getAllByTestId('kpi-skeleton')).toHaveLength(4);
  });

  it('renders placeholders when momChange/yoyChange are null', () => {
    render(
      <KpiCards
        kpis={{ currentMedian: 500000, momChange: null, yoyChange: null, totalTransactions: 10 }}
      />
    );
    expect(screen.getByTestId('kpi-mom-change')).toHaveTextContent('—');
    expect(screen.getByTestId('kpi-yoy-change')).toHaveTextContent('—');
  });

  it('does not crash when kpis is an incomplete/empty object', () => {
    render(<KpiCards kpis={{}} />);
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });
});
