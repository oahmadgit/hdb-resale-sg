import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useTrends } from '../../src/hooks/useTrends';
import { fetchTrends } from '../../src/api/trends.api';

vi.mock('../../src/api/trends.api', () => ({
  fetchTrends: vi.fn(),
}));

function wrapper({ children }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useTrends', () => {
  beforeEach(() => {
    fetchTrends.mockReset();
  });

  it('does not fetch when no towns are selected', () => {
    renderHook(() => useTrends({ towns: [] }), { wrapper });
    expect(fetchTrends).not.toHaveBeenCalled();
  });

  it('fetches trends when at least one town is selected', async () => {
    const responseData = { kpis: {}, series: [] };
    fetchTrends.mockResolvedValue(responseData);

    const { result } = renderHook(() => useTrends({ towns: ['TAMPINES'] }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(responseData);
    expect(fetchTrends).toHaveBeenCalledWith({ towns: ['TAMPINES'] });
  });

  it('refetches when filters change', async () => {
    fetchTrends.mockResolvedValue({ kpis: {}, series: [] });

    const { result, rerender } = renderHook(({ filters }) => useTrends(filters), {
      wrapper,
      initialProps: { filters: { towns: ['TAMPINES'] } },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ filters: { towns: ['BEDOK'] } });

    await waitFor(() => expect(fetchTrends).toHaveBeenCalledWith({ towns: ['BEDOK'] }));
  });

  it('exposes an error state on failure', async () => {
    fetchTrends.mockRejectedValue(new Error('upstream error'));

    const { result } = renderHook(() => useTrends({ towns: ['TAMPINES'] }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
