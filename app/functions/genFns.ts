import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { serverUrl } from '../constants/urls';
import { GenType } from '../types/gen';

interface FetchGenerationsParams {
  characterId?: string;
  skip?: number;
  limit?: number;
}

// Environment-based API routing
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  return process.env.NEXT_PUBLIC_SERVER_URL || serverUrl;
};

const API_BASE_URL = getApiBaseUrl();

const fetchCharGenerations = async ({
  characterId,
  skip = 0,
  limit = 20
}: FetchGenerationsParams = {}): Promise<GenType[]> => {
  const params = new URLSearchParams();
  
  if (characterId) {
    params.append('character_id', characterId);
  }
  
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  
  // Route based on environment
  const endpoint = process.env.NODE_ENV === 'production' 
    ? '/generation' // Next.js API route
    : '/gen'; // FastAPI endpoint

  const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`
    }));
    throw new Error(errorData.detail || errorData.error || `HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

const deleteGeneration = async (generationId: string): Promise<void> => {
  // Route based on environment
  const endpoint = process.env.NODE_ENV === 'production' 
    ? `/generation/${generationId}` // Next.js API route
    : `/gen/${generationId}`; // FastAPI endpoint

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`
    }));
    throw new Error(errorData.detail || errorData.error || `Failed to delete generation`);
  }
};

// Enhanced hook with better performance for infinite loading
export const useGenerationsInfinite = (
  characterId?: string,
  enabled = true
) => {
  return useInfiniteQuery<GenType[], Error>({
    queryKey: ['generations', 'infinite', characterId, process.env.NODE_ENV],
    queryFn: ({ pageParam = 0 }) => fetchCharGenerations({
      characterId,
      skip: pageParam as number,
      limit: process.env.NODE_ENV === 'production' ? 30 : 20, // Larger batches in production
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      const limit = process.env.NODE_ENV === 'production' ? 30 : 20;
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
    enabled,
    staleTime: process.env.NODE_ENV === 'production' ? 2 * 60 * 1000 : 30 * 60 * 1000, // Shorter cache in prod
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Original hook with environment awareness
export const useGenerations = (
  { characterId, skip, limit }: FetchGenerationsParams = {}, 
  enabled = true
) => {
  return useQuery({
    queryKey: ['generations', { characterId, skip, limit }, process.env.NODE_ENV],
    queryFn: () => fetchCharGenerations({ characterId, skip, limit }),
    enabled,
    staleTime: process.env.NODE_ENV === 'production' ? 2 * 60 * 1000 : 30 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Enhanced delete mutation with optimistic updates
export const useDeleteGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGeneration,
    // Optimistic update for immediate UI feedback
    onMutate: async (generationId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['generations'] });

      // Snapshot previous value
      const previousGenerations = queryClient.getQueriesData({ queryKey: ['generations'] });

      // Optimistically update cache
      queryClient.setQueriesData(
        { queryKey: ['generations'] },
        (oldData: any) => {
          if (Array.isArray(oldData)) {
            return oldData.filter((gen: GenType) => gen._id !== generationId);
          }
          return oldData;
        }
      );

      // Update infinite queries
      queryClient.setQueriesData(
        { queryKey: ['generations', 'infinite'] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: GenType[]) =>
              page.filter((gen: GenType) => gen._id !== generationId)
            )
          };
        }
      );

      return { previousGenerations };
    },
    onError: (error, generationId, context) => {
      // Revert optimistic update on error
      if (context?.previousGenerations) {
        context.previousGenerations.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error('Error deleting generation:', error);
    },
    onSuccess: (_, generationId) => {
      queryClient.invalidateQueries({
        queryKey: ['generations'],
        refetchType: 'none' 
      });

      console.log(`Generation ${generationId} deleted successfully`);
    },
  });
};

// New hook for fetching a single generation
export const useGeneration = (generationId: string, enabled = true) => {
  return useQuery({
    queryKey: ['generation', generationId, process.env.NODE_ENV],
    queryFn: async () => {
      const endpoint = process.env.NODE_ENV === 'production' 
        ? `/generation/${generationId}` 
        : `/gen/${generationId}`; 

      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch generation: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: enabled && Boolean(generationId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// Utility function to prefetch generations
export const usePrefetchGenerations = () => {
  const queryClient = useQueryClient();

  return {
    prefetchByCharacter: (characterId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['generations', { characterId, skip: 0, limit: 20 }, process.env.NODE_ENV],
        queryFn: () => fetchCharGenerations({ characterId, skip: 0, limit: 20 }),
        staleTime: 2 * 60 * 1000,
      });
    },
    prefetchSingle: (generationId: string) => {
      queryClient.prefetchQuery({
        queryKey: ['generation', generationId, process.env.NODE_ENV],
        queryFn: async () => {
          const endpoint = process.env.NODE_ENV === 'production' 
            ? `/generation/${generationId}`
            : `/gen/${generationId}`;
          
          const response = await fetch(`${API_BASE_URL}${endpoint}`);
          return response.json();
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };
};

// Cache invalidation utility
export const useInvalidateGenerationCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ['generations'] });
    },
    invalidateByCharacter: (characterId: string) => {
      queryClient.invalidateQueries({ 
        queryKey: ['generations'],
        predicate: (query) => {
          const queryKey = query.queryKey;
          return queryKey.some((key: any) => 
            typeof key === 'object' && key?.characterId === characterId
          );
        }
      });
    },
    invalidateSingle: (generationId: string) => {
      queryClient.invalidateQueries({ queryKey: ['generation', generationId] });
    }
  };
};

// Export environment detection utility
export const isUsingDirectMongo = () => process.env.NODE_ENV === 'production';