import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ComparableTransactions from '../../src/components/affordability/ComparableTransactions';

const comparables = [
  {
    month: '2024-03',
    town: 'TAMPINES',
    flat_type: '4 ROOM',
    storey_range: '07 TO 09',
    floor_area_sqm: 93,
    resale_price: 515000,
    psm: 5538,
  },
];

describe('ComparableTransactions', () => {
  it('renders a table row per comparable transaction', () => {
    render(<ComparableTransactions comparables={comparables} />);

    expect(screen.getByText('TAMPINES')).toBeInTheDocument();
    expect(screen.getByText('4 ROOM')).toBeInTheDocument();
    expect(screen.getByText('Mar 2024')).toBeInTheDocument();
    expect(screen.getByText('$515,000')).toBeInTheDocument();
  });

  it('shows an empty state when there are no comparables', () => {
    render(<ComparableTransactions comparables={[]} />);
    expect(screen.getByText(/no comparable transactions/i)).toBeInTheDocument();
  });
});
