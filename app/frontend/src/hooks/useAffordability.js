import { useMutation } from '@tanstack/react-query';
import { fetchAffordability } from '../api/affordability.api';

export function useAffordability() {
  const mutation = useMutation({ mutationFn: fetchAffordability });

  return {
    calculate: mutation.mutate,
    data: mutation.data,
    error: mutation.error,
    isIdle: mutation.isIdle,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
