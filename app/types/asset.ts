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

  // New fields for Base64 image data
  image_data_base64?: string | null;
  image_content_type?: string | null;
}

export interface SimilarAsset {
    id: string;
    name: string;
    type: string;
    similarity: number;
    description?: string;
    image_url?: string;
    // Potentially add base64 fields here too if similar assets can return them
    image_data_base64?: string | null;
    image_content_type?: string | null;
}

export interface PaginatedAssetType {
  assets: AssetType[];
  total_assets: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}