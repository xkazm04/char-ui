export interface AssetType {
  id?: string;
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
  created_at?: string;
}

export interface SimilarAsset {
    id: string;
    name: string;
    type: string;
    similarity: number;
    description?: string;
    image_url?: string;
}