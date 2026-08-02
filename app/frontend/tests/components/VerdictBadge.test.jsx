import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import VerdictBadge from '../../src/components/affordability/VerdictBadge';

describe('VerdictBadge', () => {
  it('renders a green/success banner with a catchy message for "affordable"', () => {
    render(<VerdictBadge verdict="affordable" />);
    expect(screen.getByText(/affordable/i)).toBeInTheDocument();
    expect(screen.getByTestId('verdict-banner').className).toMatch(/green/);
    expect(screen.getByText(/comfortably within your budget/i)).toBeInTheDocument();
  });

  it('renders an amber/warning banner with a catchy message for "borderline"', () => {
    render(<VerdictBadge verdict="borderline" />);
    expect(screen.getByText(/borderline/i)).toBeInTheDocument();
    expect(screen.getByTestId('verdict-banner').className).toMatch(/amber/);
    expect(screen.getByText(/stretch/i)).toBeInTheDocument();
  });

  it('renders a red/danger banner with a catchy message for "unaffordable"', () => {
    render(<VerdictBadge verdict="unaffordable" />);
    expect(screen.getByText(/unaffordable/i)).toBeInTheDocument();
    expect(screen.getByTestId('verdict-banner').className).toMatch(/red/);
    expect(screen.getByText(/out of reach/i)).toBeInTheDocument();
  });
});
