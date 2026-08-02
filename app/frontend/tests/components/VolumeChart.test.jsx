import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import VolumeChart, { aggregateVolumeByMonth } from '../../src/components/trends/VolumeChart';

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

describe('aggregateVolumeByMonth', () => {
  it('sums transaction counts across towns for each month', () => {
    expect(aggregateVolumeByMonth(series)).toEqual([
      { month: '2023-01', count: 70 },
      { month: '2023-02', count: 70 },
    ]);
  });

  it('returns an empty array for an empty series', () => {
    expect(aggregateVolumeByMonth([])).toEqual([]);
  });
});

describe('VolumeChart', () => {
  it('renders without crashing and includes the chart title', () => {
    render(<VolumeChart series={series} />);
    expect(screen.getByText(/transaction volume/i)).toBeInTheDocument();
  });

  it('shows an empty state when the series is empty', () => {
    render(<VolumeChart series={[]} />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it('shows the total transaction count', () => {
    render(<VolumeChart series={series} />);
    expect(screen.getByText('140 total')).toBeInTheDocument();
  });

  it('defaults the headline figure to the most recent month', () => {
    render(<VolumeChart series={series} />);
    const headline = screen.getByText('70').closest('div');
    expect(within(headline).getByText('Feb 2023')).toBeInTheDocument();
  });

  it('updates the headline figure when hovering a different bar', async () => {
    render(<VolumeChart series={series} />);

    const bars = screen.getByRole('img', { name: /monthly transaction volume/i }).children;
    await userEvent.hover(bars[0]);

    const headline = screen.getByText('70').closest('div');
    expect(within(headline).getByText('Jan 2023')).toBeInTheDocument();
  });
});
