import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AssetType, PaginatedAssetType } from "@/app/types/asset";
import { performance } from "@/app/styles/design-tokens";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchAssetsParams {
  pageParam?: number;
  type?: string | null;
  pageSize?: number;
}

// Function to fetch a single page of assets
const fetchAssetsPage = async ({
  pageParam = 1,
  type = null,
  pageSize = performance.defaultPageSize,
}: FetchAssetsParams): Promise<PaginatedAssetType> => {
  const params = new URLSearchParams();
  params.append("page", pageParam.toString());
  params.append("page_size", pageSize.toString());
  if (type) {
    params.append("type", type);
  }

  const response = await fetch(`${API_BASE_URL}/assets/?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`,
    }));
    throw new Error(
      errorData.detail || `HTTP error! Status: ${response.status}`
    );
  }
  return response.json();
};

// Hook for optimized asset loading with type-specific queries
export function useOptimizedAssets(
  type: string | null = null,
  enabled = true,
  pageSize = performance.defaultPageSize
) {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const loadedPagesRef = useRef<Set<number>>(new Set([1])); // Track loaded pages
  const isMountedRef = useRef(true);

  // Use React Query for data fetching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery<PaginatedAssetType, Error>({
    queryKey: ["optimizedAssets", type, pageSize],
    queryFn: ({ pageParam }) =>
      fetchAssetsPage({ pageParam, type, pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.total_pages) {
        return lastPage.current_page + 1;
      }
      return undefined; // No more pages
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process and update assets when data changes
  useEffect(() => {
    if (!data || !isMountedRef.current) return;

    const newAssets: AssetType[] = [];
    let hasNewAssets = false;

    data.pages.forEach((page, pageIndex) => {
      if (!loadedPagesRef.current.has(page.current_page)) {
        loadedPagesRef.current.add(page.current_page);
        hasNewAssets = true;
      }

      page.assets.forEach((asset) => {
        newAssets.push(asset);
      });
    });

    if (hasNewAssets || assets.length === 0) {
      setAssets(newAssets);
    }

    if (isInitialLoading && !isLoading) {
      setIsInitialLoading(false);
    }
  }, [data, isLoading, assets.length, isInitialLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load more assets when needed
  const loadMoreAssets = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Reset when type changes
  useEffect(() => {
    setIsInitialLoading(true);
    loadedPagesRef.current = new Set([1]);
  }, [type]);

  return {
    assets,
    isLoading: isInitialLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMoreAssets,
    error,
    refetch,
    totalAssets: data?.pages[0]?.total_assets || 0,
  };
}

// Hook for loading assets by type in parallel
export function useParallelAssetsByType(
  types: string[],
  enabled = true,
  pageSize = performance.defaultPageSize
) {
  const results = types.map((type) => {
    return useOptimizedAssets(type, enabled, pageSize);
  });

  const isLoading = results.some((result) => result.isLoading);
  const isFetchingNextPage = results.some((result) => result.isFetchingNextPage);
  const hasNextPage = results.some((result) => result.hasNextPage);
  const error = results.find((result) => result.error)?.error;

  const loadMoreAssets = useCallback(() => {
    results.forEach((result) => {
      if (result.hasNextPage && !result.isFetchingNextPage) {
        result.loadMoreAssets();
      }
    });
  }, [results]);

  const refetchAll = useCallback(() => {
    results.forEach((result) => result.refetch());
  }, [results]);

  return {
    assetsByType: results.map((result, index) => ({
      type: types[index],
      assets: result.assets,
    })),
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMoreAssets,
    error,
    refetch: refetchAll,
    totalAssets: results.reduce(
      (total, result) => total + result.totalAssets,
      0
    ),
  };
}

