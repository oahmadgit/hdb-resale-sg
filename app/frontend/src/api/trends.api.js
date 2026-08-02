import { apiClient } from './client';

export async function fetchTrends({ towns = [], flatType, from, to, storeyRange } = {}) {
  const params = {
    ...(towns.length > 0 && { towns: towns.join(',') }),
    ...(flatType && { flatType }),
    ...(from && { from }),
    ...(to && { to }),
    ...(storeyRange && { storeyRange }),
  };

  const response = await apiClient.get('/trends', { params });
  return response.data;
}
