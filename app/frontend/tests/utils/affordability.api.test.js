import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../src/api/client';
import { fetchAffordability } from '../../src/api/affordability.api';

vi.mock('../../src/api/client', () => ({
  apiClient: { get: vi.fn() },
}));

describe('fetchAffordability', () => {
  beforeEach(() => {
    apiClient.get.mockReset();
  });

  it('calls GET /affordability with the given params and returns the response data', async () => {
    const responseData = { verdict: 'affordable' };
    apiClient.get.mockResolvedValue({ data: responseData });

    const result = await fetchAffordability({
      income: 7000,
      savings: 100000,
      towns: ['TAMPINES'],
      flatType: '4 ROOM',
      tenure: 25,
      rate: 2.6,
    });

    expect(apiClient.get).toHaveBeenCalledWith('/affordability', {
      params: {
        income: 7000,
        savings: 100000,
        towns: 'TAMPINES',
        flatType: '4 ROOM',
        tenure: 25,
        rate: 2.6,
      },
    });
    expect(result).toEqual(responseData);
  });

  it('joins multiple towns into a comma-separated string', async () => {
    apiClient.get.mockResolvedValue({ data: {} });

    await fetchAffordability({
      income: 7000,
      savings: 0,
      towns: ['TAMPINES', 'BEDOK'],
      flatType: '3 ROOM',
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      '/affordability',
      expect.objectContaining({ params: expect.objectContaining({ towns: 'TAMPINES,BEDOK' }) })
    );
  });
});
