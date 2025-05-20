import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { AssetType, PaginatedAssetType } from '../types/asset'; // Ensure PaginatedAssetType is imported

export interface AssetGroup {
  id: string;
  name: string;
  assets: AssetType[];
  subcategories?: Record<string, AssetType[]>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FetchAssetsParams {
  pageParam?: number; // For useInfiniteQuery, typically starts at 1
  type?: string | null;
  pageSize?: number;
}

// Function to fetch a single page of assets
const fetchAssetsPage = async ({
  pageParam = 1,
  type = null,
  pageSize = 20, // Default page size matching backend
}: FetchAssetsParams): Promise<PaginatedAssetType> => {
  const params = new URLSearchParams();
  params.append('page', pageParam.toString());
  params.append('page_size', pageSize.toString());
  if (type) {
    params.append('type', type);
  }

  const response = await fetch(`${API_BASE_URL}/assets/?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: `HTTP error! Status: ${response.status}` }));
    throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// React Query hook for getting all assets using infinite scrolling to fetch all pages
export const useAllAssets = (type: string | null = null, enabled = true) => {
  return useInfiniteQuery<PaginatedAssetType, Error>({
    queryKey: ['allAssets', type],
    queryFn: ({ pageParam }) => fetchAssetsPage({ pageParam, type }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.total_pages) {
        return lastPage.current_page + 1;
      }
      return undefined; // No more pages
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // refetchOnWindowFocus: false, // Optional: disable refetch on window focus
  });
};


// Process raw assets into grouped assets
export const processAssetsIntoGroups = (assets: AssetType[]): AssetGroup[] => {
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

// React Query hook for getting assets grouped by type, fetching all pages
export const useAssetGroups = (assetTypeFilter: string | null = null, enabled = true) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch, // Pass refetch through
  } = useAllAssets(assetTypeFilter, enabled);

  // Combine all fetched assets from all pages
  const allAssets: AssetType[] = data?.pages.reduce((acc, page) => acc.concat(page.assets), []) || [];
  
  const assetGroups = processAssetsIntoGroups(allAssets);

  return {
    data: assetGroups, // Processed groups
    allFetchedAssets: allAssets, // Raw list of all fetched assets
    isLoading, // True if initial load is happening
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage, // True if fetching subsequent pages
    refetch, // Expose refetch
  };
};

// Hook for fetching a single asset by ID
export const useFetchAssetById = (assetId: string, enabled = true) => {
  return useQuery<AssetType, Error>({
    queryKey: ['asset', assetId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/assets/${assetId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP error! Status: ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!assetId && enabled,
  });
};