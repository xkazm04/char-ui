import { AssetSearchQuery, AssetType, AssetSearchResult, AssetGroup } from '../types/asset';
import { useCallback, useState } from 'react';


const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const semanticSearchAssets = async (searchQuery: AssetSearchQuery): Promise<AssetSearchResult[]> => {
  const params = new URLSearchParams();
  params.append('query', searchQuery.query);
  params.append('limit', (searchQuery.limit || 20).toString());
  params.append('min_score', (searchQuery.min_score || 0.5).toString());
  
  if (searchQuery.asset_type) {
    params.append('asset_type', searchQuery.asset_type);
  }

  const response = await fetch(`${API_BASE_URL}/asset-search/semantic?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      detail: `HTTP error! Status: ${response.status}`
    }));
    throw new Error(errorData.detail || `Semantic search failed: ${response.status}`);
  }

  return response.json();
};

export const useSemanticAssetSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<AssetSearchResult[]>([]);

  const searchAssets = useCallback(async (searchQuery: AssetSearchQuery) => {
    if (!searchQuery.query.trim()) {
      setResults([]);
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await semanticSearchAssets(searchQuery);
      setResults(searchResults);
      return searchResults;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Semantic search failed');
      setError(error);
      setResults([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    searchAssets,
    results,
    isLoading,
    error,
    clearResults
  };
};


export const processSearchResultsIntoGroups = (searchResults: AssetSearchResult[]): AssetGroup[] => {
  if (!searchResults || searchResults.length === 0) return [];

  const assetsByType = searchResults.reduce<Record<string, { assets: AssetType[]; similarities: number[] }>>((acc, result) => {
    const asset = result.asset;
    if (!asset.type) return acc;
    
    const enhancedAsset = { 
      ...asset, 
      id: asset._id,
      // Store similarity score for potential display
      searchSimilarity: result.similarity_mongo 
    };

    if (!acc[asset.type]) {
      acc[asset.type] = { assets: [], similarities: [] };
    }
    acc[asset.type].assets.push(enhancedAsset);
    acc[asset.type].similarities.push(result.similarity_mongo);
    return acc;
  }, {});

  return Object.entries(assetsByType).map(([type, { assets, similarities }]) => {
    const subcategories = assets.reduce<Record<string, AssetType[]>>((acc, asset) => {
      const subcategory = asset.subcategory || 'Other';
      if (!acc[subcategory]) {
        acc[subcategory] = [];
      }
      acc[subcategory].push(asset);
      return acc;
    }, {});

    // Calculate average similarity for the group
    const avgSimilarity = similarities.reduce((sum, sim) => sum + sim, 0) / similarities.length;

    return {
      id: `search-group-${type}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} (${avgSimilarity.toFixed(2)})`,
      assets,
      subcategories,
      avgSimilarity // Store for potential sorting
    };
  }).sort((a, b) => (b.avgSimilarity || 0) - (a.avgSimilarity || 0)); // Sort by relevance
};