import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Retry failed requests
      retry: 1,
      // Cache time (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Garbage collection time (10 minutes)
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      // Retry failed mutations
      retry: false,
    },
  },
});