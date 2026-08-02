import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAffordability } from '../../src/hooks/useAffordability';
import { fetchAffordability } from '../../src/api/affordability.api';

vi.mock('../../src/api/affordability.api', () => ({
  fetchAffordability: vi.fn(),
}));

function wrapper({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useAffordability', () => {
  beforeEach(() => {
    fetchAffordability.mockReset();
  });

  it('starts idle with no data', () => {
    const { result } = renderHook(() => useAffordability(), { wrapper });
    expect(result.current.isIdle).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('calls fetchAffordability and exposes the result on calculate()', async () => {
    const responseData = { verdict: 'affordable', medianPrice: 500000 };
    fetchAffordability.mockResolvedValue(responseData);

    const { result } = renderHook(() => useAffordability(), { wrapper });

    act(() => {
      result.current.calculate({
        income: 7000,
        savings: 100000,
        towns: ['TAMPINES'],
        flatType: '4 ROOM',
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(responseData);
  });

  it('exposes an error state when the API call fails', async () => {
    fetchAffordability.mockRejectedValue(new Error('upstream error'));

    const { result } = renderHook(() => useAffordability(), { wrapper });

    act(() => {
      result.current.calculate({
        income: 7000,
        savings: 0,
        towns: ['TAMPINES'],
        flatType: '4 ROOM',
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('exposes isPending while the request is in flight', async () => {
    let resolvePromise;
    fetchAffordability.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { result } = renderHook(() => useAffordability(), { wrapper });

    act(() => {
      result.current.calculate({
        income: 7000,
        savings: 0,
        towns: ['TAMPINES'],
        flatType: '4 ROOM',
      });
    });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    act(() => {
      resolvePromise({ verdict: 'affordable' });
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });
});
