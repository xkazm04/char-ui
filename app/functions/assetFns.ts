import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { AssetGroup, AssetType, PaginatedAssetType } from '../types/asset';
import { useCallback } from 'react';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FetchAssetsParams {
  pageParam?: number;
  type?: string | null;
  pageSize?: number;
  useBatching?: boolean;
}

// Enhanced fetch function with batching support
const fetchAssetsPage = async ({
  pageParam = 1,
  type = null,
  pageSize = 50, // Increased default for batching
  useBatching = true,
}: FetchAssetsParams): Promise<PaginatedAssetType> => {
  const params = new URLSearchParams();
  params.append('page', pageParam.toString());
  params.append('page_size', pageSize.toString());
  params.append('image_quality', '25'); // Optimized quality
  params.append('max_image_width', '400'); // Reasonable size for UI

  if (type) {
    params.append('type', type);
  }

  const endpoint = useBatching ? '/assets/batched' : '/assets/';
  const response = await fetch(`${API_BASE_URL}${endpoint}?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`
    }));
    throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  // Normalize response format for consistency
  if (data.batch_id) {
    // Batched response
    return {
      assets: data.assets,
      total_assets: data.total_assets,
      total_pages: data.total_pages,
      current_page: data.current_page,
      page_size: data.page_size,
      batch_id: data.batch_id,
      cache_key: data.cache_key
    } as PaginatedAssetType & { batch_id: string; cache_key: string };
  }

  return data;
};

export const useAllAssets = (type: string | null = null, enabled = true) => {
  return useInfiniteQuery<PaginatedAssetType, Error>({
    queryKey: ['allAssets', type],
    queryFn: ({ pageParam }) => fetchAssetsPage({
      pageParam: pageParam as number,
      type,
      pageSize: 30,
      useBatching: true
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.total_pages) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Optimized asset processing with memoization
export const processAssetsIntoGroups = (assets: AssetType[]): AssetGroup[] => {
  if (!assets || assets.length === 0) return [];

  const assetsByType = assets.reduce<Record<string, AssetType[]>>((acc, asset) => {
    if (!asset.type) return acc;
    const currentAsset = { ...asset, id: asset._id };

    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }
    acc[asset.type].push(currentAsset);
    return acc;
  }, {});

  return Object.entries(assetsByType).map(([type, typeAssets]) => {
    const subcategories = typeAssets.reduce<Record<string, AssetType[]>>((acc, asset) => {
      const subcategory = asset.subcategory || 'Other';
      if (!acc[subcategory]) {
        acc[subcategory] = [];
      }
      acc[subcategory].push(asset);
      return acc;
    }, {});

    return {
      id: `group-${type}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      assets: typeAssets,
      subcategories
    };
  });
};

export const useAssetGroups = (assetTypeFilter: string | null = null, enabled = true) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useAllAssets(assetTypeFilter, enabled);

  const allAssets: AssetType[] = data?.pages.reduce((acc, page) => acc.concat(page.assets), [] as AssetType[]) || [];

  // Memoize asset groups processing
  const assetGroups = processAssetsIntoGroups(allAssets);

  return {
    data: assetGroups,
    allFetchedAssets: allAssets,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
};

// Enhanced hook for prefetching next batches
export const usePrefetchAssets = (type: string | null = null) => {
  const queryClient = useQueryClient();

  const prefetchNextPage = useCallback(async (currentPage: number) => {
    const nextPage = currentPage + 1;

    await queryClient.prefetchQuery({
      queryKey: ['allAssets', type],
      queryFn: () => fetchAssetsPage({
        pageParam: nextPage,
        type,
        pageSize: 50,
        useBatching: true
      }),
      staleTime: 30 * 60 * 1000,
    });
  }, [queryClient, type]);

  return { prefetchNextPage };
};

// Cache invalidation utility
export const useInvalidateAssetCache = () => {
  const queryClient = useQueryClient();

  const invalidateCache = useCallback(async (typeFilter?: string) => {
    try {
      // Invalidate server cache
      await fetch(`${API_BASE_URL}/assets/cache/invalidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type_filter: typeFilter })
      });

      // Invalidate client cache
      await queryClient.invalidateQueries({
        queryKey: typeFilter ? ['allAssets', typeFilter] : ['allAssets']
      });
    } catch (error) {
      console.error('Cache invalidation failed:', error);
    }
  }, [queryClient]);

  return { invalidateCache };
};

// Hook for fetching a single asset by ID (unchanged)
export const useFetchAssetById = (assetId: string, enabled = true) => {
  return useQuery<AssetType, Error>({
    queryKey: ['asset', assetId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/assets/${assetId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `HTTP error! Status: ${response.status}`
        }));
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!assetId && enabled,
  });
};

// Add mutation hook for updating assets
export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail: `HTTP error! Status: ${response.status}`
        }));
        throw new Error(errorData.detail || `Update failed: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: (updatedAsset, { id }) => {
      // Update the asset in all relevant caches
      queryClient.setQueryData(['asset', id], updatedAsset);
      
      // Update asset in infinite query cache
      queryClient.setQueryData(['allAssets'], (oldData: any) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            assets: page.assets.map((asset: AssetType) => 
              asset._id === id ? { ...asset, ...updatedAsset } : asset
            )
          }))
        };
      });

      // Also update any type-filtered queries
      queryClient.invalidateQueries({
        queryKey: ['allAssets'],
        refetchType: 'none', // Don't refetch, just update cache
      });
    },
    onError: (error) => {
      console.error('Asset update failed:', error);
    }
  });
};

export const handleDelete = async (asset: AssetType, onSuccess: () => void) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assets/${asset._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
};

