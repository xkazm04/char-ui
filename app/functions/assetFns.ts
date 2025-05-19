import { useQuery } from '@tanstack/react-query';
import { AssetType } from '../types/asset';

export interface AssetGroup {
  id: string;
  name: string;
  assets: AssetType[];
  // Add subcategories grouping
  subcategories?: Record<string, AssetType[]>;
}

// Base URL for API endpoints
const API_BASE_URL = 'http://localhost:8000';

// Function to fetch all assets
const fetchAssets = async (): Promise<AssetType[]> => {
  const response = await fetch(`${API_BASE_URL}/assets/`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Process raw assets into grouped assets
export const processAssetsIntoGroups = (assets: AssetType[]): AssetGroup[] => {
  const assetsByType = assets.reduce<Record<string, AssetType[]>>((acc, asset) => {
    if (!asset.type) return acc;
    
    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }

    acc[asset.type].push({
      ...asset,
      id: asset.id || asset._id,
    });
    
    return acc;
  }, {});
  
  // Convert grouped assets into AssetGroup array with subcategories
  return Object.entries(assetsByType).map(([type, typeAssets]) => {
    // Group assets by subcategory
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
      name: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
      assets: typeAssets,
      subcategories
    };
  });
};

// React Query hook for getting all assets
export const useAssets = (enabled = true) => {
  return useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    enabled,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// React Query hook for getting assets grouped by type
export const useAssetGroups = (enabled = true) => {
  const assetsQuery = useAssets(enabled);
  
  // Derive groups from the assets data
  const assetGroups = assetsQuery.data 
    ? processAssetsIntoGroups(assetsQuery.data)
    : [];

  return {
    ...assetsQuery,
    data: assetGroups,
  };
};

// You can add more specific asset queries here as needed
export const useFetchAssetById = (assetId: string, enabled = true) => {
  return useQuery({
    queryKey: ['asset', assetId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/assets/${assetId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json() as Promise<AssetType>;
    },
    enabled: !!assetId && enabled,
  });
};