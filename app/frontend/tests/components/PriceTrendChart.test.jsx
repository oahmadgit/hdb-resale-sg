import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import PriceTrendChart, { mergeSeriesByMonth } from '../../src/components/trends/PriceTrendChart';

const series = [
  {
    town: 'TAMPINES',
    data: [
      { month: '2023-01', median: 500000, count: 40 },
      { month: '2023-02', median: 510000, count: 38 },
    ],
  },
  {
    town: 'BEDOK',
    data: [
      { month: '2023-01', median: 460000, count: 30 },
      { month: '2023-02', median: 465000, count: 32 },
    ],
  },
];

describe('mergeSeriesByMonth', () => {
  it('merges per-town series into one row per month, keyed by town name', () => {
    expect(mergeSeriesByMonth(series)).toEqual([
      { month: '2023-01', TAMPINES: 500000, BEDOK: 460000 },
      { month: '2023-02', TAMPINES: 510000, BEDOK: 465000 },
    ]);
  });

  it('sorts merged rows ascending by month', () => {
    const unordered = [
      { town: 'TAMPINES', data: [{ month: '2023-02', median: 510000, count: 1 }] },
    ];
    unordered[0].data.unshift({ month: '2023-01', median: 500000, count: 1 });
    const shuffled = [
      { town: 'TAMPINES', data: [unordered[0].data[1], unordered[0].data[0]] },
    ];
    expect(mergeSeriesByMonth(shuffled).map((r) => r.month)).toEqual(['2023-01', '2023-02']);
  });

  it('handles towns with different month coverage without crashing', () => {
    const partial = [
      { town: 'TAMPINES', data: [{ month: '2023-01', median: 500000, count: 1 }] },
      { town: 'BEDOK', data: [{ month: '2023-02', median: 460000, count: 1 }] },
    ];
    expect(mergeSeriesByMonth(partial)).toEqual([
      { month: '2023-01', TAMPINES: 500000 },
      { month: '2023-02', BEDOK: 460000 },
    ]);
  });
});

describe('PriceTrendChart', () => {
  it('renders without crashing and includes the chart title', () => {
    render(<PriceTrendChart series={series} />);
    expect(screen.getByText('Median price trend')).toBeInTheDocument();
  });

  it('shows an empty state when the series is empty', () => {
    render(<PriceTrendChart series={[]} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
