import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import AffordabilityForm from '../../src/components/affordability/AffordabilityForm';

describe('AffordabilityForm', () => {
  it('renders all form fields', () => {
    render(<AffordabilityForm onSubmit={() => {}} />);

    expect(screen.getByLabelText(/monthly household income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/savings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/town/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/flat type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/loan tenure/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });

  it('shows a validation error when submitting without selecting a town', async () => {
    const onSubmit = vi.fn();
    render(<AffordabilityForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(await screen.findByText(/select at least one town/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('allows selecting multiple towns', async () => {
    render(<AffordabilityForm onSubmit={() => {}} />);

    const townSelect = screen.getByLabelText(/town/i);
    await userEvent.selectOptions(townSelect, ['TAMPINES', 'BEDOK']);

    const selected = Array.from(townSelect.selectedOptions).map((o) => o.value);
    expect(selected.sort()).toEqual(['BEDOK', 'TAMPINES']);
  });

  it('submits with correct params when the form is valid', async () => {
    const onSubmit = vi.fn();
    render(<AffordabilityForm onSubmit={onSubmit} />);

    await userEvent.selectOptions(screen.getByLabelText(/town/i), ['TAMPINES']);
    await userEvent.selectOptions(screen.getByLabelText(/flat type/i), '4 ROOM');
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(await screen.findByRole('button', { name: /calculate/i })).toBeEnabled();
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
    render(<AffordabilityForm onSubmit={() => {}} isPending />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
