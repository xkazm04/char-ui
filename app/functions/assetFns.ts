import { useQuery } from '@tanstack/react-query';
import { useAssetStore } from '../store/assetStore';

// Define TypeScript interfaces
export interface Asset {
  id?: string;
  _id?: string;
  name: string;
  type: string;
  description?: string;
  image_url?: string;
  thumbnail?: string;
  tags: string[];
  favorite: boolean;
  metadata?: {
    tags?: string[];
    compatible_with?: string[];
  };
}

export interface AssetGroup {
  id: string;
  name: string;
  assets: Asset[];
}

// Base URL for API endpoints
const API_BASE_URL = 'http://localhost:8000';

// Function to fetch all assets
const fetchAssets = async (): Promise<Asset[]> => {
  const response = await fetch(`${API_BASE_URL}/assets/`);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// Process raw assets into grouped assets
export const processAssetsIntoGroups = (assets: Asset[]): AssetGroup[] => {
  const assetsByType = assets.reduce<Record<string, Asset[]>>((acc, asset) => {
    if (!asset.type) return acc;
    
    if (!acc[asset.type]) {
      acc[asset.type] = [];
    }
    
    const tags = asset.metadata?.tags || [];

    acc[asset.type].push({
      ...asset,
      id: asset.id || asset._id, // Ensure id is available
      tags: tags,
      favorite: tags.includes('favorite') || false
    });
    
    return acc;
  }, {});
  
  // Convert grouped assets into AssetGroup array
  return Object.entries(assetsByType).map(([type, typeAssets], index) => ({
    id: `group-${type}`,
    name: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
    assets: typeAssets
  }));
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
      return response.json() as Promise<Asset>;
    },
    enabled: !!assetId && enabled,
  });
};