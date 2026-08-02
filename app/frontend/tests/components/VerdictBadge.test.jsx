import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import VerdictBadge from '../../src/components/affordability/VerdictBadge';

describe('VerdictBadge', () => {
  it('renders a green/success badge for "affordable"', () => {
    render(<VerdictBadge verdict="affordable" />);
    const badge = screen.getByText(/affordable/i);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toMatch(/green/);
  });

  it('renders an amber/warning badge for "borderline"', () => {
    render(<VerdictBadge verdict="borderline" />);
    const badge = screen.getByText(/borderline/i);
    expect(badge.className).toMatch(/amber/);
  });

  it('renders a red/danger badge for "unaffordable"', () => {
    render(<VerdictBadge verdict="unaffordable" />);
    const badge = screen.getByText(/unaffordable/i);
    expect(badge.className).toMatch(/red/);
  });
});
