import { useQuery } from '@tanstack/react-query';
import { fetchTrends } from '../api/trends.api';

export function useTrends(filters) {
  return useQuery({
    queryKey: ['trends', filters],
    queryFn: () => fetchTrends(filters),
    staleTime: 5 * 60 * 1000,
    enabled: filters.towns.length > 0,
  });
}
