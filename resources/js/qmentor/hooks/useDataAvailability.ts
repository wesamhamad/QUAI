import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

interface UseDataAvailabilityOptions {
  endpoint: string;
  queryKey: string[];
  enabled?: boolean;
}

export function useDataAvailability({ endpoint, queryKey, enabled = true }: UseDataAvailabilityOptions) {
  const query = useQuery({
    queryKey,
    queryFn: () => apiClient.get(endpoint),
    enabled,
    retry: false,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isAvailable: query.isSuccess && query.data != null,
    showComingSoon: !query.isLoading && (!query.isSuccess || query.data == null),
    error: query.error,
    refetch: query.refetch,
  };
}
