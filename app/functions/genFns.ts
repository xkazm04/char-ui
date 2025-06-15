import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { serverUrl } from '../constants/urls';
import { GenType } from '../types/gen';

interface FetchGenerationsParams {
  characterId?: string;
  skip?: number;
  limit?: number;
}

// ✅ Improved environment detection
const getApiBaseUrl = () => {
  // Check multiple environment indicators
  const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_URL;
  const customEnv = process.env.NEXT_PUBLIC_APP_ENV;
  const nodeEnv = process.env.NODE_ENV;
  
  // Browser-based detection
  let isBrowserProduction = false;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    isBrowserProduction = !hostname.includes('localhost') && !hostname.includes('127.0.0.1');
  }
  
  // Use Next.js API if any production indicator is true
  const shouldUseNextAPI = customEnv === 'production' || 
                          isVercel || 
                          isBrowserProduction || 
                          nodeEnv === 'production';
  
  console.log(`🔍 Environment detection:`, {
    customEnv,
    nodeEnv,
    isVercel,
    isBrowserProduction,
    shouldUseNextAPI
  });
  
  if (shouldUseNextAPI) {
    return '/api';
  }
  
  return process.env.NEXT_PUBLIC_SERVER_URL || serverUrl;
};

const API_BASE_URL = getApiBaseUrl() || 'http://localhost:8000';

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
  
  // ✅ Determine endpoint based on current API base
  const isUsingNextAPI = API_BASE_URL.startsWith('/api');
  const endpoint = isUsingNextAPI ? '/generation' : '/gen';

  const url = `${API_BASE_URL}${endpoint}?${params.toString()}`;
  
  console.log(`🔗 Fetching generations from: ${url}`);
  console.log(`📍 Using ${isUsingNextAPI ? 'Next.js API' : 'FastAPI'}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`
    }));
    throw new Error(errorData.detail || errorData.error || `HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(`✅ Received ${Array.isArray(data) ? data.length : 0} generations`);
  
  return data;
};

const deleteGeneration = async (generationId: string): Promise<void> => {
  const isUsingNextAPI = API_BASE_URL.startsWith('/api');
  const endpoint = isUsingNextAPI ? `/generation/${generationId}` : `/gen/${generationId}`;

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

// ✅ Updated hooks with consistent environment detection
export const useGenerationsInfinite = (
  characterId?: string,
  enabled = true
) => {
  const isUsingNextAPI = API_BASE_URL.startsWith('/api');
  
  return useInfiniteQuery<GenType[], Error>({
    queryKey: ['generations', 'infinite', characterId, isUsingNextAPI ? 'nextjs' : 'fastapi'],
    queryFn: ({ pageParam = 0 }) => fetchCharGenerations({
      characterId,
      skip: pageParam as number,
      limit: isUsingNextAPI ? 30 : 20,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      const limit = isUsingNextAPI ? 30 : 20;
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
    enabled,
    staleTime: isUsingNextAPI ? 2 * 60 * 1000 : 30 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGenerations = (
  { characterId, skip, limit }: FetchGenerationsParams = {}, 
  enabled = true
) => {
  const isUsingNextAPI = API_BASE_URL.startsWith('/api');
  
  return useQuery({
    queryKey: ['generations', { characterId, skip, limit }, isUsingNextAPI ? 'nextjs' : 'fastapi'],
    queryFn: () => fetchCharGenerations({ characterId, skip, limit }),
    enabled,
    staleTime: isUsingNextAPI ? 2 * 60 * 1000 : 30 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Rest of your hooks remain the same...
export const useDeleteGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGeneration,
    onMutate: async (generationId) => {
      await queryClient.cancelQueries({ queryKey: ['generations'] });
      const previousGenerations = queryClient.getQueriesData({ queryKey: ['generations'] });

      queryClient.setQueriesData(
        { queryKey: ['generations'] },
        (oldData: any) => {
          if (Array.isArray(oldData)) {
            return oldData.filter((gen: GenType) => gen._id !== generationId);
          }
          return oldData;
        }
      );

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

// Export environment detection utility
export const isUsingDirectMongo = () => API_BASE_URL.startsWith('/api');