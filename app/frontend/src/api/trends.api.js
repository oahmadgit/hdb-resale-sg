import { apiClient } from './client';

export async function fetchTrends({ towns = [], flatType } = {}) {
  const params = {
    ...(towns.length > 0 && { towns: towns.join(',') }),
    ...(flatType && { flatType }),
  };

  const response = await apiClient.get('/trends', { params });
  return response.data;
}
