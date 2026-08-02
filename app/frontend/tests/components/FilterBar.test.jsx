import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import FilterBar from '../../src/components/trends/FilterBar';

const defaultFilters = {
  towns: [],
  flatType: '',
  from: '',
  to: '',
  storeyRange: '',
};

describe('FilterBar', () => {
  it('renders town, flat type, date range, and storey range controls', () => {
    render(<FilterBar filters={defaultFilters} onChange={() => {}} />);

    expect(screen.getByLabelText(/town/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/flat type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^to$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/storey range/i)).toBeInTheDocument();
  });

  it('calls onChange with updated towns when the town selection changes', async () => {
    const onChange = vi.fn();
    render(<FilterBar filters={defaultFilters} onChange={onChange} />);

    await userEvent.selectOptions(screen.getByLabelText(/town/i), ['TAMPINES']);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ towns: ['TAMPINES'] }));
  });

  it('calls onChange with the updated flat type', async () => {
    const onChange = vi.fn();
    render(<FilterBar filters={defaultFilters} onChange={onChange} />);

    await userEvent.selectOptions(screen.getByLabelText(/flat type/i), '4 ROOM');

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ flatType: '4 ROOM' }));
  });

  it('calls onChange with the updated from/to date range', async () => {
    const onChange = vi.fn();
    render(<FilterBar filters={defaultFilters} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText(/from/i), '2020-01');

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ from: '2020-01' }));
  });
});
