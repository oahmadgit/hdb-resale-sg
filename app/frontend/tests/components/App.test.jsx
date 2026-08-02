import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';

import App from '../../src/App';
import { fetchTrends } from '../../src/api/trends.api';

vi.mock('../../src/api/affordability.api', () => ({
  fetchAffordability: vi.fn(),
}));
vi.mock('../../src/api/trends.api', () => ({
  fetchTrends: vi.fn(),
}));

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
  it('renders the unified explorer page at /', () => {
    fetchTrends.mockResolvedValue({ kpis: {}, series: [] });
    renderAt('/');
    expect(screen.getByLabelText(/flat type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
  });

  it('renders the 404 page for an unknown route', () => {
    renderAt('/does-not-exist');
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
