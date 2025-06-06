export interface AssetType {
  _id: string; 
  name: string;
  type: string;
  subcategory?: string;
  gen: string;
  description?: string;
  image_url?: string; 
  metadata?: {
    tags?: string[];
    compatible_with?: string[];
  };
  created_at?: string; // Should match ISO string format from backend e.g. "2023-05-14T00:00:00Z"

  image_data_base64?: string | null;
  image_content_type?: string | null;

  searchSimilarity?: number; 
}

export interface SimilarAsset {
    id: string;
    name: string;
    type: string;
    description?: string;
    image_url?: string;
    similarity: number; 
    similarity_mongo?: number; 
}

export interface PaginatedAssetType {
  assets: AssetType[];
  total_assets: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

export interface AssetGroup {
  id: string;
  name: string;
  assets: AssetType[];
  subcategories?: Record<string, AssetType[]>;
}

export interface AssetBatchResponse {
  assets: AssetType[];
  batch_id: string;
  total_assets: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  cache_key: string;
}

// Add these types for semantic search
export interface AssetSearchQuery {
  query: string;
  limit?: number;
  min_score?: number;
  asset_type?: string;
}

export interface AssetSearchResult {
  asset: AssetType;
  similarity_mongo: number;
}
