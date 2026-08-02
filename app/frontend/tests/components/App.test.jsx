import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';

import App from '../../src/App';

function renderAt(path) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('App routing', () => {
  it('redirects / to /affordability', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: /affordability calculator/i })).toBeInTheDocument();
  });

  it('renders the affordability page at /affordability', () => {
    renderAt('/affordability');
    expect(screen.getByRole('heading', { name: /affordability calculator/i })).toBeInTheDocument();
  });

  it('renders the trends page at /trends', () => {
    renderAt('/trends');
    expect(screen.getByRole('heading', { name: /market trend dashboard/i })).toBeInTheDocument();
  });

  it('renders the 404 page for an unknown route', () => {
    renderAt('/does-not-exist');
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
