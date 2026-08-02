import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import NotFoundPage from '../../src/pages/NotFoundPage';

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('NotFoundPage', () => {
  it('renders a 404 message', () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it('renders a link back to the home page', () => {
    renderWithRouter(<NotFoundPage />);
    const link = screen.getByRole('link', { name: /back to hdb resale explorer/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
