import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import TownSelect from '../../src/components/layout/TownSelect';

describe('TownSelect', () => {
  it('shows a placeholder when no towns are selected', () => {
    render(<TownSelect value={[]} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /select town/i })).toBeInTheDocument();
  });

  it('shows the selected town name when one town is selected', () => {
    render(<TownSelect value={['TAMPINES']} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /tampines/i })).toBeInTheDocument();
  });

  it('shows a count when multiple towns are selected', () => {
    render(<TownSelect value={['TAMPINES', 'BEDOK']} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /2 towns/i })).toBeInTheDocument();
  });

  it('opens the listbox and toggles a town on click', async () => {
    const onChange = vi.fn();
    render(<TownSelect value={[]} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('checkbox', { name: /tampines/i }));

    expect(onChange).toHaveBeenCalledWith(['TAMPINES']);
  });

  it('deselects an already-selected town on click', async () => {
    const onChange = vi.fn();
    render(<TownSelect value={['TAMPINES']} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('checkbox', { name: /tampines/i }));

    expect(onChange).toHaveBeenCalledWith([]);
  });
});
