import { apiClient } from './client';

export async function fetchAffordability({ income, savings, towns, flatType, tenure, rate }) {
  const params = {
    income,
    savings,
    towns: towns.join(','),
    flatType,
    ...(tenure !== undefined && { tenure }),
    ...(rate !== undefined && { rate }),
  };

  const response = await apiClient.get('/affordability', { params });
  return response.data;
}
