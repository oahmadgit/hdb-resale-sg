import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import FilterNav from '../../src/components/layout/FilterNav';

describe('FilterNav', () => {
  it('renders all filter fields and the Calculate button', () => {
    render(<FilterNav onSubmit={() => {}} selectedTowns={['TAMPINES']} />);

    expect(screen.getByLabelText(/flat type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/savings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tenure/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });

  it('shows a validation error when submitting without any selected towns', async () => {
    const onSubmit = vi.fn();
    render(<FilterNav onSubmit={onSubmit} selectedTowns={[]} />);

    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(await screen.findByText(/select at least one town/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits with correct params when the form is valid', async () => {
    const onSubmit = vi.fn();
    render(<FilterNav onSubmit={onSubmit} selectedTowns={['TAMPINES']} />);

    await userEvent.selectOptions(screen.getByLabelText(/flat type/i), '4 ROOM');
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        towns: ['TAMPINES'],
        flatType: '4 ROOM',
        income: expect.any(Number),
        savings: expect.any(Number),
        tenure: expect.any(Number),
      })
    );
  });

  it('disables the submit button while pending', () => {
    render(<FilterNav onSubmit={() => {}} isPending selectedTowns={['TAMPINES']} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
