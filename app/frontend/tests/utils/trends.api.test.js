import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../src/api/client';
import { fetchTrends } from '../../src/api/trends.api';

vi.mock('../../src/api/client', () => ({
  apiClient: { get: vi.fn() },
}));

describe('fetchTrends', () => {
  beforeEach(() => {
    apiClient.get.mockReset();
  });

  it('calls GET /trends with the given filters and returns the response data', async () => {
    const responseData = { kpis: {}, series: [] };
    apiClient.get.mockResolvedValue({ data: responseData });

    const result = await fetchTrends({
      towns: ['TAMPINES'],
      flatType: '4 ROOM',
    });

    expect(apiClient.get).toHaveBeenCalledWith('/trends', {
      params: {
        towns: 'TAMPINES',
        flatType: '4 ROOM',
      },
    });
    expect(result).toEqual(responseData);
  });

  it('omits filter params that are not provided', async () => {
    apiClient.get.mockResolvedValue({ data: {} });

    await fetchTrends({ towns: [] });

    expect(apiClient.get).toHaveBeenCalledWith('/trends', { params: {} });
  });

  it('joins multiple towns into a comma-separated string', async () => {
    apiClient.get.mockResolvedValue({ data: {} });

    await fetchTrends({ towns: ['TAMPINES', 'BEDOK'] });

    expect(apiClient.get).toHaveBeenCalledWith(
      '/trends',
      expect.objectContaining({ params: expect.objectContaining({ towns: 'TAMPINES,BEDOK' }) })
    );
  });
});
